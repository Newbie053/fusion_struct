const db = require('../config/db');

exports.getProperties = (req, res) => {
  db.query('SELECT * FROM properties ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ message: 'DB Error' });
    results.forEach(r => {
      r.images = r.images ? JSON.parse(r.images) : [];
    });
    res.json(results);
  });
};

exports.createProperty = (req, res) => {
  const { title, description, phone } = req.body;
  const imageFiles = req.files ? req.files.map(f => '/uploads/properties/' + f.filename) : [];
  const imageJson = JSON.stringify(imageFiles);

  db.query(
    'INSERT INTO properties (title, description, phone, images) VALUES (?, ?, ?, ?)',
    [title, description, phone, imageJson],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'DB Error' });
      res.json({ message: 'Property added successfully' });
    }
  );
};

exports.deleteProperty = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM properties WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB Error' });
    res.json({ message: 'Property deleted successfully' });
  });
};
