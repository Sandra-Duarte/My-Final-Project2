import React, { useState } from "react";
import styles from "./VerifyCertificateNum.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
// import { Link } from "react-router-dom";

export function VerifyCertificateNum() {
	const [email, setEmail] = useState("");
	const [certificateNum, setCertificateNum] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!email || !certificateNum) {
			return toast.error("Please provide email and certificate Number");
		}
		try {
			setLoading(true);
			const { data } = await axios.post("/api", {
				email,
				certificateNum,
			});
			setLoading(false);
			toast.success(data.message);
		} catch (err) {
			setLoading(false);
			toast.error(
				err.response && err.response.data.message
					? err.response.data.message
					: err.message
			);
		}
	};

	return (
		<div className={styles.signUpInfoContainer}>
			<ToastContainer position="bottom-center" limit={1} />

			<form onSubmit={handleSubmit}>
			<h2 className="signUpHeader"> Graduate Verification </h2>
				<div className={styles.emailLabel}>
					<label htmlFor="email"> Email</label>
					<br></br>
					<input
						// required
						type="email"
						value={email}
						placeholder="Enter Email address"
						onChange={(event) => setEmail(event.target.value)}
					/>
				</div>
				<div className={styles.graduateLabel}>
					<label htmlFor="certificateNumber">
						{" "}
						Graduation Certificate Number
					</label>
					<br></br>
					<input
						// required
						type="text"
						placeholder="Enter Certificate Number"
						value={certificateNum}
						onChange={(event) => setCertificateNum(event.target.value)}
					/>
				</div>

				<div id={styles.certificateNumHelp}>
					We will never share your certificate number with anyone else.
				</div>

				<div>
					<button
						disabled={loading}
						type="submit"
						className={styles.btn_secondary}
					>
						{loading ? "Sending ..." : "Submit"}
						{/* <Link to="/signup">Sign Up</Link> */}
					</button>
				</div>
			</form>
		</div>
	);
}
export default VerifyCertificateNum;