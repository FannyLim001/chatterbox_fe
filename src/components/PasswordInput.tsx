import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";

const PasswordInput: React.FC = () => {
	const [password, setPassword] = useState<string>("");
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div className="password-input-container inputbar">
			<input
				type={showPassword ? "text" : "password"}
				value={password}
				onChange={handlePasswordChange}
				placeholder="Enter your password"
			/>
			<button
				type="button"
				className={`password-toggle ${showPassword ? "visible" : ""}`}
				onClick={toggleShowPassword}>
				{showPassword ? (
					<EyeIcon className="size-6 sm:size-8 ml-2 cursor-pointer" />
				) : (
					<EyeSlashIcon className="size-6 sm:size-8 ml-2 cursor-pointer" />
				)}
			</button>
		</div>
	);
};

export default PasswordInput;
