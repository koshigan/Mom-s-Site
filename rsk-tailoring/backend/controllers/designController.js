const db = require('../db'); // adjust path if needed

app.get('/api/designs', async (req, res) => {
  try {
    console.log("👉 Fetching designs from DB");

    const [rows] = await db.query("SELECT * FROM designs"); // ✅ correct

    console.log("✅ Data fetched:", rows.length);

    res.json(rows);
  } catch (err) {
    console.error("❌ ERROR FETCHING DESIGNS:", err); // 🔥 IMPORTANT
    res.status(500).json({ message: "Failed to fetch designs" });
  }
});

const addDesign = async (req, res) => {
  try {
    const { design_name, price } = req.body;
    let image_url = req.body.image_url;

    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    if (!design_name || !price || !image_url) {
      return res.status(400).json({ message: 'Design name, image, and price are required.' });
    }

    const [result] = await db.query(
      'INSERT INTO designs (design_name, image_url, price) VALUES (?, ?, ?)',
      [design_name, image_url, parseFloat(price)]
    );

    const [newDesign] = await db.query('SELECT * FROM designs WHERE id = ?', [result.insertId]);
    res.status(201).json(newDesign[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add design.' });
  }
};

const updateDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const { design_name, price } = req.body;
    let image_url = req.body.image_url;

    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    const [existing] = await db.query('SELECT * FROM designs WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Design not found.' });
    }

    const updatedName = design_name || existing[0].design_name;
    const updatedPrice = price || existing[0].price;
    const updatedImage = image_url || existing[0].image_url;

    await db.query(
      'UPDATE designs SET design_name = ?, image_url = ?, price = ? WHERE id = ?',
      [updatedName, updatedImage, parseFloat(updatedPrice), id]
    );

    const [updated] = await db.query('SELECT * FROM designs WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update design.' });
  }
};

const deleteDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await db.query('SELECT * FROM designs WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Design not found.' });
    }

    await db.query('DELETE FROM designs WHERE id = ?', [id]);
    res.json({ message: 'Design deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete design.' });
  }
};

module.exports = { getAllDesigns, addDesign, updateDesign, deleteDesign };
