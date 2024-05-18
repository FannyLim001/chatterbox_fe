/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-mixed-spaces-and-tabs */
import { useEffect, useState } from "react";
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
import { PageLock } from "../helpers/PageLock";
import axios from "axios";
import socket from "./socket.tsx";

interface User {
	id: string;
	username: string;
	timestamp: string;
	text: string;
	// Add more properties as needed
}

interface Friend {
	username: string;
	id: string;
	lastActive: string;
}

interface Message {
	senderId: string;
	content: string;
	conversationId: string;
	// Add more properties if necessary
}

const Home = () => {
	// Retrieving the Username
	const user = localStorage.getItem("username") || "";
	const userid = localStorage.getItem("userid") || "";

	const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
	const [friends, setFriends] = useState<Friend[]>([]);
	const [selectedChat, setSelectedChat] = useState<{
		index: number;
		isFriend: boolean;
	} | null>(null);

	const [showChats, setShowChats] = useState(true); // State variable to toggle showing chat bubbles
	const [showFriends, setShowFriends] = useState(false); // State variable to toggle showing friends
	const [chatData, setChatData] = useState<{
		username: string;
		reply: string;
	} | null>(null);
	const [newFriend, setNewFriend] = useState("");
	const [messages, setMessages] = useState<
		{
			conversationId?: string | null;
			userid: string;
			reply: string;
		}[]
	>([]);
	const [inputMessage, setInputMessage] = useState<string>(""); // State for input message
	const [selectedConversationId, setSelectedConversationId] = useState<
		string | null
	>(null);

	const isMobile = useMediaQuery({ maxWidth: 768 });

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get<User[]>("/be/api/users");
				const mappedUsers = response.data.map((user) => ({
					id: user.id,
					username: user.username,
					timestamp: "",
					text: "",
				}));
				setDisplayedUsers(mappedUsers);

				mappedUsers.forEach(async (user) => {
					try {
						const messageData: { timestamp: string; text: string } =
							await new Promise((resolve) => {
								socket.emit(
									"fetch_message_data",
									{ userId: user.id },
									(data: { timestamp: string; text: string }) => {
										resolve(data);
									}
								);
							});

						setDisplayedUsers((prevUsers) =>
							prevUsers.map((prevUser) =>
								prevUser.id === user.id
									? {
											...prevUser,
											timestamp: messageData.timestamp,
											text: messageData.text,
									  }
									: prevUser
							)
						);
					} catch (error) {
						console.error("Error fetching message data:", error);
					}
				});
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		};

		fetchUsers();

		const fetchFriends = async () => {
			try {
				const response = await axios.get<{ friends: Friend[] }>("/be/api/friends");
				console.log("Response data:", response.data);

				if (Array.isArray(response.data.friends)) {
					const mappedFriends = response.data.friends.map((friend, index) => ({
						username: friend.username,
						id: friend.id,
						lastActive: `${index + 1} minutes ago`,
					}));
					setFriends(mappedFriends);
				} else {
					console.log("No friends found");
					setFriends([]);
				}
			} catch (error) {
				console.error("Error fetching friends:", error);
			}
		};

		fetchFriends();
	}, []);

	const handleChatBubbleClick = async (index: number, isFriend: boolean) => {
		try {
			let selectedUser;
			if (isFriend) {
				selectedUser = friends[index];
			} else {
				selectedUser = displayedUsers[index];
			}

			if (!selectedUser || !selectedUser.id) {
				console.error("Error: Selected user or user id is undefined");
				return;
			}

			setSelectedChat({ index, isFriend }); // Update selected chat with index and isFriend flag

			// Fetch conversation ID for the selected user
			const conversationResponse = await axios.get(
				`/be/api/conversation/${selectedUser.id}`
			);
			const conversationId = conversationResponse.data.conversationId;

			// Fetch chat history for the selected user using the conversation ID
			const response = await axios.get(`/be/api/conversation/${conversationId}`);
			const chatHistory: Message[] = response.data;
			console.log(response.data);

			setChatData({
				username: selectedUser.username,
				reply:
					chatHistory.length > 0 ? chatHistory[chatHistory.length - 1].content : "",
			});

			if (conversationId) {
				// Update messages state
				setMessages(
					chatHistory.map((message: Message) => ({
						conversationId: message.conversationId,
						userid: message.senderId,
						reply: message.content,
					}))
				);
			}
			// Set selected conversation ID in state
			setSelectedConversationId(conversationId);

			setShowChats(true);

			if (isMobile) {
				setShowChats(false);
			}
		} catch (error) {
			console.error("Error fetching chat data:", error);
		}
	};

	const handleNewChatClick = () => {
		console.log("New chat clicked");
		setShowChats(true);
		setSelectedChat(null);
		setChatData(null);
		setShowFriends(false);
	};

	const handleFindFriends = () => {
		setShowFriends(true);
		setSelectedChat(null);
		setChatData(null);
	};

	const handleAddFriend = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await axios.post(`/be/api/friends/${newFriend}`, {
				username: newFriend,
			});
			console.log(response.data);
		} catch (error) {
			console.error("Add friend error:", error);
		}
	};

	const handleSendMessage = async () => {
		if (selectedChat !== null) {
			const receiverId = selectedChat.isFriend
				? friends[selectedChat.index].id
				: displayedUsers[selectedChat.index].id;

			sendMessage(receiverId, inputMessage);

			setShowChats(true);
			socket.emit("send_message", {
				message: inputMessage,
				fromUserId: userid,
				toUsername: chatData?.username,
			});
			setInputMessage("");
			setMessages((prevMessages) => [
				...prevMessages,
				{
					conversationId: selectedConversationId,
					userid: userid,
					reply: inputMessage,
				},
			]);
		} else {
			console.error("No selected chat");
		}
	};

	const sendMessage = async (receiverId, messageContent) => {
		try {
			const response = await axios.post(
				`/be/api/conversation/send/${receiverId}`,
				{
					message: messageContent,
				}
			);
			// Handle success (optional)
		} catch (error) {
			console.error("Error sending message:", error);
			// Handle error (display error message, etc.)
		}
	};

	useEffect(() => {
		socket.on("receive_message", (data) => {
			setMessages((prevMessages) => [
				...prevMessages,
				{
					conversationId: selectedConversationId,
					userid: data.fromUserId,
					reply: data.message,
				},
			]);
		});

		return () => {
			socket.off("receive_message");
		};
	}, []);

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
								{messages.length > 0 ? (
									// Render chat messages if available
									messages.map((message, index) => (
										<ChatReply
											key={index}
											align={message.userid === userid ? "justify-end" : "justify-start"}
											reply={message.reply}
											className={
												message.userid === userid ? "user-reply" : "another-user-reply"
											}
										/>
									))
								) : (
									// If no messages available, display a message
									<div className="flex justify-center items-center p-6">
										No Message Available
									</div>
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
						{showFriends && (
							<>
								<div className="addfriend">
									<h1 className="text-2xl mt-4">Add New Friends</h1>
									<div className="flex flex-row gap-5 items-center mt-5">
										<input
											type="text"
											placeholder="#chatters username"
											className="friendinput"
											style={{ maxWidth: "100%" }}
										/>
										<button className="friendbtn">Send Friend Request</button>
									</div>
								</div>
								{friends.length === 0 ? (
									<div>No friends available</div>
								) : (
									friends.map((friend, index) => (
										<ChatBubble
											key={index}
											username={friend.username}
											text={friend.lastActive}
											isActive={selectedChat === index}
											onClick={() => handleChatBubbleClick(index, true)}
										/>
									))
								)}
							</>
						)}
						{!showFriends &&
							displayedUsers.map((userData, index) => (
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
						{showFriends && friends.length === 0 && (
							<div className="flex justify-center items-center h-screen">
								No Friends Available
							</div>
						)}
						{showFriends
							? friends.map((friend, index) => (
									<ChatBubble
										key={index}
										username={friend.username}
										text={friend.lastActive}
										isActive={selectedChat !== null && selectedChat.index === index}
										onClick={() => handleChatBubbleClick(index, true)}
									/>
							  ))
							: displayedUsers.map((userData, index) => (
									<ChatBubble
										key={index}
										username={userData.username}
										timestamp={userData.timestamp}
										text={userData.text}
										isActive={selectedChat !== null && selectedChat.index === index}
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
									{messages.length > 0 ? (
										// Render chat messages if available
										messages
											.filter(
												(message) => message.conversationId === selectedConversationId
											)
											.map((message, index) => (
												<ChatReply
													key={index}
													align={message.userid === userid ? "justify-end" : "justify-start"} // Check if sender ID matches current user ID
													reply={message.reply}
													className={
														message.userid === userid ? "user-reply" : "another-user-reply"
													}
												/>
											))
									) : (
										// If no messages available for the selected conversation, display a message
										<div className="flex justify-center items-center p-6">
											No Messages Available
										</div>
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
												value={inputMessage}
												onChange={(e) => setInputMessage(e.target.value)}
											/>
										</div>
										<button onClick={handleSendMessage}>
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
									<form onSubmit={handleAddFriend}>
										<div className="flex flex-row gap-5 items-center mt-5">
											<input
												type="text"
												placeholder="#chatters username"
												className="friendinput"
												value={newFriend}
												onChange={(e) => setNewFriend(e.target.value)}
											/>
											<button className="friendbtn" type="submit">
												Add Friend
											</button>
										</div>
									</form>

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

export default PageLock(Home);
