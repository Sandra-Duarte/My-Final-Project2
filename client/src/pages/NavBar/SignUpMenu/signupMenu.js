import React from "react";
import { Link } from "react-router-dom";
import "./signupMenu.css";

function SignupMenu() {
	return (
		<div className="dropdown" style={{ marginLeft: "750px" }}>
			<button className="dropbtn">SIGN UP</button>
			<div className="dropdown-content">
				<Link to="/signup">EMPLOYABILITY</Link>
				<Link to="/verify">GRADUATE</Link>
			</div>
		</div>
	);
}

export default SignupMenu;
