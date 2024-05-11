import { PencilSquareIcon, UsersIcon } from "@heroicons/react/24/solid";

interface Props {
	title: string;
	newChat: () => void;
	findFriends: () => void;
}

const Header = ({ title, newChat, findFriends }: Props) => {
	return (
		<div className="flex flex-row justify-between items-center">
			<h1 className="text-xl">{title}</h1>
			<div className="flex">
				<button onClick={newChat} className="focus:outline-none">
					<PencilSquareIcon className="size-6 sm:size-8 ml-2 cursor-pointer" />
				</button>
				<button onClick={findFriends} className="focus:outline-none">
					<UsersIcon className="size-6 sm:size-8 ml-2 cursor-pointer" />
				</button>
			</div>
		</div>
	);
};

export default Header;
