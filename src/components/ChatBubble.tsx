import { UserCircleIcon } from "@heroicons/react/24/solid";

interface Props {
	username: string;
	timestamp?: string;
	text: string;
	isActive: boolean;
	onClick: () => void;
}

const ChatBubble = ({
	username,
	timestamp,
	text,
	isActive,
	onClick,
}: Props) => {
	return (
		<div
			className={`chat-history mt-6 ${isActive ? "active" : ""}`}
			onClick={onClick}>
			<div className="flex flex-row">
				<UserCircleIcon className="size-12" />
				<div className="chat-detail ml-2 flex-grow">
					<div className="flex flex-row justify-between">
						<h1 className="text-xl">{username}</h1>
						<p className="text-sm">{timestamp}</p>
					</div>
					<p className="text-sm">{text}</p>
				</div>
			</div>
		</div>
	);
};

export default ChatBubble;
