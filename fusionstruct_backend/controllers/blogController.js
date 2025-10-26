const db = require('../config/db');

exports.getBlogs = (req, res) => {
  db.query('SELECT * FROM blogs ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ message: 'DB Error' });
    results.forEach(r => {
      r.image = r.image ? JSON.parse(r.image) : [];
    });
    res.json(results);
  });
};

exports.createBlog = (req, res) => {
  const { title, description } = req.body;
  const imageFiles = req.files ? req.files.map(f => '/uploads/blogs/' + f.filename) : [];
  const imageJson = JSON.stringify(imageFiles);

  db.query(
    'INSERT INTO blogs (title, description, image) VALUES (?, ?, ?)',
    [title, description, imageJson],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'DB Error' });
      res.json({ message: 'Blog added successfully' });
    }
  );
};

exports.deleteBlog = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM blogs WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB Error' });
    res.json({ message: '🗑️ Blog deleted successfully' });
  });
};
