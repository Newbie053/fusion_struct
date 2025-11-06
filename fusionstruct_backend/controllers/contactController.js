const db = require('../config/db');

// Insert message
exports.createContact = (req, res) => {
  console.log("REQ.BODY:", req.body); // <-- add this

  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !phone || !subject || !message) {
    console.log("Missing fields:", req.body); // <-- debug missing fields
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const sql = 'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, email, phone, subject, message], (err, result) => {
    if (err) {
      console.error('Error inserting contact message:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  });
};

// Get all messages (for admin)
exports.getContacts = (req, res) => {
  const sql = 'SELECT * FROM contact_messages ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching contact messages:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    res.status(200).json({ success: true, data: results });
  });
};
