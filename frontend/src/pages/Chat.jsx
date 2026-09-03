import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  FiMessageCircle,
  FiSend,
  FiX,
  FiUser,
} from "react-icons/fi";

const API_URL = " https://stayfinder-property-rental.onrender.com";

function Chat({ onClose }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // ------------------------------------
  // GET CURRENT USER
  // ------------------------------------
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        if (user && user._id) {
          setCurrentUser(user);
          return;
        }
      }

      // Temporary test user
      setCurrentUser({
        _id: "68b5f5a12345678912345678",
        name: "Test Owner",
        email: "owner@test.com",
        role: "owner",
      });
    } catch (error) {
      console.error("User Session Error:", error);

      setCurrentUser({
        _id: "68b5f5a12345678912345678",
        name: "Test Owner",
        email: "owner@test.com",
        role: "owner",
      });
    }
  }, []);

  // ------------------------------------
  // GET USERS
  // ------------------------------------
  useEffect(() => {
    if (!currentUser) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);

        const endpoint =
          currentUser.role === "owner"
            ? `${API_URL}/api/messages/tenants`
            : `${API_URL}/api/messages/owners`;

        const response = await fetch(endpoint);

        const data = await response.json();

        if (data.success) {
          setUsers(data.data || []);

          if (data.data && data.data.length > 0) {
            setSelectedUser(data.data[0]);
          }
        } else {
          console.error("Failed to fetch users:", data.message);
        }
      } catch (error) {
        console.error("Fetch Users Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser]);

  // ------------------------------------
  // SOCKET CONNECTION
  // ------------------------------------
  useEffect(() => {
    if (!currentUser?._id) return;

    const socket = io(API_URL);

    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);

      socket.emit("joinRoom", currentUser._id);
    });

    socket.on("receiveMessage", (newMessage) => {
      console.log("📩 New message:", newMessage);

      const senderId =
        typeof newMessage.sender === "object"
          ? newMessage.sender._id
          : newMessage.sender;

      const receiverId =
        typeof newMessage.receiver === "object"
          ? newMessage.receiver._id
          : newMessage.receiver;

      const isCurrentConversation =
        selectedUser &&
        ((senderId === selectedUser._id &&
          receiverId === currentUser._id) ||
          (senderId === currentUser._id &&
            receiverId === selectedUser._id));

      if (isCurrentConversation) {
        setMessages((prev) => {
          const exists = prev.some(
            (msg) => msg._id === newMessage._id
          );

          if (exists) return prev;

          return [...prev, newMessage];
        });
      }
    });

    socket.on("messageSent", (sentMessage) => {
      console.log("✅ Message sent:", sentMessage);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser, selectedUser]);

  // ------------------------------------
  // LOAD CONVERSATION
  // ------------------------------------
  useEffect(() => {
    if (!currentUser?._id || !selectedUser?._id) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/messages/${currentUser._id}/${selectedUser._id}`
        );

        const data = await response.json();

        if (data.success) {
          setMessages(data.data || []);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Fetch Messages Error:", error);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [currentUser, selectedUser]);

  // ------------------------------------
  // SEND MESSAGE
  // ------------------------------------
  const handleSendMessage = async (e) => {
    e.preventDefault();

    const trimmedMessage = messageText.trim();

    if (!trimmedMessage) return;

    if (!currentUser?._id) {
      alert("User session not found.");
      return;
    }

    if (!selectedUser?._id) {
      alert("Please select a user.");
      return;
    }

    try {
      setSending(true);

      const messageData = {
        sender: currentUser._id,
        receiver: selectedUser._id,
        message: trimmedMessage,
        property: null,
      };

      // Save message in MongoDB
      const response = await fetch(
        `${API_URL}/api/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messageData),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error("Send Message Error:", data);
        alert(data.message || "Message could not be sent.");
        return;
      }

      const savedMessage = data.data;

      // Show immediately on sender side
      setMessages((prev) => {
        const exists = prev.some(
          (msg) => msg._id === savedMessage._id
        );

        if (exists) return prev;

        return [...prev, savedMessage];
      });

      // Send real-time socket message
      const socket = io(API_URL);

      socket.emit("sendMessage", {
        _id: savedMessage._id,
        sender: currentUser._id,
        receiver: selectedUser._id,
        message: savedMessage.message,
        property: savedMessage.property || null,
        createdAt: savedMessage.createdAt,
      });

      setMessageText("");

      setTimeout(() => {
        socket.disconnect();
      }, 500);
    } catch (error) {
      console.error("Send Message Error:", error);
      alert("Something went wrong while sending message.");
    } finally {
      setSending(false);
    }
  };

  // ------------------------------------
  // ENTER KEY
  // ------------------------------------
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      handleSendMessage(e);
    }
  };

  // ------------------------------------
  // USER NAME
  // ------------------------------------
  const getUserName = (user) => {
    if (!user) return "";

    return user.name || user.email || "User";
  };

  // ------------------------------------
  // MESSAGE SENDER ID
  // ------------------------------------
  const getSenderId = (message) => {
    if (!message?.sender) return "";

    if (typeof message.sender === "object") {
      return message.sender._id;
    }

    return message.sender;
  };

  // ------------------------------------
  // FORMAT TIME
  // ------------------------------------
  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ------------------------------------
  // LOADING
  // ------------------------------------
  if (!currentUser || loading) {
    return (
      <section className="tenant-chat-section">
        <div className="chat-page-header">
          <div>
            <h1>
              <FiMessageCircle />
              Messages
            </h1>

            <p>
              {currentUser?.role === "owner"
                ? "Chat with tenants"
                : "Chat with property owners"}
            </p>
          </div>

          {onClose && (
            <button
              className="tenant-chat-close"
              onClick={onClose}
              type="button"
            >
              <FiX />
            </button>
          )}
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #e6ebf1",
            borderRadius: "15px",
            minHeight: "520px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#788597",
          }}
        >
          Loading chat...
        </div>
      </section>
    );
  }

  return (
    <section className="tenant-chat-section">
      {/* ------------------------------------
          CHAT HEADER
      ------------------------------------ */}
      <div className="chat-page-header">
        <div>
          <h1>
            <FiMessageCircle />
            Messages
          </h1>

          <p>
            {currentUser.role === "owner"
              ? "Chat with tenants"
              : "Chat with property owners"}
          </p>
        </div>

        {onClose && (
          <button
            className="tenant-chat-close"
            onClick={onClose}
            type="button"
          >
            <FiX />
          </button>
        )}
      </div>

      {/* ------------------------------------
          CHAT CONTAINER
      ------------------------------------ */}
      <div className="tenant-chat-container">

        {/* ------------------------------------
            LEFT USER LIST
        ------------------------------------ */}
        <div className="tenant-owner-list">

          <div className="owner-list-title">
            <h3>
              {currentUser.role === "owner"
                ? "Tenants"
                : "Property Owners"}
            </h3>
          </div>

          <div className="owners-container">

            {users.length === 0 ? (
              <div
                style={{
                  padding: "25px 18px",
                  textAlign: "center",
                  color: "#8490a1",
                  fontSize: "12px",
                }}
              >
                <FiUser
                  style={{
                    fontSize: "28px",
                    marginBottom: "10px",
                  }}
                />

                <p style={{ margin: 0 }}>
                  No{" "}
                  {currentUser.role === "owner"
                    ? "tenants"
                    : "property owners"}{" "}
                  found.
                </p>
              </div>
            ) : (
              users.map((user) => (
                <button
                  key={user._id}
                  type="button"
                  className={`tenant-owner-item ${
                    selectedUser?._id === user._id
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="tenant-owner-avatar">
                    <FiUser />
                  </div>

                  <div className="tenant-owner-info">
                    <strong>
                      {getUserName(user)}
                    </strong>

                    <span>
                      {currentUser.role === "owner"
                        ? "Tenant"
                        : "Property Owner"}
                    </span>
                  </div>

                  <FiMessageCircle />
                </button>
              ))
            )}

          </div>
        </div>

        {/* ------------------------------------
            RIGHT CHAT WINDOW
        ------------------------------------ */}
        <div className="tenant-chat-window">

          {selectedUser ? (
            <>
              {/* CHAT PERSON HEADER */}
              <div className="tenant-chat-header">

                <div className="tenant-chat-person">

                  <div className="tenant-chat-person-icon">
                    <FiUser />
                  </div>

                  <div>
                    <h3>
                      {getUserName(selectedUser)}
                    </h3>

                    <p>
                      {currentUser.role === "owner"
                        ? "Tenant"
                        : "Property Owner"}
                    </p>
                  </div>

                </div>

                <div className="tenant-online">
                  <span></span>
                  Online
                </div>

              </div>

              {/* MESSAGES */}
              <div className="tenant-chat-messages">

                {messages.length === 0 ? (
                  <div className="tenant-empty-chat">

                    <FiMessageCircle />

                    <h3>
                      Start a conversation
                    </h3>

                    <p>
                      Send a message to{" "}
                      {getUserName(selectedUser)}
                    </p>

                  </div>
                ) : (
                  messages.map((message) => {

                    const senderId =
                      getSenderId(message);

                    const isMyMessage =
                      senderId === currentUser._id;

                    return (
                      <div
                        key={message._id}
                        className={`tenant-message-row ${
                          isMyMessage
                            ? "tenant-message-right"
                            : "tenant-message-left"
                        }`}
                      >
                        <div
                          className={`tenant-message-bubble ${
                            isMyMessage
                              ? "tenant-my-message"
                              : "tenant-owner-message"
                          }`}
                        >
                          <p>
                            {message.message}
                          </p>

                          <small>
                            {formatTime(
                              message.createdAt
                            )}
                          </small>
                        </div>
                      </div>
                    );
                  })
                )}

              </div>

              {/* INPUT */}
              <form
                className="tenant-chat-input-area"
                onSubmit={handleSendMessage}
              >
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) =>
                    setMessageText(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  disabled={sending}
                />

                <button
                  type="submit"
                  disabled={sending || !messageText.trim()}
                >
                  <FiSend />

                  {sending ? "Sending..." : "Send"}
                </button>
              </form>
            </>
          ) : (
            <div className="tenant-empty-chat">

              <FiMessageCircle />

              <h3>
                Select a user
              </h3>

              <p>
                Select someone from the list to start chatting.
              </p>

            </div>
          )}

        </div>
      </div>
    </section>
  );
}

export default Chat;