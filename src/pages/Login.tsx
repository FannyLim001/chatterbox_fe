import { Link } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import { useMediaQuery } from "react-responsive";

const Login = () => {
	const isMobile = useMediaQuery({ maxWidth: 768 });

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
				<h1 className={`${isMobile ? "text-center" : ""} mt-5 text-2xl`}>
					Login Account
				</h1>
				<p className={`${isMobile ? "text-center" : ""} mt-2`}>
					Welcome back <span>#chatters!</span>
				</p>
				<form action="" className="mt-5">
					<div className="group">
						<input type="text" className="inputbar" placeholder="Email" />
					</div>
					<div className="group mt-5">
						<PasswordInput />
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
