import React from "react";
import "./Buttons.css";

const Button = ({ onClick, Type = "button", text }) => {
	return (
		<button type={Type} onClick={onClick}>
			{text}
		</button>
	);
};
export default Button;
