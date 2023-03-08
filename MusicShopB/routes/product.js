const express = require('express');
const connection = require('../connection');
const router = express.Router();
let auth = require('../services/auth');
let checkRole = require('../services/checkRole');

router.post('/add', auth.auth, checkRole.checkRole, (req, res) => {
	let product = req.body;
	let query = `insert into product (name, categoryId, description, price, status) values ('${product.name}', ${product.categoryId}, '${product.description}', ${product.price}, '${product.status}')`;
	connection.query(query, (err, results) => {
		if (!err) {
			return res.status(200).json({ message: `Product added successfully` });
		} else {
			return res.status(500).json(err);
		}
	});
});

router.get('/get', auth.auth, (req, res, next) => {
	let query = `select product.id, product.name, product.description, product.price, product.status, category.id as categoryId, category.name as categoryName from product inner join category on true where product.categoryId = category.id`;
	connection.query(query, (err, results) => {
		if (!err) {
			return res.status(200).json(results.rows);
		} else {
			return res.status(500).json(err);
		}
	});
});

router.get('/getByCategory/:id', auth.auth, (req, res, next) => {
	const id = req.params.id;
	let query = `select id, name from product where categoryId = ${id} and status = "true"`;
	connection.query(query, (err, results) => {
		if (!err) {
			return res.status(200).json(results.rows);
		} else {
			return res.status(500).json(err);
		}
	});
});

router.get('/getById/:id', auth.auth, (req, res, next) => {
	const id = req.params.id;
	let query = `select id, name, description, price from product where categoryId = ${id}`;
	connection.query(query, (err, results) => {
		if (!err) {
			return res.status(200).json(results.rows[0]);
		} else {
			return res.status(500).json(err);
		}
	});
});

router.patch('/update', auth.auth, checkRole.checkRole, (req, res, next) => {
	let product = req.body;
	let query = `update product set name = '${product.name}', categoryId = ${product.categoryId}, description = '${product.description}', price = ${product.price} where id = ${product.id}`;
	connection.query(query, (err, results) => {
		if (!err) {
			if (results.affectedRows == 0) {
				return res
					.statusCode(404)
					.json({ message: 'Product id does not exist!' });
			}
			return res.status(200).json({ message: 'Product updated successfully' });
		} else {
			return res.status(500).json(err);
		}
	});
});

module.exports = router;
