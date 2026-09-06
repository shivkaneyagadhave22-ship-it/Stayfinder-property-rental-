import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./OwnerDashboard.css";

import {
  FiGrid,
  FiHome,
  FiPlus,
  FiMail,
  FiUsers,
  FiMessageCircle,
  FiUser,
  FiLogOut,
  FiArrowRight,
  FiChevronDown,
  FiSend,
  FiX,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";

 const API_URL = "https://stayfinder-property-rental.onrender.com";

// "http://localhost:5000";

 //"http://localhost:5000";


function OwnerDashboard() {
  const navigate = useNavigate();

  // ========================================
  // USER
  // ========================================

 const [currentUser, setCurrentUser] = useState(() => {
  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);

      return {
        ...user,
        _id: user._id || user.id,
      };
    }

    return null;
  } catch (error) {
    console.error("User Session Error:", error);
    return null;
  }
});

  // ========================================
  // LOAD OWNER SESSION
  // ========================================

  
useEffect(() => {
  if (currentUser?._id) {
    console.log("Current Owner:", currentUser);
  } else {
    console.log("No logged-in user found.");
  }
}, [currentUser]);

// ========================================
// PROPERTY
// ========================================

// const [properties, setProperties] = useState([]);
// const [showForm, setShowForm] = useState(false);
// const [editingId, setEditingId] = useState(null);

// ========================================
// GET OWNER PROPERTIES
// ========================================

