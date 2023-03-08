const express = require('express');
const connection = require('../connection');
const router = express.Router();
let auth = require('../services/auth');
let checkRole = require('../services/checkRole');

router.post('/add', auth.auth, checkRole.checkRole, (req, res) => {
	let product = req.body;
	query = `insert into product (name, categoryId, description, price, status) values ('${product.name}', ${product.categoryId}, '${product.description}', ${product.price}, '${product.status}')`;
	connection.query(query, (err, results) => {
		if (!err) {
			return res.status(200).json({ message: `Product added successfully` });
		} else {
			return res.status(500).json(err);
		}
	});
});

module.exports = router;
