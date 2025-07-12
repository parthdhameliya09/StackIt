const db = require("./db");

// Send to all users (for new questions)
exports.createGlobalNotification = (data) => {
  const query = `
    INSERT INTO notifications (user_id, type, reference_id, message)
    SELECT id, ?, ?, ? FROM users
  `;
  db.query(query, [data.type, data.reference_id, data.message], (err) => {
    if (err) console.error("Notification error:", err);
  });
};

// For targeted notifications (e.g., notify question author)
exports.createNotification = (data, callback) => {
  const query = `INSERT INTO notifications SET ?`;
  db.query(query, data, callback);
};

// Fetch notifications for a user
exports.getUserNotifications = (userId, callback) => {
  db.query(
    "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
    callback
  );
};
