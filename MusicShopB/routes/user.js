let { query } = require('express');
const express = require('express');
const router = express.Router();
const connection = require('../connection');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/signup', (req, res) => {
	let user = req.body;
	query = `select email, password, role, status from usert where email = '${user.email}'`;
	connection.query(query, (err, results) => {
		if (!err) {
			if (results.rows.length <= 0) {
				query = `insert into usert(name, contactNumber, email, password, status, role) values ('${user.name}', '${user.contactNumber}', '${user.email}', '${user.password}', 'false', 'user')`;
				connection.query(query, (err, results) => {
					if (!err) {
						return res.status(200).json({ message: 'Successfully registered' });
					} else {
						return res.status(400).json(err);
					}
				});
			} else {
				return res.status(400).json({ message: 'Email already exists' });
			}
		} else {
			return res.status(500).json(err);
		}
	});
});

router.post('/login', (req, res) => {
	let user = req.body;
	query = `select email, password, role, status from usert where email = '${user.email}'`;
	connection.query(query, (err, results) => {
		if (!err) {
			if (
				results.rows.length <= 0 ||
				results.rows[0].password != user.password
			) {
				return res
					.status(401)
					.json({ message: `Incorect username or password` });
			} else if (results.rows[0].status === 'false') {
				return res.status(401).json({ message: 'Wait for admin approval...' });
			} else if (results.rows[0].password == user.password) {
				return res.status(200).json({ message: 'Logged in successfully' });
			} else {
				return res
					.status(400)
					.json({ message: 'Something went wrong :( Please try again later.' });
			}
		} else {
			return res.status(500).json(err);
		}
	});
});

module.exports = router;
