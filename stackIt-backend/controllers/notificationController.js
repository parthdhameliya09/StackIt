const Notification = require("../models/notificationModel");

exports.getUserNotifications = (req, res) => {
  const userId = req.params.userId;
  Notification.getUserNotifications(userId, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
