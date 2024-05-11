interface Props {
	align: string;
	reply: string;
	className: string;
}

const ChatReply = ({ align, reply, className }: Props) => {
	return (
		<div className={`flex ${align}`}>
			<div className={className}>{reply}</div>
		</div>
	);
};

export default ChatReply;
