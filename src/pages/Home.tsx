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
  userid: string;
  lastActive: string;
}

const Home = () => {
  // Retrieving the Username
  const user = localStorage.getItem("username") || "";
  const userid = localStorage.getItem("userid") || "";

  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch user data from the backend
        const response = await axios.get<User[]>("/be/api/users");
        // Map fetched users to the desired structure
        const mappedUsers = response.data.map((user, index) => ({
          id: user.id,
          username: user.username, // Assuming 'name' is the property in your database
          timestamp: `${index + 1}:00`, // Generate timestamp dynamically
          text: `Sample text ${index + 1}`, // Generate text dynamically
        }));
        // Set the mapped users in the state
        setDisplayedUsers(mappedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();

    const fetchFriends = async () => {
      try {
        // Fetch friends' data from the backend
        const response = await axios.get<{ friends: Friend[] }>(
          "/be/api/friends"
        );
        console.log("Response data:", response.data); // Log the response data

        // Check if response data contains 'friends' property and it's an array
        if (Array.isArray(response.data.friends)) {
          // Map fetched friends to the desired structure
          const mappedFriends = response.data.friends.map((friend, index) => ({
            username: friend.username,
            userid: friend.userid,
            lastActive: `${index + 1} minutes ago`,
          }));
          // Set the mapped friends in the state
          setFriends(mappedFriends);
        } else {
          // Handle the case when 'friends' property is not an array
          console.log("No friends found");
          // Optionally, you can set an empty array for friends in the state
          setFriends([]);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, []);

  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [showChats, setShowChats] = useState(true); // State variable to toggle showing chat bubbles
  const [showFriends, setShowFriends] = useState(false); // State variable to toggle showing friends
  const [chatData, setChatData] = useState<{
    username: string;
    reply: string;
  } | null>(null); // State variable to store chat data

  const [newFriend, setNewFriend] = useState("");

  // const users = [
  // 	{ username: "User1", timestamp: "10:00", text: "Bonjour" },
  // 	{ username: "User2", timestamp: "11:30", text: "Hi there!" },
  // 	{ username: "User1", timestamp: "10:00", text: "Bonjour" },
  // 	{ username: "User2", timestamp: "11:30", text: "Hi there!" },
  // 	{ username: "User1", timestamp: "10:00", text: "Bonjour" },
  // 	{ username: "User2", timestamp: "11:30", text: "Hi there!" },
  // 	{ username: "User1", timestamp: "10:00", text: "Bonjour" },
  // 	{ username: "User2", timestamp: "11:30", text: "Hi there!" },
  // ];

  // const friends = [
  // 	{ username: "Friend1", lastActive: "Just now" },
  // 	{ username: "Friend2", lastActive: "5 minutes ago" },
  // 	{ username: "Friend3", lastActive: "10 minutes ago" },
  // 	{ username: "Friend4", lastActive: "15 minutes ago" },
  // 	{ username: "Friend5", lastActive: "20 minutes ago" },
  // ];

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
          username: displayedUsers[index].username,
          reply: displayedUsers[index].text,
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
          username: displayedUsers[index].username,
          reply: displayedUsers[index].text,
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

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const response = await axios.post(`/be/api/friends/${newFriend}`, {
        username: newFriend, // Pass id in the request body
      });
      console.log(response.data); // Handle successful request
      // Redirect or perform additional actions after successful request
    } catch (error) {
      console.error("Add friend error:", error);
      // Handle error (display error message, etc.)
    }
  };

  const [messages, setMessages] = useState<{ userid: string; reply: string }[]>(
    []
  );
  const [inputMessage, setInputMessage] = useState<string>(""); // State for input message

  useEffect(() => {
    // Listener for receiving messages
    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          userid: data.fromUserId, // assuming data.fromUserId is the sender's username
          reply: data.message,
        },
      ]);
    });

    // Cleanup function to remove the listener
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
                {chatData && (
                  <>
                    <ChatReply
                      align="justify-end"
                      reply="tes"
                      className="user-reply"
                    />
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
                    isActive={selectedChat === index}
                    onClick={() => handleChatBubbleClick(index, true)}
                  />
                ))
              : displayedUsers.map((userData, index) => (
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
                      <ChatReply
                        align="justify-end"
                        reply="tes"
                        className="user-reply"
                      />
                      <ChatReply
                        align="justify-start"
                        reply={chatData.reply}
                        className="another-user-reply"
                      />
                    </>
                  )}
                  {messages.length !== 0 &&
                    messages.map((message, key) => (
                      <ChatReply
                        key={key} // Ensure you provide a unique key for each item
                        reply={message.reply}
                        className={
                          message.userid === userid
                            ? "user-reply"
                            : "another-user-reply"
                        }
                        align={
                          message.userid === userid
                            ? "justify-end"
                            : "justify-start"
                        }
                      />
                    ))}
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
                    <button
                      onClick={() => {
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
                            userid: userid, // assuming data.fromUserId is the sender's username
                            reply: inputMessage,
                          },
                        ]);
                      }}
                    >
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
                    Add another <span>#chatters</span> using their chatters
                    username
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
