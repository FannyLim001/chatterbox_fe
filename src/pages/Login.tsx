import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import { useEffect, useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { AuthHelper } from "../helpers/AuthHelper";

const Login = () => {
	const isMobile = useMediaQuery({ maxWidth: 768 });

	const navigate = useNavigate();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const { authenticated } = AuthHelper();

	useEffect(() => {
		// Redirect to another page if user is already authenticated
		if (authenticated) {
			navigate("/");
		}
	}, [authenticated, navigate]);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault(); // Prevent default form submission

		try {
			const response = await axios.post("/api/login", {
				username,
				password,
			});
			console.log(response.data); // Handle successful login
			// Redirect or perform additional actions after successful login
			navigate("/");
		} catch (error) {
			console.error("Login error:", error);
			// Handle login error (display error message, etc.)
			setError("Login Gagal, coba lagi");
		}
	};

	return (
		<div className="h-screen flex items-center justify-center p-4 gap-10">
			<img
				src="./Computer login-bro.svg"
				className={`${isMobile ? "hidden" : ""} w-4/12 md:w-6/12 lg:w-4/12`}
				alt="Login Picture"
			/>
			<div className="form">
				<div className="flex flex-row justify-center">
					<img src="/chatterbox-logo.svg" alt="" className="w-3/12" />
					<h1 className="brand-logo text-3xl ml-5 mt-5">
						Chatter<span>Box</span>
					</h1>
				</div>
				{error && (
					<div className="alert flex mt-5">
						<ExclamationTriangleIcon className="size-6 sm:size-8" />
						<h1 className="mt-1 ml-2">{error}</h1>
					</div>
				)}
				<h1 className={`${isMobile ? "text-center" : ""} mt-5 text-2xl`}>
					Login Account
				</h1>
				<p className={`${isMobile ? "text-center" : ""} mt-2`}>
					Welcome back <span>#chatters!</span>
				</p>
				<form onSubmit={handleLogin} className="mt-5">
					<div className="group">
						<input
							type="text"
							className="inputbar"
							placeholder="Username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>
					<div className="group mt-5">
						<PasswordInput password={password} setPassword={setPassword} />
					</div>
					<button className="authbtn mt-8" type="submit">
						Login
					</button>
					<p className="mt-5 text-center">
						Don't have account?{" "}
						<Link to={`/register`}>
							<span>Register</span>
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
};

export default Login;
