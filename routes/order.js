const express = require("express");
const router = express.Router();
const db = require("../db");
const axios = require("axios");
const { supplierApi } = require("../config");

// Buat Order Baru
router.post("/create", (req, res) => {
  const { game_id, player_id, product, price } = req.body;

  const order = {
    game_id,
    player_id,
    product,
    price,
    status: "PENDING",
    created_at: new Date()
  };

  db.query("INSERT INTO orders SET ?", order, (err, result) => {
    if (err) throw err;
    res.json({ success: true, order_id: result.insertId });
  });
});

// Callback dari Payment Gateway (dummy)
router.post("/callback/payment", async (req, res) => {
  const { order_id, status } = req.body;

  if (status === "PAID") {
    db.query("SELECT * FROM orders WHERE id = ?", [order_id], async (err, rows) => {
      if (err) throw err;
      const order = rows[0];

      // Panggil API Supplier
      try {
        const response = await axios.post(supplierApi.url, {
          game_id: order.game_id,
          player_id: order.player_id,
          product: order.product
        }, {
          headers: { "Authorization": `Bearer ${supplierApi.key}` }
        });

        db.query("UPDATE orders SET status = ? WHERE id = ?", 
          [response.data.status || "SUCCESS", order_id]);

      } catch (error) {
        db.query("UPDATE orders SET status = ? WHERE id = ?", ["FAILED", order_id]);
      }
    });
  }

  res.json({ success: true });
});

module.exports = router;
