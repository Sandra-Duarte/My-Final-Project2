import React, { useState } from "react";
import style from "./Signup.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
	const navigate = useNavigate();
	const [subFormDate, setSubFormDate] = useState({
		email: "",
		username: "",
		role: "",
		password: "",
	});

	const signupSubmit = (e) => {
		e.preventDefault();
		if (
			axios.post("/api/signup", subFormDate).then((res) => {
				console.log(res.data);
				alert("Signup successful!");

				setSubFormDate({
					email: "",
					username: "",
					role: "",
					password: "",
				});
			})
		) {
			navigate("/");
		}
	};
	return (
		<div className={style.formConteiner}>
			<form onSubmit={signupSubmit}>
				<h1 className={style.formContenerTlitle}> Sign Up</h1>
				<div>
					<label htmlFor="email"> Email: </label>
					<input
						type="text"
						placeholder="Enter Email"
						name="email"
						required
						value={subFormDate.email}
						onChange={(e) =>
							setSubFormDate({
								...subFormDate,
								email: e.target.value,
							})
						}
					/>
				</div>
				<div>
					<label htmlFor="userName"> User Name:</label>
					<input
						type="text"
						placeholder="Enter User Name"
						name="username"
						required
						value={subFormDate.username}
						onChange={(e) =>
							setSubFormDate({
								...subFormDate,
								username: e.target.value,
							})
						}
					/>
				</div>
				<div className={style.containerRole}>
					<label htmlFor="role" className={style.radioLabel}>
						{" "}
						Role:
						<input
							className={style.radioInput}
							onChange={(e) =>
								setSubFormDate({
									...subFormDate,
									role: e.target.value,
								})
							}
							type="radio"
							value="Admin"
							name="role"
						/>{" "}
						Admin
						<input
							className={style.radioInput}
							onChange={(e) =>
								setSubFormDate({
									...subFormDate,
									role: e.target.value,
								})
							}
							type="radio"
							value="Graduate"
							name="role"
						/>{" "}
						Graduate
					</label>
				</div>
				<div>
					<label htmlFor="password"> Password:</label>
					<input
						type="password"
						placeholder="Enter Password"
						name="password"
						required
						value={subFormDate.password}
						onChange={(e) =>
							setSubFormDate({
								...subFormDate,
								password: e.target.value,
							})
						}
					/>
				</div>
				<button type={"submit"}>Submit</button>
			</form>
		</div>
	);
};

export default Signup;
