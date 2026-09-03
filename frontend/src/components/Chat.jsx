import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import {
  FiSend,
  FiX,
  FiUser,
  FiMessageCircle,
  FiArrowRight,
} from "react-icons/fi";
import "./Chat.css";

const API_URL = "https://stayfinder-property-rental.onrender.com";

const getUserId = (user) => {
  if (!user) return null;
  return user._id || user.id;
};

function Chat({ onClose }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  /* ================= USER ================= */

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      setLoading(false);
      return;
    }

    try {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
    } catch (error) {
      console.error("User session error:", error);
    }

    setLoading(false);
  }, []);

  /* ================= SOCKET ================= */

  useEffect(() => {
    if (!currentUser) return;

    const userId = getUserId(currentUser);

    if (!userId) return;

    const newSocket = io(API_URL, {
      transports: ["websocket"],
    });

    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      newSocket.emit("joinRoom", userId);
    });

    newSocket.on("receiveMessage", (newMessage) => {
      const senderId = getUserId(newMessage.sender);
      const receiverId = getUserId(newMessage.receiver);

      const currentId = getUserId(currentUser);
      const selectedId = getUserId(selectedUser);

      if (
        !(
          (senderId === currentId && receiverId === selectedId) ||
          (senderId === selectedId && receiverId === currentId)
        )
      ) {
        return;
      }

      setMessages((previous) => {
        const exists = previous.some(
          (msg) =>
            msg._id &&
            newMessage._id &&
            msg._id === newMessage._id
        );

        if (exists) return previous;

        return [...previous, newMessage];
      });
    });

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [currentUser, selectedUser]);

  /* ================= LOAD USERS ================= */

  useEffect(() => {
    if (!currentUser) return;

    const loadUsers = async () => {
      try {
        let url = "";

        if (currentUser.role === "tenant") {
          url = `${API_URL}/api/messages/owners`;
        } else if (currentUser.role === "owner") {
          url = `${API_URL}/api/messages/tenants`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (response.ok && data.success) {
          const currentId = getUserId(currentUser);

          const filteredUsers = (data.data || []).filter(
            (user) => getUserId(user) !== currentId
          );

          const uniqueUsers = filteredUsers.filter(
            (user, index, array) =>
              index ===
              array.findIndex(
                (item) =>
                  getUserId(item) === getUserId(user)
              )
          );

          setUsers(uniqueUsers);

          if (uniqueUsers.length > 0) {
            setSelectedUser(uniqueUsers[0]);
          }
        }
      } catch (error) {
        console.error("Load users error:", error);
      }
    };

    loadUsers();
  }, [currentUser]);

  /* ================= LOAD MESSAGES ================= */

  useEffect(() => {
    if (!currentUser || !selectedUser) {
      setMessages([]);
      return;
    }

    const currentId = getUserId(currentUser);
    const selectedId = getUserId(selectedUser);

    const loadMessages = async () => {
      try {
        setLoadingMessages(true);

        const response = await fetch(
          `${API_URL}/api/messages/${currentId}/${selectedId}`
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setMessages(data.data || []);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Load messages error:", error);
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [currentUser, selectedUser]);

  /* ================= AUTO SCROLL ================= */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /* ================= SEND ================= */

  const handleSend = async (e) => {
    e.preventDefault();

    const text = message.trim();

    if (!text || !currentUser || !selectedUser || sending) {
      return;
    }

    const senderId = getUserId(currentUser);
    const receiverId = getUserId(selectedUser);

    try {
      setSending(true);

      const response = await fetch(
        `${API_URL}/api/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender: senderId,
            receiver: receiverId,
            message: text,
            property: null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Message failed.");
        return;
      }

      const savedMessage = data.data;

      setMessages((previous) => [
        ...previous,
        savedMessage,
      ]);

      if (socketRef.current) {
        socketRef.current.emit("sendMessage", {
          _id: savedMessage._id,
          sender: senderId,
          receiver: receiverId,
          message: text,
          property: null,
          createdAt: savedMessage.createdAt,
        });
      }

      setMessage("");
    } catch (error) {
      console.error("Send error:", error);
      alert(
        "Backend running आहे का ते check करा."
      );
    } finally {
      setSending(false);
    }
  };

  /* ================= SELECT USER ================= */

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setMessages([]);
  };

  const isTenant = currentUser?.role === "tenant";

  const listTitle = isTenant
    ? "Property Owners"
    : "Tenants";

  const subtitle = isTenant
    ? "Chat with property owners"
    : "Chat with tenants";

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="chat-container">
        <div className="chat-loading">
          Loading chat...
        </div>
      </div>
    );
  }

  /* ================= MAIN ================= */

  return (
    <div className="chat-container">

      {/* HEADER */}

      <div className="chat-topbar">

        <div>
          <h2>
            <FiMessageCircle />
            Messages
          </h2>

          <p>{subtitle}</p>
        </div>

        {onClose && (
          <button
            className="chat-close-btn"
            onClick={onClose}
          >
            <FiX />
          </button>
        )}

      </div>

      {/* BODY */}

      <div className="chat-body">

        {/* LEFT SIDE */}

        <div className="chat-users">

          <div className="chat-users-title">
            {listTitle}
          </div>

          <div className="chat-user-list">

            {users.length === 0 ? (

              <div className="chat-empty-users">
                <FiUser size={30} />

                <p>
                  No {isTenant
                    ? "property owners"
                    : "tenants"} found.
                </p>
              </div>

            ) : (

              users.map((user) => {

                const userId = getUserId(user);

                const selectedId =
                  getUserId(selectedUser);

                return (
                  <button
                    key={userId}
                    className={`chat-user ${
                      userId === selectedId
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleSelectUser(user)
                    }
                  >

                    <div className="chat-user-icon">
                      <FiUser />
                    </div>

                    <div className="chat-user-info">

                      <strong>
                        {user.name || "User"}
                      </strong>

                      <span>
                        {isTenant
                          ? "Property Owner"
                          : "Tenant"}
                      </span>

                    </div>

                    <FiArrowRight className="chat-user-arrow" />

                  </button>
                );
              })
            )}

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="chat-window">

          {selectedUser ? (

            <>

              {/* USER HEADER */}

              <div className="chat-window-header">

                <div className="chat-selected-user-icon">
                  <FiUser />
                </div>

                <div className="chat-selected-user-info">

                  <h3>
                    {selectedUser.name || "User"}
                  </h3>

                  <p>
                    {isTenant
                      ? "Property Owner"
                      : "Tenant"}
                  </p>

                </div>

                <div className="chat-online">
                  <span></span>
                  Online
                </div>

              </div>

              {/* MESSAGES */}

              <div className="chat-messages">

                {loadingMessages ? (

                  <div className="chat-loading-messages">
                    Loading messages...
                  </div>

                ) : messages.length === 0 ? (

                  <div className="chat-no-messages">

                    <FiMessageCircle size={48} />

                    <h3>
                      No messages yet
                    </h3>

                    <p>
                      Start the conversation with{" "}
                      {selectedUser.name}.
                    </p>

                  </div>

                ) : (

                  messages.map((msg, index) => {

                    const senderId =
                      getUserId(msg.sender);

                    const currentId =
                      getUserId(currentUser);

                    const isMine =
                      senderId === currentId;

                    return (
                      <div
                        key={msg._id || index}
                        className={`chat-message-row ${
                          isMine
                            ? "mine"
                            : "theirs"
                        }`}
                      >

                        <div
                          className={`chat-message ${
                            isMine
                              ? "mine"
                              : "theirs"
                          }`}
                        >

                          <p>
                            {msg.message}
                          </p>

                          <span>
                            {msg.createdAt
                              ? new Date(
                                  msg.createdAt
                                ).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )
                              : ""}
                          </span>

                        </div>

                      </div>
                    );
                  })

                )}

                <div ref={messagesEndRef}></div>

              </div>

              {/* INPUT */}

              <form
                className="chat-input-area"
                onSubmit={handleSend}
              >

                <input
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                />

                <button
                  type="submit"
                  disabled={
                    sending ||
                    !message.trim()
                  }
                >

                  {sending
                    ? "Sending..."
                    : "Send"}

                  <FiSend />

                </button>

              </form>

            </>

          ) : (

            <div className="chat-no-selection">

              <FiMessageCircle size={48} />

              <h3>
                No user selected
              </h3>

              <p>
                Select a user to start chatting.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Chat;