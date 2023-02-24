let { query } = require('express');
const express = require('express');
const router = express.Router();
const connection = require('../connection');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

//obsługa zapytań post przy rejestracji
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

//obsługa zapytań post przy logowaniu
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
				const response = {
					email: results.rows[0].email,
					role: results.rows[0].role,
				};
				const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
					expiresIn: '8h',
				});
				res.status(200).json({ token: accessToken });
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

let transporter = nodemailer.createTransport({
    service: 'gmail',
	auth: {
		user: process.env.EMAIL,
		pass: process.env.PASSWORD,
	},
});

router.post('/forgotPassword', (req, res) => {
	const user = req.body;
	query = `select email, password from usert where email = '${user.email}'`;
	connection.query(query, (err, results) => {
		if (!err) {
			if (results.rows.length <= 0) {
				return res
					.status(200)
					.json({ message: 'Password sent successfully to your email.' });
			} else {
				let mailOptions = {
					from: process.env.EMAIL,
					to: results.rows[0].email,
					subject: 'Password by Music Store',
					html: `<p><b>Your login details for Music Store: </b><br><b>Email: </b>${results.rows[0].email}<br><b>Password: </b>${results.rows[0].password}<br><a href="http://localhost:4200/">Click here to login</a></p>`,
				};
				transporter.sendMail(mailOptions, function (err, info) {
					if (err) {
						console.log(err);
					} else {
						console.log(`Email sent: ${info.response}`);
					}
				});
			}
		} else {
			return res.status(500).json(err);
		}
	});
});

module.exports = router;
