import { useMediaQuery } from "react-responsive";
import PasswordInput from "../components/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { AuthHelper } from "../helpers/AuthHelper";

const Register = () => {
	const isMobile = useMediaQuery({ maxWidth: 768 });

	const navigate = useNavigate();

	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const { authenticated } = AuthHelper();

	useEffect(() => {
		// Redirect to another page if user is already authenticated
		if (authenticated) {
			navigate("/");
		}
	}, [authenticated, navigate]);

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault(); // Prevent default form submission

		try {
			const response = await axios.post("/be/api/auth/register", {
				username,
				email,
				password,
			});
			console.log(response.data); // Handle successful login
			// Redirect or perform additional actions after successful login
			navigate("/login");
		} catch (error) {
			console.error("Login error:", error);
			// Handle login error (display error message, etc.)
			setError("Registrasi Gagal, coba lagi");
		}
	};

	return (
		<div className="h-screen flex items-center justify-center p-4 gap-10">
			<img
				src="./Sign up-bro.svg"
				className={`${isMobile ? "hidden" : ""} w-4/12 md:w-6/12 lg:w-4/12`}
				alt="Register Picture"
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
					Register Account
				</h1>
				<p className={`${isMobile ? "text-center" : ""} mt-2`}>
					Join Us and become <span>#chatters!</span>
				</p>
				<form onSubmit={handleRegister} className="mt-5">
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
						<input
							type="email"
							className="inputbar"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="group mt-5">
						<PasswordInput password={password} setPassword={setPassword} />
					</div>
					<button className="authbtn mt-8" type="submit">
						Register
					</button>
					<p className="mt-5 text-center">
						Already have account?{" "}
						<Link to={`/login`}>
							<span>Login</span>
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
};

export default Register;
