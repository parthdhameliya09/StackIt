const socketMap = require("../socketMap"); // if you modularize it

exports.createAnswer = (req, res) => {
  const newAnswer = req.body;
  Answer.createAnswer(newAnswer, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const io = req.app.get("io");

    const notifyData = {
      user_id: newAnswer.question_author_id,
      type: "answer_posted",
      reference_id: result.insertId,
      message: `Your question has a new answer!`,
    };

    Notification.createNotification(notifyData, (err) => {
      if (err) console.error("Notification error:", err);
    });

    const targetSocket = userSockets[newAnswer.question_author_id];
    if (targetSocket) {
      targetSocket.emit("new-notification", {
        type: "answer_posted",
        message: notifyData.message,
      });
    }

    res.status(201).json({ id: result.insertId, ...newAnswer });
  });
};
