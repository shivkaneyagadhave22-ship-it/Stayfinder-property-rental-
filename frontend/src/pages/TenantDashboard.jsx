import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./TenantDashboard.css";

import {
  FiGrid,
  FiSearch,
  FiHeart,
  FiMail,
  FiMessageCircle,
  FiUser,
  FiLogOut,
  FiArrowRight,
  FiHome,
  FiChevronDown,
  FiSend,
  FiX,
} from "react-icons/fi";

const API_URL = "http://localhost:5000";

function TenantDashboard() {
  // ========================================
  // USER
  // ========================================

  const storedUser = localStorage.getItem("user");

  let currentUser = null;

  try {
    currentUser = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch (error) {
    console.error("User Session Error:", error);
    currentUser = null;
  }

  // ========================================
  // STATES
  // ========================================

  const [owners, setOwners] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  const [loadingOwners, setLoadingOwners] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [showChat, setShowChat] = useState(false);

  // ========================================
  // SOCKET REFERENCES
  // ========================================

  const socketRef = useRef(null);

  const selectedOwnerRef = useRef(null);

  // ========================================
  // KEEP SELECTED OWNER UPDATED
  // ========================================

  useEffect(() => {
    selectedOwnerRef.current = selectedOwner;
  }, [selectedOwner]);

  // ========================================
  // GET PROPERTY OWNERS
  // ========================================

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        setLoadingOwners(true);

        const response = await fetch(
          `${API_URL}/api/messages/owners`
        );

        const data = await response.json();

        console.log("Property Owners:", data);

        if (data.success) {
          setOwners(data.data || []);
        } else {
          setOwners([]);
        }
      } catch (error) {
        console.error("Owner Fetch Error:", error);
        setOwners([]);
      } finally {
        setLoadingOwners(false);
      }
    };

    fetchOwners();
  }, []);

  // ========================================
  // SOCKET.IO CONNECTION
  // ========================================

  useEffect(() => {
    if (!currentUser?._id) {
      console.log(
        "❌ Tenant session not found."
      );
      return;
    }

    console.log(
      "🔵 Connecting Tenant Socket:",
      currentUser._id
    );

    const newSocket = io(API_URL, {
      transports: ["websocket", "polling"],
    });

    socketRef.current = newSocket;

    // ======================================
    // SOCKET CONNECTED
    // ======================================

    newSocket.on("connect", () => {
      console.log(
        "🟢 Tenant Socket Connected:",
        newSocket.id
      );

      // Join tenant's personal room
      newSocket.emit(
        "joinRoom",
        currentUser._id
      );

      console.log(
        "👤 Tenant joined room:",
        currentUser._id
      );
    });

    // ======================================
    // RECEIVE MESSAGE FROM OWNER
    // ======================================

    const handleReceiveMessage = (newMessage) => {
      console.log(
        "📩 Tenant received message:",
        newMessage
      );

      const senderId =
        typeof newMessage.sender === "object"
          ? newMessage.sender?._id
          : newMessage.sender;

      const receiverId =
        typeof newMessage.receiver === "object"
          ? newMessage.receiver?._id
          : newMessage.receiver;

      const activeOwner =
        selectedOwnerRef.current;

      // ====================================
      // CHECK CURRENT CONVERSATION
      // ====================================

      if (
        activeOwner &&
        senderId === activeOwner._id &&
        receiverId === currentUser._id
      ) {
        setMessages((prev) => {
          const alreadyExists = prev.some(
            (msg) =>
              msg._id &&
              newMessage._id &&
              msg._id === newMessage._id
          );

          if (alreadyExists) {
            console.log(
              "⚠️ Duplicate message ignored"
            );

            return prev;
          }

          console.log(
            "✅ Message added to Tenant chat"
          );

          return [...prev, newMessage];
        });
      }
    };

    newSocket.on(
      "receiveMessage",
      handleReceiveMessage
    );

    // ======================================
    // SOCKET DISCONNECT
    // ======================================

    newSocket.on("disconnect", () => {
      console.log(
        "🔴 Tenant Socket Disconnected"
      );
    });

    // ======================================
    // SOCKET ERROR
    // ======================================

    newSocket.on("connect_error", (error) => {
      console.error(
        "❌ Tenant Socket Error:",
        error
      );
    });

    // ======================================
    // CLEANUP
    // ======================================

    return () => {
      console.log(
        "🔴 Closing Tenant Socket"
      );

      newSocket.off(
        "receiveMessage",
        handleReceiveMessage
      );

      newSocket.off("connect");
      newSocket.off("disconnect");
      newSocket.off("connect_error");

      newSocket.disconnect();

      socketRef.current = null;
    };
  }, [currentUser?._id]);

  // ========================================
  // OPEN CHAT
  // ========================================

  const openChat = async (owner) => {
    if (!owner?._id) {
      console.error(
        "❌ Invalid property owner."
      );
      return;
    }

    if (!currentUser?._id) {
      alert(
        "User session not found. Please login again."
      );
      return;
    }

    console.log(
      "💬 Opening conversation:",
      currentUser._id,
      "↔",
      owner._id
    );

    // ======================================
    // SET SELECTED OWNER
    // ======================================

    setSelectedOwner(owner);

    selectedOwnerRef.current = owner;

    setShowChat(true);

    setLoadingMessages(true);

    setMessages([]);

    // ======================================
    // LOAD OLD CONVERSATION
    // ======================================

    try {
      const response = await fetch(
        `${API_URL}/api/messages/${currentUser._id}/${owner._id}`
      );

      const data = await response.json();

      console.log(
        "📜 Conversation History:",
        data
      );

      if (data.success) {
        setMessages(data.data || []);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error(
        "Get Messages Error:",
        error
      );

      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  // ========================================
  // SEND MESSAGE
  // ========================================

  const sendMessage = async (e) => {
    e.preventDefault();

    const trimmedMessage =
      messageText.trim();

    if (!trimmedMessage) {
      return;
    }

    // ======================================
    // CHECK USER
    // ======================================

    if (!currentUser?._id) {
      alert(
        "User session not found. Please login again."
      );

      return;
    }

    // ======================================
    // CHECK OWNER
    // ======================================

    if (!selectedOwner?._id) {
      alert(
        "Please select a property owner first."
      );

      return;
    }

    // ======================================
    // CREATE MESSAGE DATA
    // ======================================

    const messageData = {
      sender: currentUser._id,
      receiver: selectedOwner._id,
      message: trimmedMessage,
      property: null,
    };

    console.log(
      "📤 Tenant sending message:",
      messageData
    );

    try {
      // ====================================
      // 1. SAVE MESSAGE TO MONGODB
      // ====================================

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

      console.log(
        "💾 MongoDB Response:",
        data
      );

      // ====================================
      // CHECK RESPONSE
      // ====================================

      if (!response.ok || !data.success) {
        alert(
          data.message ||
            "Failed to send message."
        );

        return;
      }

      // ====================================
      // 2. SHOW MESSAGE ON TENANT SCREEN
      // ====================================

      setMessages((prev) => {
        const alreadyExists = prev.some(
          (msg) =>
            msg._id &&
            data.data?._id &&
            msg._id === data.data._id
        );

        if (alreadyExists) {
          return prev;
        }

        return [...prev, data.data];
      });

      // ====================================
      // 3. SEND REAL-TIME SOCKET MESSAGE
      // ====================================

      if (
        socketRef.current &&
        socketRef.current.connected
      ) {
        socketRef.current.emit(
          "sendMessage",
          {
            sender: currentUser._id,
            receiver: selectedOwner._id,
            message: trimmedMessage,
            property: null,
            _id: data.data._id,
            createdAt:
              data.data.createdAt,
          }
        );

        console.log(
          "⚡ Tenant message sent through Socket.IO"
        );
      } else {
        console.warn(
          "⚠️ Tenant Socket is not connected."
        );
      }

      // ====================================
      // 4. CLEAR INPUT
      // ====================================

      setMessageText("");

    } catch (error) {
      console.error(
        "Send Message Error:",
        error
      );

      alert(
        "Unable to send message. Please try again."
      );
    }
  };

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  // ========================================
  // FORMAT TIME
  // ========================================

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ========================================
  // RETURN
  // ========================================

  return (
    <div className="tenant-dashboard">

      {/* ========================================
          SIDEBAR
      ======================================== */}

      <aside className="tenant-sidebar">

        <div className="tenant-sidebar-logo">

          <span className="logo-home">
            🏠
          </span>

          <span className="logo-stay">
            Stay
          </span>

          <span className="logo-finder">
            Finder
          </span>

        </div>

        <div className="sidebar-line"></div>

        <nav className="tenant-sidebar-nav">

          {/* DASHBOARD */}

          <a
            href="#"
            className={!showChat ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();

              setShowChat(false);
            }}
          >
            <FiGrid />

            <span>
              Dashboard
            </span>
          </a>

          {/* BROWSE PROPERTIES */}

          <a
            href="#"
            onClick={(e) =>
              e.preventDefault()
            }
          >
            <FiSearch />

            <span>
              Browse Properties
            </span>
          </a>

          {/* WISHLIST */}

          <a
            href="#"
            onClick={(e) =>
              e.preventDefault()
            }
          >
            <FiHeart />

            <span>
              Wishlist
            </span>
          </a>

          {/* MY REQUESTS */}

          <a
            href="#"
            onClick={(e) =>
              e.preventDefault()
            }
          >
            <FiMail />

            <span>
              My Requests
            </span>
          </a>

          {/* MESSAGES */}

          <a
            href="#"
            className={
              showChat ? "active" : ""
            }
            onClick={(e) => {
              e.preventDefault();

              setShowChat(true);

              if (
                owners.length > 0 &&
                !selectedOwner
              ) {
                openChat(owners[0]);
              }
            }}
          >
            <FiMessageCircle />

            <span>
              Messages
            </span>
          </a>

          {/* PROFILE */}

          <a
            href="#"
            onClick={(e) =>
              e.preventDefault()
            }
          >
            <FiUser />

            <span>
              Profile
            </span>
          </a>

        </nav>

        {/* LOGOUT */}

        <div className="tenant-sidebar-bottom">

          <div className="sidebar-line"></div>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();

              handleLogout();
            }}
          >
            <FiLogOut />

            <span>
              Logout
            </span>
          </a>

        </div>

      </aside>

      {/* ========================================
          MAIN
      ======================================== */}

      <main className="tenant-main">

        {/* ========================================
            HEADER
        ======================================== */}

        <header className="tenant-header">

          <div className="welcome-section">

            <h1>
              Welcome back! 👋
            </h1>

            <p>
              Find your perfect home with
              StayFinder.
            </p>

          </div>

          <div className="tenant-user">

            <div className="tenant-user-icon">
              <FiUser />
            </div>

            <div className="tenant-user-info">

              <strong>
                {currentUser?.name ||
                  "Tenant"}
              </strong>

              <span>
                Tenant
              </span>

            </div>

            <FiChevronDown
              className="user-arrow"
            />

          </div>

        </header>

        {/* ========================================
            CHAT
        ======================================== */}

        {showChat ? (

          <section className="tenant-chat-section">

            {/* CHAT TITLE */}

            <div className="chat-page-header">

              <div>

                <h1>
                  <FiMessageCircle />

                  Messages
                </h1>

                <p>
                  Chat with property owners
                </p>

              </div>

              <button
                className="tenant-chat-close"
                onClick={() => {

                  setShowChat(false);

                  setSelectedOwner(null);

                  selectedOwnerRef.current = null;

                  setMessages([]);

                  setMessageText("");
                }}
              >
                <FiX />
              </button>

            </div>

            {/* ====================================
                CHAT MAIN
            ==================================== */}

            <div className="tenant-chat-container">

              {/* ==================================
                  LEFT OWNER LIST
              ================================== */}

              <div className="tenant-owner-list">

                <div className="owner-list-title">

                  <h3>
                    Property Owners
                  </h3>

                </div>

                {loadingOwners ? (

                  <div className="tenant-chat-loading">
                    Loading property owners...
                  </div>

                ) : owners.length === 0 ? (

                  <div className="tenant-no-owner">

                    <FiHome />

                    <p>
                      No property owners
                      available yet.
                    </p>

                  </div>

                ) : (

                  <div className="owners-container">

                    {owners.map((owner) => (

                      <button
                        key={owner._id}
                        className={`tenant-owner-item ${
                          selectedOwner?._id ===
                          owner._id
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          openChat(owner)
                        }
                      >

                        <div className="tenant-owner-avatar">

                          <FiUser />

                        </div>

                        <div className="tenant-owner-info">

                          <strong>
                            {owner.name ||
                              "Property Owner"}
                          </strong>

                          <span>
                            Property Owner
                          </span>

                        </div>

                        <FiArrowRight />

                      </button>

                    ))}

                  </div>

                )}

              </div>

              {/* ==================================
                  RIGHT CHAT WINDOW
              ================================== */}

              <div className="tenant-chat-window">

                {selectedOwner ? (

                  <>

                    {/* CHAT HEADER */}

                    <div className="tenant-chat-header">

                      <div className="tenant-chat-person">

                        <div className="tenant-chat-person-icon">

                          <FiUser />

                        </div>

                        <div>

                          <h3>
                            {selectedOwner.name ||
                              "Property Owner"}
                          </h3>

                          <p>
                            Property Owner
                          </p>

                        </div>

                      </div>

                      <div className="tenant-online">

                        <span></span>

                        Online

                      </div>

                    </div>

                    {/* ==================================
                        MESSAGES
                    ================================== */}

                    <div className="tenant-chat-messages">

                      {loadingMessages ? (

                        <div className="tenant-empty-chat">

                          <p>
                            Loading messages...
                          </p>

                        </div>

                      ) : messages.length === 0 ? (

                        <div className="tenant-empty-chat">

                          <FiMessageCircle />

                          <h3>
                            No messages yet
                          </h3>

                          <p>
                            Start the conversation
                            with{" "}
                            {selectedOwner.name ||
                              "the property owner"}.
                          </p>

                        </div>

                      ) : (

                        messages.map(
                          (msg, index) => {

                            const senderId =
                              typeof msg.sender ===
                              "object"
                                ? msg.sender?._id
                                : msg.sender;

                            const isMine =
                              senderId ===
                              currentUser?._id;

                            return (

                              <div
                                key={
                                  msg._id ||
                                  index
                                }
                                className={`tenant-message-row ${
                                  isMine
                                    ? "tenant-message-right"
                                    : "tenant-message-left"
                                }`}
                              >

                                <div
                                  className={`tenant-message-bubble ${
                                    isMine
                                      ? "tenant-my-message"
                                      : "tenant-owner-message"
                                  }`}
                                >

                                  <p>
                                    {msg.message}
                                  </p>

                                  <small>
                                    {formatTime(
                                      msg.createdAt
                                    )}
                                  </small>

                                </div>

                              </div>

                            );
                          }
                        )

                      )}

                    </div>

                    {/* ==================================
                        INPUT
                    ================================== */}

                    <form
                      className="tenant-chat-input-area"
                      onSubmit={sendMessage}
                    >

                      <input
                        type="text"
                        placeholder="Type your message..."
                        value={messageText}
                        onChange={(e) =>
                          setMessageText(
                            e.target.value
                          )
                        }
                      />

                      <button
                        type="submit"
                        disabled={
                          !messageText.trim()
                        }
                      >

                        Send

                        <FiSend />

                      </button>

                    </form>

                  </>

                ) : (

                  <div className="tenant-empty-chat">

                    <FiMessageCircle />

                    <h3>
                      Select a conversation
                    </h3>

                    <p>
                      Choose a property owner
                      from the left to start
                      chatting.
                    </p>

                  </div>

                )}

              </div>

            </div>

          </section>

        ) : (

          /* ========================================
             NORMAL DASHBOARD
          ======================================== */

          <>

            {/* ======================================
                STAT CARDS
            ====================================== */}

            <section className="tenant-stats">

              <div className="tenant-stat-card">

                <div className="stat-icon pink">
                  <FiHeart />
                </div>

                <div className="stat-content">

                  <span>
                    Wishlist
                  </span>

                  <h2>
                    0
                  </h2>

                </div>

              </div>

              <div className="tenant-stat-card">

                <div className="stat-icon blue">
                  <FiMail />
                </div>

                <div className="stat-content">

                  <span>
                    My Requests
                  </span>

                  <h2>
                    0
                  </h2>

                </div>

              </div>

              <div className="tenant-stat-card">

                <div className="stat-icon green">
                  <FiHome />
                </div>

                <div className="stat-content">

                  <span>
                    Saved Properties
                  </span>

                  <h2>
                    0
                  </h2>

                </div>

              </div>

              <div className="tenant-stat-card">

                <div className="stat-icon purple">
                  <FiMessageCircle />
                </div>

                <div className="stat-content">

                  <span>
                    Messages
                  </span>

                  <h2>
                    {messages.length}
                  </h2>

                </div>

              </div>

            </section>

            {/* ======================================
                QUICK ACTIONS
            ====================================== */}

            <section className="tenant-section">

              <div className="tenant-section-title">

                <h2>
                  Quick Actions
                </h2>

                <p>
                  What would you like to do?
                </p>

              </div>

              <div className="quick-actions">

                {/* BROWSE */}

                <button className="quick-action-card">

                  <div className="quick-icon pink">
                    <FiSearch />
                  </div>

                  <div className="quick-content">

                    <h3>
                      Browse Properties
                    </h3>

                    <p>
                      Find your perfect home
                    </p>

                  </div>

                  <FiArrowRight
                    className="quick-arrow"
                  />

                </button>

                {/* WISHLIST */}

                <button className="quick-action-card">

                  <div className="quick-icon pink">
                    <FiHeart />
                  </div>

                  <div className="quick-content">

                    <h3>
                      My Wishlist
                    </h3>

                    <p>
                      View your saved
                      properties
                    </p>

                  </div>

                  <FiArrowRight
                    className="quick-arrow"
                  />

                </button>

                {/* REQUESTS */}

                <button className="quick-action-card">

                  <div className="quick-icon blue">
                    <FiMail />
                  </div>

                  <div className="quick-content">

                    <h3>
                      My Requests
                    </h3>

                    <p>
                      Track booking requests
                    </p>

                  </div>

                  <FiArrowRight
                    className="quick-arrow"
                  />

                </button>

                {/* MESSAGES */}

                <button
                  className="quick-action-card"
                  onClick={() => {

                    setShowChat(true);

                    if (
                      owners.length > 0
                    ) {
                      openChat(
                        owners[0]
                      );
                    }

                  }}
                >

                  <div className="quick-icon purple">

                    <FiMessageCircle />

                  </div>

                  <div className="quick-content">

                    <h3>
                      Messages
                    </h3>

                    <p>
                      Chat with property
                      owners
                    </p>

                  </div>

                  <FiArrowRight
                    className="quick-arrow"
                  />

                </button>

              </div>

            </section>

            {/* ======================================
                BOTTOM DASHBOARD
            ====================================== */}

            <div className="bottom-dashboard-grid">

              {/* RECOMMENDED */}

              <section className="dashboard-box">

                <div className="dashboard-box-header">

                  <div>

                    <h2>
                      Recommended
                      Properties
                    </h2>

                    <p>
                      Properties you may be
                      interested in
                    </p>

                  </div>

                  <button className="view-all-btn">

                    View All

                    <FiArrowRight />

                  </button>

                </div>

                <div className="property-placeholder">

                  <div className="property-placeholder-icon">
                    🏠
                  </div>

                  <h3>
                    No properties
                    available yet
                  </h3>

                  <p>
                    Property listings will
                    appear here once property
                    owners add their
                    properties.
                  </p>

                  <button className="browse-btn">

                    Browse Properties

                  </button>

                </div>

              </section>

              {/* RECENT REQUESTS */}

              <section className="dashboard-box">

                <div className="dashboard-box-header">

                  <div>

                    <h2>
                      Recent Booking
                      Requests
                    </h2>

                    <p>
                      Track your latest
                      property requests
                    </p>

                  </div>

                </div>

                <div className="empty-requests">

                  <div className="request-empty-icon">

                    <FiMail />

                  </div>

                  <h3>
                    No booking requests yet
                  </h3>

                  <p>
                    Your booking requests
                    will appear here.
                  </p>

                </div>

              </section>

            </div>

          </>

        )}

      </main>

    </div>
  );
}

export default TenantDashboard;