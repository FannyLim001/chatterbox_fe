import { useMediaQuery } from "react-responsive";
import PasswordInput from "../components/PasswordInput";
import { Link } from "react-router-dom";

const Register = () => {
	const isMobile = useMediaQuery({ maxWidth: 768 });

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
				<h1 className={`${isMobile ? "text-center" : ""} mt-5 text-2xl`}>
					Register Account
				</h1>
				<p className={`${isMobile ? "text-center" : ""} mt-2`}>
					Join Us and become <span>#chatters!</span>
				</p>
				<form action="" className="mt-5">
					<div className="group">
						<input type="text" className="inputbar" placeholder="Username" />
					</div>
					<div className="group mt-5">
						<input type="text" className="inputbar" placeholder="Email" />
					</div>
					<div className="group mt-5">
						<PasswordInput />
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
