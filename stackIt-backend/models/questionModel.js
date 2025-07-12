const db = require("./db");

exports.getAllQuestions = (callback) => {
  db.query("SELECT * FROM questions", callback);
};

exports.createQuestion = (data, callback) => {
  db.query("INSERT INTO questions SET ?", data, callback);
};
