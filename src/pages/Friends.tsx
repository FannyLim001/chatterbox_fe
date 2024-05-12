import React from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";

interface User {
	username: string;
	status: string;
}

interface Props {
	users: User[];
	isActive: boolean;
	onClick: (index: number) => void;
}

const Friends: React.FC<Props> = ({ users, isActive, onClick }) => {
	return (
		<div className="friends p-4">
			{users.map((userData, index) => (
				<div
					key={index}
					className={`friend mt-6 ${isActive ? "active" : ""}`}
					onClick={() => onClick(index)}>
					<div className="flex flex-row">
						<UserCircleIcon className="size-12" />
						<div className="friend-detail ml-2 flex-grow">
							<h1 className="text-xl">{userData.username}</h1>
							<p className="text-sm">{userData.status}</p>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default Friends;
