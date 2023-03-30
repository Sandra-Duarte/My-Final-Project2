import { Router } from "express";
import db from "./db";
import logger from "./utils/logger";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, "/images/"));
	},
	filename: (req, file, cb) => {
		//console.log(file);
		const imageName = Date.now() + path.extname(file.originalname);
		cb(null, imageName);
	},
});

const upload = multer({ storage, limits: { fileSize: 3000000 } }).single(
	"image"
);

const express = require("express");
const mg = require("mailgun-js");

const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const router = Router();

const mailgun = () =>
	mg({
		apiKey: process.env.MAILGUN_API_KEY,
		domain: process.env.MAILGUN_DOMAIN,
	});
router.get("/", (_, res) => {
	logger.debug("Welcoming everyone...");
	res.json({ message: "Hello, world!" });
});
router.post("/verify", (request, response) => {
	const textToEveryOne =
		"Congratulations! You are registered as a CYF graduate. Please go to the Signup page to create an account";
	const { email, certificateNum } = request.body;
	const messageData = {
		from: "adiba.fin@gmail.com",
		to: `${email}`,
		certificateNum: `${certificateNum}`,
		text: `<p> ${textToEveryOne} </p>`,
	};
	mailgun()
		.messages()
		.send(messageData, (error) => {
			if (error) {
				// console.log(error)
				response
					.status(500)
					.send({ message: "Not Registered Graduate. Error in sending email" });
			} else {
				// console.log(body)
				return response.send({ message: "Verified. Please check email" });
			}
		});
});
router.post("/upload", (req, res) => {
	upload(req, res, (err) => {
		if (err) {
			res.status(400).send({
				message:
					"Image cannot be uploaded.Please check your image file and try again.",
			});
		} else {
			return res.status(201).json({
				filename: req.file.filename,
			});
		}
	});
});

router.post("/job", async (req, res) => {
	const reqBody = req.body;

	const sqlQuery =
		"INSERT INTO job(title,type,description,responsibilities,number_of_gitcommits,codewar_kata_level,codewar_points,codalitiy_test_points,category,salary_range_min,salary_range_max,contact_name,contact_email,contact_phone,company_name,company_web_site,company_logo,requirements,applications_deadline,number_of_students_can_apply) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,  $16, $17, $18, $19, $20) RETURNING *";

	const values = [
		reqBody.title,
		reqBody.type,
		reqBody.description,
		reqBody.responsibilities,
		reqBody.numberOfGitCommits,
		reqBody.codewarKataLevel,
		reqBody.codewarPoints,
		reqBody.codalitiyTestPoints,
		reqBody.category,
		reqBody.salaryRange.min,
		reqBody.salaryRange.max,
		reqBody.contactName,
		reqBody.contactEmail,
		reqBody.contactPhone,
		reqBody.companyName,
		reqBody.companyWebSite,
		reqBody.companyLogo,
		reqBody.requirements,
		reqBody.applicationsDeadline,
		reqBody.numberOfStudentsCanApply,
	];

	try {
		const dbData = await db.query(sqlQuery, values);
		res.status(200).json(dbData.rows);
	} catch (error) {
		res.status(500).json({ error });
	}
});

router.get("/signup", (request, response) => {
	db.query("select * from  user_data")
		.then((grads) => response.status(200).json(grads.rows))
		.catch((err) => {
			// console.error(err);
			response.status(500).send(err);
		});
});

router.post("/login", (request, response) => {
	const email = request.body.email;
	const password = request.body.password;
	const role = request.body.role;

	if (!email || !password) {
		return response
			.status(400)
			.json({ error: "Email and password are required" });
	}

	db.query(
		"SELECT * FROM user_data WHERE lower(email)=lower($1) AND password=$2 AND lower(role)=lower($3)",
		[email, password, role],
		(err, result) => {
			if (err) {
				return response.status(500).send("Internal Server Error");
			}
			if (result.rows.length === 0) {
				return response
					.status(400)
					.json({ message: "Email or password not found" });
			} else {
				return response.status(201).json({ message: "successfully logged in" });
			}
		}
	);
});

router.post("/signup", (request, response) => {
	const failureObject = {
		result: "failure",
		message: "Please enter all fields",
	};
	const failurePassword = {
		result: "failure Password",
		message: "Password should be at least 6 character",
	};
	const dupEmailFound = {
		result: "Duplicate Email found",
		message: "Grads/Email is already registered",
	};

	const errorFound = {
		result: "Error in registering",
		message: "Error in registering",
	};

	const newEmail = request.body.email;
	const newRole = request.body.role;
	const newUserName = request.body.username;
	const newPassword = request.body.password;

	// console.log({newEmail, newCertificateNum, newUserName, newPassword});
	if (!newEmail || !newUserName || !newRole || !newPassword) {
		return response.status(400).json({ failureObject });
	}

	if (newPassword.length < 8) {
		return response.status(400).json({ failurePassword });
	}

	db.query(
		"SELECT * FROM user_data WHERE email=$1",
		[newEmail],
		(err, result) => {
			if (result.rowCount > 0) {
				return response.status(400).json({ dupEmailFound });
			} else {
				const query =
					"INSERT INTO user_data (email, username, role, password) VALUES ($1, $2, $3, $4)";
				db.query(
					query,
					[newEmail, newUserName, newRole, newPassword],
					(err) => {
						if (err) {
							// throw error;
							// console.error(err);
							return response.status(400).json({ errorFound });
						}
						return response.status(200).send("Grads registered");
						//  console.log(results.rows);
					}
				);
			}
		}
	);
});

export default router;
