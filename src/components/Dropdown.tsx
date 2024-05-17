import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthHelper } from "../helpers/AuthHelper";

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

export interface Props {
	username: string;
}

export default function Dropdown({ username }: Props) {
	const navigate = useNavigate();
	const { setAuthenticated } = AuthHelper();

	const handleLogout = async (e: React.FormEvent) => {
		e.preventDefault(); // Prevent default form submission behavior
		console.log("tes");
		try {
			// Send a POST request to the logout endpoint
			await axios.post("/be/api/auth/logout");
			// Redirect the user to the login page
			setAuthenticated(false);
			navigate("/login");
		} catch (error) {
			console.error("Logout failed:", error);
			// Handle logout failure if needed
		}
	};

	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
					<UserCircleIcon className="size-6 sm:size-8" />
					<h1 className="text-xl sm:text-xl ml-2">{username}</h1>
					<ChevronDownIcon
						className="-mr-1 h-5 w-5 text-gray-400"
						aria-hidden="true"
					/>
				</Menu.Button>
			</div>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95">
				<Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						<Menu.Item>
							{({ active }) => (
								<a
									href="#"
									className={classNames(
										active ? "bg-gray-100 text-gray-900" : "text-gray-700",
										"block px-4 py-2 text-sm"
									)}>
									Account settings
								</a>
							)}
						</Menu.Item>
						<form onSubmit={handleLogout}>
							<Menu.Item>
								{({ active }) => (
									<button
										type="submit"
										className={classNames(
											active ? "bg-gray-100 text-gray-900" : "text-gray-700",
											"block w-full px-4 py-2 text-left text-sm"
										)}>
										Log Out
									</button>
								)}
							</Menu.Item>
						</form>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
}
