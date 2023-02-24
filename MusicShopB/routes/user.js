let { query } = require('express');
const express = require('express');
const router = express.Router();
const connection = require('../connection');

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

module.exports = router;
