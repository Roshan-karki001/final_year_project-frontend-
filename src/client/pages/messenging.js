import { useState, useEffect, useRef } from "react";
import { Search, Send, Trash2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Avatar Component
const Avatar = ({ name, profileImage }) => (
  <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white font-bold rounded-full overflow-hidden">
    {profileImage?.url ? (
      <img src={profileImage.url} alt={name} className="w-full h-full object-cover" />
    ) : (
      name?.charAt(0).toUpperCase()
    )}
  </div>
);

const Messaging = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, messageId: null });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Set selected user from location state
  useEffect(() => {
    if (location.state?.selectedUser) {
      setSelectedUser(location.state.selectedUser);
    }
  }, [location]);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/messages/conversations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sorted = res.data.conversations.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setConversations(sorted);
        setError(null);
      } catch (err) {
        console.error("Error fetching conversations:", err);
        setError("Failed to load conversations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchConversations();
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  // Fetch messages for selected user
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser?._id || !currentUser?.id) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/api/messages/${currentUser.id}/${selectedUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const sorted = Array.isArray(res.data.messages)
          ? res.data.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          : [];
        setMessages(sorted);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages. Please try again.");
      }
    };

    fetchMessages();
    const intervalId = setInterval(fetchMessages, 3000);
    return () => clearInterval(intervalId);
  }, [selectedUser, currentUser, token]);

  // Send message handler
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser?._id) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/messages",
        {
          receiver_id: selectedUser._id,
          content: newMessage.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (res.data?.data) {
        setMessages(prev => [...prev, res.data.data]);
        setNewMessage("");
        scrollToBottom();
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    }
  };

  // ✅ DELETE message handler
  // Add filteredConversations definition before the return statement
  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Fix the delete message handler to show confirmation first
  const handleDeleteMessage = async (messageId) => {
    if (!deleteConfirmation.show) {
      setDeleteConfirmation({ show: true, messageId });
      return;
    }
  
    try {
      await axios.delete(`http://localhost:5000/api/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      setDeleteConfirmation({ show: false, messageId: null });
    } catch (err) {
      console.error("Error deleting message:", err);
      setError("Failed to delete message. Please try again.");
    }
  };

  // Redirect to find engineers
  const handleFindPeople = () => {
    navigate(`/${currentUser.role}/search-engineers`);
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

 


  return (
    <div className="flex h-[calc(100vh-64px)] p-4 bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white rounded-lg shadow-md p-4 border-r">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-180px)]">
          {filteredConversations.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              <p>No conversations yet</p>
              <button
                onClick={handleFindPeople}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Find People to Chat With
              </button>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.userId}
                onClick={() => setSelectedUser({
                  _id: conv.userId,
                  name: conv.name,
                  profileImage: conv.profileImage
                })}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                  selectedUser?._id === conv.userId ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <Avatar name={conv.name} profileImage={conv.profileImage} />
                <div>
                  <p className="font-semibold">{conv.name}</p>
                  <p className="text-xs text-gray-500">{conv.lastMessage}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow-md ml-4">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="p-4 border-b flex items-center gap-3">
              <Avatar name={selectedUser.name} profileImage={selectedUser.profileImage} />
              <p className="font-medium">{selectedUser.name}</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map((msg) => {
                const isSent = msg.senderId._id === currentUser.id;
                return (
                  <div
                    key={msg._id}
                    className={`flex ${isSent ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex items-end gap-2 max-w-[75%] ${isSent ? "flex-row-reverse" : ""}`}>
                      <Avatar
                        name={isSent 
                          ? `${msg.senderId.F_name} ${msg.senderId.L_name}`
                          : `${msg.senderId.F_name} ${msg.senderId.L_name}`
                        }
                        profileImage={isSent 
                          ? msg.senderId.profileImage
                          : msg.senderId.profileImage
                        }
                      />
                      <div className="relative group">
                        {/* Delete Button */}
                        {isSent && (
                          <>
                            {deleteConfirmation.show && deleteConfirmation.messageId === msg._id ? (
                              <>
                                {/* Blur Overlay */}
                                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" />
                                {/* Confirmation Dialog */}
                                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 z-50 min-w-[300px]">
                                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Delete Message</h3>
                                  <p className="text-gray-600 mb-4">Are you sure you want to delete this message?</p>
                                  <div className="flex justify-end gap-3">
                                    <button
                                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                      onClick={() => setDeleteConfirmation({ show: false, messageId: null })}
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
                                      onClick={() => handleDeleteMessage(msg._id)}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirmation({ show: true, messageId: msg._id })}
                                className="absolute -left-7 top-1/2 -translate-y-1/2 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full shadow-sm opacity-40 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 size={16} className="text-red-400 hover:text-red-500" />
                              </button>
                            )}
                          </>
                        )}
                        {/* Message Bubble */}
                        <div className={`p-2 text-sm rounded-lg shadow-sm ${
                          isSent
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-gray-100 text-gray-800 rounded-bl-none"
                        }`}>
                          <p>{msg.content}</p>
                          <span className="text-[10px] block mt-1 text-right opacity-70">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your message..."
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Welcome to Your Messages
              </h2>
              <p className="text-gray-600 mb-6">
                Connect with skilled engineers and clients in real-time. Start meaningful conversations, discuss projects, and build professional relationships.
              </p>
              <button
                onClick={handleFindPeople}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
                Find People to Chat With
              </button>
              <p className="text-sm text-gray-500 mt-4">
                Browse through our community of professionals and start a conversation today.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messaging;