useEffect(() => {
  const fetchOwnerProperties = async () => {
    if (!currentUser?._id) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/properties/owner/${currentUser._id}`
      );

      const data = await response.json();

      console.log("Owner Properties Response:", data);

      if (response.ok && data.success) {
        setProperties(
          Array.isArray(data.data) ? data.data : []
        );
      } else {
        console.error(
          "Owner Properties Error:",
          data.message
        );

        setProperties([]);
      }
    } catch (error) {
      console.error(
        "Owner Properties Fetch Error:",
        error
      );

      setProperties([]);
    }
  };

  fetchOwnerProperties();
}, [currentUser?._id]);


  // ========================================
  // TENANTS
  // ========================================

  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);

  // ========================================
  // CHAT
  // ========================================

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  const [loadingTenants, setLoadingTenants] =
    useState(false);

  const [loadingMessages, setLoadingMessages] =
    useState(false);

  const [showChat, setShowChat] = useState(false);

  const [socket, setSocket] = useState(null);

  // ========================================
  // PROPERTY
  // ========================================

  const [properties, setProperties] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    rent: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    propertyType: "",
    furnishing: "",
    description: "",
    image: "",
  });

  // ========================================
  // GET TENANTS
  // ========================================

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoadingTenants(true);

        const response = await fetch(
          `${API_URL}/api/messages/tenants`
        );

        const data = await response.json();

        if (data.success) {
          setTenants(data.data || []);
        } else {
          console.error(
            "Tenant API Error:",
            data.message
          );
        }
      } catch (error) {
        console.error(
          "Tenant Fetch Error:",
          error
        );
      } finally {
        setLoadingTenants(false);
      }
    };

    fetchTenants();
  }, []);

  // ========================================
  // SOCKET.IO
  // ========================================

  useEffect(() => {
    if (!currentUser?._id) {
      return;
    }

    const newSocket = io(API_URL);

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log(
        "🟢 Owner Socket Connected:",
        newSocket.id
      );

      newSocket.emit(
        "joinRoom",
        currentUser._id
      );

      console.log(
        "Owner joined socket room:",
        currentUser._id
      );
    });

    // ====================================
    // RECEIVE MESSAGE
    // ====================================

    const handleReceiveMessage = (
      newMessage
    ) => {
      console.log(
        "📩 Owner received message:",
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

      if (
        selectedTenant &&
        (
          (
            senderId === selectedTenant._id &&
            receiverId === currentUser._id
          ) ||
          (
            senderId === currentUser._id &&
            receiverId === selectedTenant._id
          )
        )
      ) {
        setMessages((prev) => {
          const exists = prev.some(
            (msg) =>
              msg._id &&
              newMessage._id &&
              msg._id === newMessage._id
          );

          if (exists) {
            return prev;
          }

          return [...prev, newMessage];
        });
      }
    };

    newSocket.on(
      "receiveMessage",
      handleReceiveMessage
    );

    return () => {
      newSocket.off(
        "receiveMessage",
        handleReceiveMessage
      );

      newSocket.disconnect();
    };
  }, [
    currentUser?._id,
    selectedTenant?._id,
  ]);

  // ========================================
  // OPEN CHAT
  // ========================================

  const openChat = async (tenant) => {
    if (!currentUser?._id) {
      console.error(
        "Owner session not available."
      );

      return;
    }

    setSelectedTenant(tenant);

    setShowChat(true);

    setLoadingMessages(true);

    setMessages([]);

    try {
      const response = await fetch(
        `${API_URL}/api/messages/${currentUser._id}/${tenant._id}`
      );

      const data = await response.json();

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

    if (!selectedTenant) {
      alert(
        "Please select a tenant first."
      );

      return;
    }

    if (!currentUser?._id) {
      alert(
        "User session not found. Please login again."
      );

      return;
    }

    const messageData = {
      sender: currentUser._id,
      receiver: selectedTenant._id,
      message: trimmedMessage,
      property: null,
    };

    try {
      // ====================================
      // SAVE MESSAGE
      // ====================================

      const response = await fetch(
        `${API_URL}/api/messages`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(
            messageData
          ),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        alert(
          data.message ||
            "Failed to send message"
        );

        return;
      }

      // ====================================
      // SHOW OWN MESSAGE
      // ====================================

      setMessages((prev) => {
        const exists = prev.some(
          (msg) =>
            msg._id === data.data._id
        );

        if (exists) {
          return prev;
        }

        return [
          ...prev,
          data.data,
        ];
      });

      // ====================================
      // REAL-TIME SOCKET
      // ====================================

      if (socket) {
        socket.emit(
          "sendMessage",
          {
            _id: data.data._id,

            sender:
              currentUser._id,

            receiver:
              selectedTenant._id,

            message:
              data.data.message,

            property:
              data.data.property ||
              null,

            createdAt:
              data.data.createdAt,
          }
        );
      }

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
  // ENTER KEY
  // ========================================

  const handleMessageKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();

      sendMessage(e);
    }
  };

  // ========================================
  // CLOSE CHAT
  // ========================================

  const closeChat = () => {
    setShowChat(false);

    setSelectedTenant(null);

    setMessages([]);

    setMessageText("");
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
  // PROPERTY FORM
  // ========================================

  const handleInputChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ========================================
  // ADD / EDIT PROPERTY
  // ========================================

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   if (
  //     !formData.title ||
  //     !formData.location ||
  //     !formData.rent
  //   ) {
  //     alert(
  //       "Please fill Title, Location and Monthly Rent."
  //     );

  //     return;
  //   }

  //   if (editingId) {
  //     setProperties((prev) =>
  //       prev.map((property) =>
  //         property.id === editingId
  //           ? {
  //               ...formData,
  //               id: editingId,
  //             }
  //           : property
  //       )
  //     );
  //   } else {
  //     const newProperty = {
  //       ...formData,
  //       id: Date.now(),
  //     };

  //     setProperties((prev) => [
  //       ...prev,
  //       newProperty,
  //     ]);
  //   }

  //   setFormData({
  //     title: "",
  //     location: "",
  //     rent: "",
  //     area: "",
  //     bedrooms: "",
  //     bathrooms: "",
  //     propertyType: "",
  //     furnishing: "",
  //     description: "",
  //     image: "",
  //   });

  //   setEditingId(null);

  //   setShowForm(false);
  // };
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !formData.title ||
    !formData.location ||
    !formData.rent ||
    !formData.area ||
    !formData.bedrooms ||
    !formData.bathrooms
  ) {
    alert(
      "Please fill Title, Location, Rent, Area, Bedrooms and Bathrooms."
    );
    return;
  }

  if (!currentUser) {
    alert("User session not found. Please login again.");
    return;
  }

  const ownerId = currentUser._id || currentUser.id;

  if (!ownerId) {
    alert("Owner ID not found. Please login again.");
    return;
  }

  const propertyData = {
    owner: ownerId,
    title: formData.title,
    location: formData.location,
    rent: Number(formData.rent),
    area: Number(formData.area),
    bedrooms: Number(formData.bedrooms),
    bathrooms: Number(formData.bathrooms),
    propertyType: formData.propertyType || "Apartment",
    furnishing: formData.furnishing || "Furnished",
    description: formData.description,
    image: formData.image,
  };

  try {
    let response;

    if (editingId) {
      response = await fetch(
        `${API_URL}/api/properties/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(propertyData),
        }
      );
    } else {
      response = await fetch(
        `${API_URL}/api/properties`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(propertyData),
        }
      );
    }

    const data = await response.json();

    console.log("Property API Response:", data);

    if (!response.ok || !data.success) {
      alert(data.message || "Failed to save property.");
      return;
    }

    // Add saved property to the screen
    setProperties((prev) => {
      if (editingId) {
        return prev.map((property) =>
          property._id === editingId
            ? data.data
            : property
        );
      }

      return [data.data, ...prev];
    });

    alert(
      editingId
        ? "Property updated successfully!"
        : "Property added successfully!"
    );

    setFormData({
      title: "",
      location: "",
      rent: "",
      area: "",
      bedrooms: "",
      bathrooms: "",
      propertyType: "",
      furnishing: "",
      description: "",
      image: "",
    });

    setEditingId(null);
    setShowForm(false);

  } catch (error) {
    console.error("Save Property Error:", error);

    alert(
      "Unable to connect to backend. Please make sure the backend server is running."
    );
  }
};

  // ========================================
  // EDIT PROPERTY
  // ========================================

  const handleEdit = (property) => {
    setFormData({
      title: property.title || "",
      location: property.location || "",
      rent: property.rent || "",
      area: property.area || "",
      bedrooms:
        property.bedrooms || "",
      bathrooms:
        property.bathrooms || "",
      propertyType:
        property.propertyType || "",
      furnishing:
        property.furnishing || "",
      description:
        property.description || "",
      image:
        property.image || "",
    });

    setEditingId(property._id);

    setShowForm(true);

    setShowChat(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ========================================
  // DELETE PROPERTY
  // ========================================

  const handleDelete = (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this property?"
      );

    if (!confirmDelete) {
      return;
    }

    setProperties((prev) =>
      prev.filter(
        (property) =>
          property._id !== id
      )
    );
  };

  // ========================================
  // FORMAT TIME
  // ========================================

  const formatTime = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ========================================
  // OPEN CHAT FROM DASHBOARD
  // ========================================

  const handleOpenChat = () => {
    setShowChat(true);

    if (
      tenants.length > 0 &&
      !selectedTenant
    ) {
      openChat(tenants[0]);
    }
  };

  // ========================================
  // RETURN
  // ========================================

  return (
    <div className="owner-dashboard">

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside className="owner-sidebar">

        <div className="owner-sidebar-logo">

          <span className="owner-logo-home">
            🏠
          </span>

          <span className="owner-logo-stay">
            Stay
          </span>

          <span className="owner-logo-finder">
            Finder
          </span>

        </div>

        <div className="owner-sidebar-line"></div>

        <nav className="owner-sidebar-nav">
          <a
  href="/"
  onClick={(e) => {
    e.preventDefault();
    navigate("/");
  }}
>
  <FiHome />
  <span>Home</span>
</a>

          {/* DASHBOARD */}

          <a
            href="#"
            className={
              !showChat
                ? "active"
                : ""
            }
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

          {/* MY PROPERTIES */}

          <a
            href="#properties"
            onClick={(e) => {
              e.preventDefault();

              setShowChat(false);

              document
                .getElementById(
                  "properties"
                )
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
          >
            <FiHome />

            <span>
              My Properties
            </span>
          </a>

          {/* ADD PROPERTY */}

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();

              setShowChat(false);

              setShowForm(true);

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          >
            <FiPlus />

            <span>
              Add Property
            </span>
          </a>

          {/* BOOKING REQUESTS */}

          <a
            href="#"
            onClick={(e) =>
              e.preventDefault()
            }
          >
            <FiMail />

            <span>
              Booking Requests
            </span>
          </a>

          {/* TENANTS */}

          <a
            href="#"
            onClick={(e) =>
              e.preventDefault()
            }
          >
            <FiUsers />

            <span>
              Tenants
            </span>
          </a>

          {/* MESSAGES */}

          <a
            href="#"
            className={
              showChat
                ? "active"
                : ""
            }
            onClick={(e) => {
              e.preventDefault();

              handleOpenChat();
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

        <div className="owner-sidebar-bottom">

          <div className="owner-sidebar-line"></div>

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

      {/* =====================================
          MAIN
      ===================================== */}

      <main className="owner-main">

        {/* =====================================
            HEADER
        ===================================== */}

        <header className="owner-header">

          <div className="owner-welcome">

            <h1>
              Welcome back,{" "}
              {currentUser?.name ||
                "Owner"}! 👋
            </h1>

            <p>
              Manage your properties and
              connect with tenants.
            </p>

          </div>

          <div className="owner-user">

            <div className="owner-user-icon">
              <FiUser />
            </div>

            <div className="owner-user-info">

              <strong>
                {currentUser?.name ||
                  "Property Owner"}
              </strong>

              <span>
                Property Owner
              </span>

            </div>

            <FiChevronDown
              className="owner-user-arrow"
            />

          </div>

        </header>

        {/* =====================================
            CHAT
        ===================================== */}

        {showChat ? (

          <section className="owner-chat-section">

            {/* CHAT HEADER */}

            <div className="owner-chat-page-header">

              <div>

                <h1>

                  <FiMessageCircle />

                  Messages

                </h1>

                <p>
                  Chat with tenants
                </p>

              </div>

              <button
                type="button"
                className="owner-chat-close"
                onClick={closeChat}
              >
                <FiX />
              </button>

            </div>

            {/* CHAT CONTAINER */}

            <div className="owner-chat-container">

              {/* LEFT TENANTS */}

              <div className="owner-tenant-list">

                <div className="owner-list-title">

                  <h3>
                    Tenants
                  </h3>

                </div>

                {loadingTenants ? (

                  <div className="owner-chat-loading">
                    Loading tenants...
                  </div>

                ) : tenants.length === 0 ? (

                  <div className="owner-no-tenant">

                    <FiUsers />

                    <p>
                      No tenants available yet.
                    </p>

                  </div>

                ) : (

                  <div className="owner-tenants-container">

                    {tenants.map(
                      (tenant) => (

                        <button
                          type="button"
                          key={
                            tenant._id
                          }
                          className={`owner-tenant-item ${
                            selectedTenant?._id ===
                            tenant._id
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            openChat(
                              tenant
                            )
                          }
                        >

                          <div className="owner-tenant-avatar">

                            <FiUser />

                          </div>

                          <div className="owner-tenant-info">

                            <strong>

                              {tenant.name ||
                                "Tenant"}

                            </strong>

                            <span>
                              Tenant
                            </span>

                          </div>

                          <FiArrowRight />

                        </button>

                      )
                    )}

                  </div>

                )}

              </div>

              {/* RIGHT CHAT */}

              <div className="owner-chat-window">

                {selectedTenant ? (

                  <>

                    {/* CHAT PERSON */}

                    <div className="owner-chat-header">

                      <div className="owner-chat-person">

                        <div className="owner-chat-person-icon">

                          <FiUser />

                        </div>

                        <div>

                          <h3>

                            {selectedTenant.name ||
                              "Tenant"}

                          </h3>

                          <p>
                            Tenant
                          </p>

                        </div>

                      </div>

                      <div className="owner-online">

                        <span></span>

                        Online

                      </div>

                    </div>

                    {/* MESSAGES */}

                    <div className="owner-chat-messages">

                      {loadingMessages ? (

                        <div className="owner-empty-chat">

                          <p>
                            Loading messages...
                          </p>

                        </div>

                      ) : messages.length ===
                        0 ? (

                        <div className="owner-empty-chat">

                          <FiMessageCircle />

                          <h3>
                            Start a conversation
                          </h3>

                          <p>
                            Send a message to{" "}
                            {selectedTenant.name ||
                              "the tenant"}.
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
                                className={`owner-message-row ${
                                  isMine
                                    ? "owner-message-right"
                                    : "owner-message-left"
                                }`}
                              >

                                <div
                                  className={`owner-message-bubble ${
                                    isMine
                                      ? "owner-my-message"
                                      : "owner-tenant-message"
                                  }`}
                                >

                                  <p>
                                    {
                                      msg.message
                                    }
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

                    {/* INPUT */}

                    <form
                      className="owner-chat-input-area"
                      onSubmit={
                        sendMessage
                      }
                    >

                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={
                          messageText
                        }
                        onChange={(e) =>
                          setMessageText(
                            e.target.value
                          )
                        }
                        onKeyDown={
                          handleMessageKeyDown
                        }
                      />

                      <button
                        type="submit"
                        disabled={
                          !messageText.trim()
                        }
                      >

                        <FiSend />

                        Send

                      </button>

                    </form>

                  </>

                ) : (

                  <div className="owner-empty-chat">

                    <FiMessageCircle />

                    <h3>
                      Select a conversation
                    </h3>

                    <p>
                      Choose a tenant from
                      the left to start
                      chatting.
                    </p>

                  </div>

                )}

              </div>

            </div>

          </section>

        ) : (

          /* =====================================
             NORMAL OWNER DASHBOARD
          ===================================== */

          <>

            {/* STATS */}

            <section className="owner-stats">

              <div className="owner-stat-card">

                <div className="owner-stat-icon pink">
                  <FiHome />
                </div>

                <div className="owner-stat-content">

                  <span>
                    My Properties
                  </span>

                  <h2>
                    {properties.length}
                  </h2>

                </div>

              </div>

              <div className="owner-stat-card">

                <div className="owner-stat-icon blue">
                  <FiMail />
                </div>

                <div className="owner-stat-content">

                  <span>
                    Booking Requests
                  </span>

                  <h2>
                    0
                  </h2>

                </div>

              </div>

              <div className="owner-stat-card">

                <div className="owner-stat-icon green">
                  <FiUsers />
                </div>

                <div className="owner-stat-content">

                  <span>
                    Tenants
                  </span>

                  <h2>
                    {tenants.length}
                  </h2>

                </div>

              </div>

              <div
                className="owner-stat-card"
                onClick={
                  handleOpenChat
                }
              >

                <div className="owner-stat-icon purple">
                  <FiMessageCircle />
                </div>

                <div className="owner-stat-content">

                  <span>
                    Messages
                  </span>

                  <h2>
                    {messages.length}
                  </h2>

                </div>

              </div>

            </section>

            {/* QUICK ACTIONS */}

            <section className="owner-section">

              <div className="owner-section-title">

                <h2>
                  Quick Actions
                </h2>

                <p>
                  Manage your properties
                  and tenants
                </p>

              </div>

              <div className="owner-quick-actions">

                <button
                  className="owner-quick-action-card"
                  onClick={() => {

                    setShowForm(true);

                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });

                  }}
                >

                  <div className="owner-quick-icon pink">
                    <FiPlus />
                  </div>

                  <div className="owner-quick-content">

                    <h3>
                      Add Property
                    </h3>

                    <p>
                      List a new property
                    </p>

                  </div>

                  <FiArrowRight />

                </button>

                <button
                  className="owner-quick-action-card"
                  onClick={() => {

                    document
                      .getElementById(
                        "properties"
                      )
                      ?.scrollIntoView({
                        behavior: "smooth",
                      });

                  }}
                >

                  <div className="owner-quick-icon pink">
                    <FiHome />
                  </div>

                  <div className="owner-quick-content">

                    <h3>
                      My Properties
                    </h3>

                    <p>
                      Manage your properties
                    </p>

                  </div>

                  <FiArrowRight />

                </button>

                <button
                  className="owner-quick-action-card"
                  onClick={
                    handleOpenChat
                  }
                >

                  <div className="owner-quick-icon purple">

                    <FiMessageCircle />

                  </div>

                  <div className="owner-quick-content">

                    <h3>
                      Messages
                    </h3>

                    <p>
                      Chat with tenants
                    </p>

                  </div>

                  <FiArrowRight />

                </button>

                <button
                  className="owner-quick-action-card"
                  onClick={(e) =>
                    e.preventDefault()
                  }
                >

                  <div className="owner-quick-icon blue">

                    <FiMail />

                  </div>

                  <div className="owner-quick-content">

                    <h3>
                      Booking Requests
                    </h3>

                    <p>
                      View tenant requests
                    </p>

                  </div>

                  <FiArrowRight />

                </button>

              </div>

            </section>

            {/* ADD PROPERTY FORM */}

            {showForm && (

              <section className="owner-property-form-section">

                <div className="owner-section-title">

                  <h2>
                    {editingId
                      ? "Edit Property"
                      : "Add Property"}
                  </h2>

                  <p>
                    Enter your property
                    details below.
                  </p>

                </div>

                <form
                  className="owner-property-form"
                  onSubmit={
                    handleSubmit
                  }
                >

                  <div className="owner-form-grid">

                    <div className="owner-form-group">

                      <label>
                        Property Title *
                      </label>

                      <input
                        name="title"
                        value={
                          formData.title
                        }
                        onChange={
                          handleInputChange
                        }
                        placeholder="e.g. 2 BHK Flat"
                      />

                    </div>

                    <div className="owner-form-group">

                      <label>
                        Location *
                      </label>

                      <input
                        name="location"
                        value={
                          formData.location
                        }
                        onChange={
                          handleInputChange
                        }
                        placeholder="e.g. Pune"
                      />

                    </div>

                    <div className="owner-form-group">

                      <label>
                        Monthly Rent *
                      </label>

                      <input
                        name="rent"
                        value={
                          formData.rent
                        }
                        onChange={
                          handleInputChange
                        }
                        placeholder="₹25,000"
                      />

                    </div>

                    <div className="owner-form-group">

                      <label>
                        Area (sq.ft.)
                      </label>

                      <input
                        name="area"
                        value={
                          formData.area
                        }
                        onChange={
                          handleInputChange
                        }
                        placeholder="1200"
                      />

                    </div>

                    <div className="owner-form-group">

                      <label>
                        Bedrooms
                      </label>

                      <input
                        name="bedrooms"
                        value={
                          formData.bedrooms
                        }
                        onChange={
                          handleInputChange
                        }
                        placeholder="2"
                      />

                    </div>

                    <div className="owner-form-group">

                      <label>
                        Bathrooms
                      </label>

                      <input
                        name="bathrooms"
                        value={
                          formData.bathrooms
                        }
                        onChange={
                          handleInputChange
                        }
                        placeholder="2"
                      />

                    </div>

                    <div className="owner-form-group">

                      <label>
                        Property Type
                      </label>

                      <select
                        name="propertyType"
                        value={
                          formData.propertyType
                        }
                        onChange={
                          handleInputChange
                        }
                      >

                        <option value="">
                          Select Type
                        </option>

                        <option value="Apartment">
                          Apartment
                        </option>

                        <option value="Flat">
                          Flat
                        </option>

                        <option value="House">
                          House
                        </option>

                        <option value="Villa">
                          Villa
                        </option>

                        <option value="PG">
                          PG
                        </option>

                      </select>

                    </div>

                    <div className="owner-form-group">

                      <label>
                        Furnishing
                      </label>

                      <select
                        name="furnishing"
                        value={
                          formData.furnishing
                        }
                        onChange={
                          handleInputChange
                        }
                      >

                        <option value="">
                          Select Furnishing
                        </option>

                        <option value="Fully Furnished">
                          Fully Furnished
                        </option>

                        <option value="Semi Furnished">
                          Semi Furnished
                        </option>

                        <option value="Unfurnished">
                          Unfurnished
                        </option>

                      </select>

                    </div>

                    <div className="owner-form-group owner-form-full">

                      <label>
                        Image URL
                      </label>

                      <input
                        name="image"
                        value={
                          formData.image
                        }
                        onChange={
                          handleInputChange
                        }
                        placeholder="Paste image URL"
                      />

                    </div>

                    <div className="owner-form-group owner-form-full">

                      <label>
                        Description
                      </label>

                      <textarea
                        name="description"
                        value={
                          formData.description
                        }
                        onChange={
                          handleInputChange
                        }
                        placeholder="Describe your property..."
                      ></textarea>

                    </div>

                  </div>

                  <div className="owner-form-actions">

                    <button
                      type="button"
                      className="owner-cancel-btn"
                      onClick={() => {

                        setShowForm(false);

                        setEditingId(null);

                      }}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="owner-save-btn"
                    >
                      {editingId
                        ? "Update Property"
                        : "Save Property"}
                    </button>

                  </div>

                </form>

              </section>

            )}

            {/* MY PROPERTIES */}

            <section
              className="owner-section"
              id="properties"
            >

              <div className="owner-section-title">

                <h2>
                  My Properties
                </h2>

                <p>
                  Properties added by you
                </p>

              </div>

              {properties.length === 0 ? (

                <div className="owner-empty-card">

                  <FiHome />

                  <h3>
                    No properties added yet
                  </h3>

                  <p>
                    Add your first property
                    to start receiving
                    tenant requests.
                  </p>

                  <button
                    onClick={() =>
                      setShowForm(true)
                    }
                  >

                    <FiPlus />

                    Add Property

                  </button>

                </div>

              ) : (

                <div className="owner-properties-grid">

                  {properties.map(
                    (property) => (

                      <div
                        className="owner-property-card"
                        key={
                          property._id
                        }
                      >

                        <div className="owner-property-image">

                          {property.image ? (

                            <img
                              src={
                                property.image
                              }
                              alt={
                                property.title
                              }
                            />

                          ) : (

                            <div className="owner-property-placeholder">
                              🏠
                            </div>

                          )}

                          <span>
                            {property.propertyType ||
                              "Property"}
                          </span>

                        </div>

                        <div className="owner-property-content">

                          <h3>
                            {property.title}
                          </h3>

                          <p className="owner-property-location">

                            📍{" "}

                            {property.location}

                          </p>

                          <div className="owner-property-details">

                            <span>
                              🛏{" "}
                              {property.bedrooms ||
                                0}{" "}
                              Beds
                            </span>

                            <span>
                              🛁{" "}
                              {property.bathrooms ||
                                0}{" "}
                              Baths
                            </span>

                            <span>
                              📐{" "}
                              {property.area ||
                                0}{" "}
                              sq.ft.
                            </span>

                          </div>

                          <div className="owner-property-bottom">

                            <strong>

                              ₹
                              {property.rent ||
                                "0"}
                              /month

                            </strong>

                            <div>

                              <button
                                onClick={() =>
                                  handleEdit(
                                    property
                                  )
                                }
                              >

                                <FiEdit />

                              </button>

                              <button
                                onClick={() =>
                                  handleDelete(
                                    property._id
                                  )
                                }
                              >

                                <FiTrash2 />

                              </button>

                            </div>

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </section>

          </>

        )}

      </main>

    </div>
  );
}

export default OwnerDashboard;