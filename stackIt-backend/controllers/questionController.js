const Question = require("../models/questionModel");
const Notification = require("../models/notificationModel");

exports.getQuestions = (req, res) => {
  Question.getAllQuestions((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.createQuestion = (req, res) => {
  const newQuestion = req.body;
  const io = req.app.get("io");

  Question.createQuestion(newQuestion, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const message = `New question posted: ${newQuestion.title}`;
    Notification.createGlobalNotification({
      type: "question_posted",
      reference_id: result.insertId,
      message,
    });

    // Real-time notification
    if (io) {
      io.emit("new-notification", {
        type: "question_posted",
        message,
      });
    }

    res.status(201).json({ id: result.insertId, ...newQuestion });
  });
};
