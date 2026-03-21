const db = require('../db');

const getAllOrders = async (req, res) => {
  try {
    const { phone, status } = req.query;
    let query = `
      SELECT o.*, d.design_name, d.image_url 
      FROM orders o 
      LEFT JOIN designs d ON o.design_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (phone) {
      query += ' AND o.phone LIKE ?';
      params.push(`%${phone}%`);
    }

    if (status) {
      query += ' AND o.order_status = ?';
      params.push(status);
    }

    query += ' ORDER BY o.order_time DESC';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
};

const placeOrder = async (req, res) => {
  try {
    const { customer_name, phone, measurements, design_id, price } = req.body;

    if (!customer_name || !phone || !measurements || !design_id || !price) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const [designRows] = await db.query('SELECT * FROM designs WHERE id = ?', [design_id]);
    if (designRows.length === 0) {
      return res.status(404).json({ message: 'Selected design not found.' });
    }

    const [result] = await db.query(
      'INSERT INTO orders (customer_name, phone, measurements, design_id, price) VALUES (?, ?, ?, ?, ?)',
      [customer_name, phone, measurements, design_id, parseFloat(price)]
    );

    const [newOrder] = await db.query(
      `SELECT o.*, d.design_name FROM orders o LEFT JOIN designs d ON o.design_id = d.id WHERE o.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: 'Order placed successfully! We will contact you soon.',
      order: newOrder[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to place order.' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status } = req.body;

    const validStatuses = ['Pending', 'Stitching', 'Ready', 'Delivered'];
    if (!validStatuses.includes(order_status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const [existing] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    await db.query('UPDATE orders SET order_status = ? WHERE id = ?', [order_status, id]);
    res.json({ message: 'Order status updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update order.' });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    await db.query('DELETE FROM orders WHERE id = ?', [id]);
    res.json({ message: 'Order deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete order.' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM orders');
    const [[{ pending }]] = await db.query("SELECT COUNT(*) as pending FROM orders WHERE order_status = 'Pending'");
    const [[{ stitching }]] = await db.query("SELECT COUNT(*) as stitching FROM orders WHERE order_status = 'Stitching'");
    const [[{ ready }]] = await db.query("SELECT COUNT(*) as ready FROM orders WHERE order_status = 'Ready'");
    const [[{ delivered }]] = await db.query("SELECT COUNT(*) as delivered FROM orders WHERE order_status = 'Delivered'");
    const [[{ totalRevenue }]] = await db.query("SELECT SUM(price) as totalRevenue FROM orders WHERE order_status = 'Delivered'");
    const [[{ totalDesigns }]] = await db.query('SELECT COUNT(*) as totalDesigns FROM designs');

    const [recentOrders] = await db.query(`
      SELECT o.*, d.design_name FROM orders o 
      LEFT JOIN designs d ON o.design_id = d.id 
      ORDER BY o.order_time DESC LIMIT 5
    `);

    res.json({
      stats: { total, pending, stitching, ready, delivered, totalRevenue: totalRevenue || 0, totalDesigns },
      recentOrders
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch dashboard data.' });
  }
};

module.exports = { getAllOrders, placeOrder, updateOrderStatus, deleteOrder, getDashboardStats };
