import React, { useEffect, useRef } from "react";
import ChatHeader from "../components/ChatHeader";
import MessageInput from "../components/MessageInput";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessage,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  console.log("autheuser", authUser);
  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
    subscribeToMessage();
    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessage,
    unsubscribeFromMessages,
  ]);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Scroll khi có tin nhắn mới

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <div>Loading messages...</div>{" "}
        {/* Hoặc một skeleton loading component */}
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* full height */}
      <ChatHeader />
      <div className="h-[500px] overflow-y-auto p-4 space-y-4 scroll-smooth scrollbar-thin scrollbar-thumb-gray-400">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`chat ${
              msg.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messagesEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    msg.senderId === authUser._id
                      ? authUser.profilePicture || "avatar.png"
                      : selectedUser.profilePicture || "avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time dateTime="" className="text-xs opacity-50 ml-1">
                {formatMessageTime(msg.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex">
              {msg.image && (
                <img
                  src={msg.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {msg.text && <p>{msg.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
