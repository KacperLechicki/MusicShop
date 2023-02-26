const express = require('express');
const connection = require('../connection');
const router = express.Router();
let auth = require('../services/auth');
let checkRole = require('../services/checkRole');

router.post('/add', auth.auth, checkRole.checkRole, (req, res, next) => {
	let category = req.body;
	query = `insert into category (name) values ('${category.name}')`;
	connection.query(query, (err, results) => {
		if (!err) {
			return res.status(200).json({ message: 'Category added successfully' });
		} else {
			return res.status(500).json(err);
		}
	});
});

router.get('/get', auth.auth, (req, res, next) => {
	query = `select * from category order by name`;
	connection.query(query, (err, results) => {
		if (!err) {
			return res.status(200).json(results.rows);
		} else {
			return res.status(500).json(err);
		}
	});
});

router.patch('/update', auth.auth, checkRole.checkRole, (req, res, next) => {
	let category = req.body;
	query = `update category set name = '${category.name}' where id = ${category.id}`;
	connection.query(query, (err, results) => {
		if (!err) {
			if (results.affectedRows == 0) {
				return res
					.statusCode(404)
					.json({ message: 'Category id is not exist!' });
			}
			return res.status(200).json({ message: 'Category updated successfully' });
		} else {
			return res.status(500).json(err);
		}
	});
});

module.exports = router;
