import Dropdown, { Props } from "./Dropdown";

const Navbar = ({ username }: Props) => {
	return (
		<div className="navbar">
			<div className="container p-4">
				<div className="flex flex-row justify-between items-center">
					<div className="flex flex-row items-center">
						<img src="/chatterbox-logo.svg" alt="" className="w-2/12 sm:w-1/12" />
						<h1 className="brand-logo text-xl sm:text-2xl ml-4">
							Chatter<span>Box</span>
						</h1>
					</div>
					<Dropdown username={username} />
				</div>
			</div>
		</div>
	);
};

export default Navbar;
