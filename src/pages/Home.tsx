/* eslint-disable no-mixed-spaces-and-tabs */
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import ChatBubble from "../components/ChatBubble";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Searchbar from "../components/Searchbar";
import {
	PaperAirplaneIcon,
	PaperClipIcon,
	UserCircleIcon,
} from "@heroicons/react/24/solid";
import ChatReply from "../components/ChatReply";

const Home = () => {
	const user = "Fanny";
	const [selectedChat, setSelectedChat] = useState<number | null>(null);
	const [showChats, setShowChats] = useState(true); // State variable to toggle showing chat bubbles
	const [showFriends, setShowFriends] = useState(false); // State variable to toggle showing friends
	const [chatData, setChatData] = useState<{
		username: string;
		reply: string;
	} | null>(null); // State variable to store chat data

	const users = [
		{ username: "User1", timestamp: "10:00", text: "Bonjour" },
		{ username: "User2", timestamp: "11:30", text: "Hi there!" },
		{ username: "User1", timestamp: "10:00", text: "Bonjour" },
		{ username: "User2", timestamp: "11:30", text: "Hi there!" },
		{ username: "User1", timestamp: "10:00", text: "Bonjour" },
		{ username: "User2", timestamp: "11:30", text: "Hi there!" },
		{ username: "User1", timestamp: "10:00", text: "Bonjour" },
		{ username: "User2", timestamp: "11:30", text: "Hi there!" },
	];

	const friends = [
		{ username: "Friend1", lastActive: "Just now" },
		{ username: "Friend2", lastActive: "5 minutes ago" },
		{ username: "Friend3", lastActive: "10 minutes ago" },
		{ username: "Friend4", lastActive: "15 minutes ago" },
	];

	const isMobile = useMediaQuery({ maxWidth: 768 });

	const handleChatBubbleClick = (index: number, isFriend: boolean) => {
		if (isMobile) {
			setSelectedChat(index);
			setShowChats(false);
			if (isFriend) {
				setChatData({
					username: friends[index].username,
					reply: "Start a conversation with " + friends[index].username,
				});
			} else {
				setChatData({
					username: users[index].username,
					reply: users[index].text,
				});
			}
		} else {
			setSelectedChat(index);
			if (isFriend) {
				setChatData({
					username: friends[index].username,
					reply: "Start a conversation with " + friends[index].username,
				});
			} else {
				setChatData({
					username: users[index].username,
					reply: users[index].text,
				});
			}
		}
	};

	const handleNewChatClick = () => {
		console.log("New chat clicked");
		setShowChats(true); // Set showChats to true
		setSelectedChat(null); // Ensure selectedChat is null when clicking on new chat button
		setChatData(null); // Reset chat data when clicking on new chat button
		setShowFriends(false);
	};

	const handleFindFriends = () => {
		setShowFriends(true);
		setSelectedChat(null);
		setChatData(null);
	};

	return (
		<>
			<Navbar username={user} />
			{isMobile ? (
				selectedChat !== null ? (
					<div className="chat p-4">
						<Header
							title="Chat"
							newChat={handleNewChatClick}
							findFriends={handleFindFriends}
						/>
						<div className="mt-4">
							<div className="user-detail">
								<div className="flex flex-row">
									<UserCircleIcon className="size-12" />
									<div className="chat-detail ml-2 flex-grow">
										<h1 className="text-xl">{chatData?.username}</h1>
										<p className="text-sm">Online</p>
									</div>
								</div>
							</div>
							<div className="user-chat">
								{chatData && (
									<>
										<ChatReply align="justify-end" reply="tes" className="user-reply" />
										<ChatReply
											align="justify-start"
											reply={chatData.reply}
											className="another-user-reply"
										/>
									</>
								)}
							</div>
							<div className="user-type">
								<div className="flex flex-row justify-between">
									<div className="flex items-center">
										<PaperClipIcon className="size-6" />
										<input type="text" className="ml-2" placeholder="Type Something..." />
									</div>
									<button onClick={() => setShowChats(true)}>
										<PaperAirplaneIcon className="size-6" />
									</button>
								</div>
							</div>
						</div>
					</div>
				) : (
					<div className="chats p-4">
						<div className="sticky top-0 bg-white">
							<Header
								title={showChats ? "Chats" : "Chat"}
								newChat={handleNewChatClick}
								findFriends={handleFindFriends}
							/>
							<Searchbar />
						</div>
						{showFriends
							? friends.map((friend, index) => (
									<ChatBubble
										key={index}
										username={friend.username}
										text={friend.lastActive}
										isActive={selectedChat === index}
										onClick={() => handleChatBubbleClick(index, true)}
									/>
							  ))
							: users.map((userData, index) => (
									<ChatBubble
										key={index}
										username={userData.username}
										timestamp={userData.timestamp}
										text={userData.text}
										isActive={selectedChat === index}
										onClick={() => handleChatBubbleClick(index, false)}
									/>
							  ))}
					</div>
				)
			) : (
				<div className="flex">
					<div className="chats p-4 w-1/2">
						<div className="sticky top-0 bg-white">
							<Header
								title={showChats ? "Chats" : "Chat"}
								newChat={handleNewChatClick}
								findFriends={handleFindFriends}
							/>
							<Searchbar />
						</div>
						{showFriends
							? friends.map((friend, index) => (
									<ChatBubble
										key={index}
										username={friend.username}
										text={friend.lastActive}
										isActive={selectedChat === index}
										onClick={() => handleChatBubbleClick(index, true)}
									/>
							  ))
							: users.map((userData, index) => (
									<ChatBubble
										key={index}
										username={userData.username}
										timestamp={userData.timestamp}
										text={userData.text}
										isActive={selectedChat === index}
										onClick={() => handleChatBubbleClick(index, false)}
									/>
							  ))}
					</div>
					{chatData ? (
						<div className="chat p-4 w-1/2">
							<div className="mt-4">
								<div className="user-detail">
									<div className="flex flex-row">
										<UserCircleIcon className="size-12" />
										<div className="chat-detail ml-2 flex-grow">
											<h1 className="text-xl">{chatData?.username}</h1>
											<p className="text-sm">Online</p>
										</div>
									</div>
								</div>
								<div className="user-chat">
									{chatData && (
										<>
											<ChatReply align="justify-end" reply="tes" className="user-reply" />
											<ChatReply
												align="justify-start"
												reply={chatData.reply}
												className="another-user-reply"
											/>
										</>
									)}
								</div>
								<div className="user-type">
									<div className="flex flex-row justify-between">
										<div className="flex items-center">
											<PaperClipIcon className="size-6" />
											<input
												type="text"
												className="ml-2"
												placeholder="Type Something..."
											/>
										</div>
										<button onClick={() => setShowChats(true)}>
											<PaperAirplaneIcon className="size-6" />
										</button>
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className="chat p-4 w-1/2 flex flex-col items-center justify-center">
							{showFriends ? (
								<>
									<h1 className="text-2xl">Add New Friends</h1>
									<p>
										Add another <span>#chatters</span> using their chatters username
									</p>
									<div className="flex flex-row gap-5 items-center mt-5">
										<input
											type="text"
											placeholder="#chatters username"
											className="friendinput"
											style={{ maxWidth: "100%" }}
										/>
										<button className="friendbtn">Send Friend Request</button>
									</div>

									<img src="./Social interaction-bro.svg" alt="Find Friends" />
								</>
							) : (
								<>
									<h1 className="text-2xl">ChatterBox for Website</h1>
									<p>
										Find your another <span>#chatters</span>
									</p>
									<img src="./Speech bubbles-bro.svg" alt="No chat data" />
								</>
							)}
						</div>
					)}
				</div>
			)}
		</>
	);
};

export default Home;
