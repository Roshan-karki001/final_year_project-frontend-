import { useState, useEffect, useRef } from "react";
import { Search, Send } from "lucide-react";
import axios from 'axios';

const Avatar = ({ name }) => (
  <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white font-bold rounded-full">
    {name?.charAt(0).toUpperCase()}
  </div>
);

const Messaging = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/messages/conversations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setConversations(response.data.conversations);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };
    fetchConversations();
  }, [token]);

  // Fetch messages when user selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || !currentUser) return;
      try {
        const response = await axios.get(
          `http://localhost:5000/api/messages/${currentUser.id}/${selectedUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(response.data.messages);
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, [selectedUser, currentUser, token]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const response = await axios.post(
        'http://localhost:5000/api/messages',
        {
          receiver_id: selectedUser._id,
          content: newMessage
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(prev => [...prev, response.data.data]);
      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const filteredConversations = conversations.filter(conv => 
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100 p-4">
      {/* Sidebar - Conversations List */}
      <div className="w-1/4 bg-white border-r rounded-lg shadow-lg p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
          {conversations.map((conv) => (
            <div
              key={conv.userId}
              onClick={() => setSelectedUser({ _id: conv.userId, name: conv.name })}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${
                selectedUser?._id === conv.userId ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
            >
              <Avatar name={conv.name} />
              <div>
                <p className="font-medium">{conv.name}</p>
                <p className="text-sm text-gray-500">{conv.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg">
        {selectedUser ? (
          <>
            <div className="p-4 border-b flex items-center space-x-3">
              <Avatar name={selectedUser.name} />
              <p className="font-medium">{selectedUser.name}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-280px)]">
              {messages.map((message) => {
                const isSentByUser = message.senderId === currentUser.id;
                return (
                  <div key={message._id} className={`flex w-full ${isSentByUser ? "justify-end" : "justify-start"}`}>
                    <div className={`flex ${isSentByUser ? "flex-row-reverse" : "flex-row"} items-end gap-2 max-w-[70%]`}>
                      <Avatar name={isSentByUser ? currentUser.name : selectedUser.name} />
                      <div className={`p-3 rounded-lg shadow-md ${isSentByUser ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"}`}>
                        <p className="break-words">{message.content}</p>
                        <span className={`text-xs block mt-1 ${isSentByUser ? "text-blue-100" : "text-gray-500"}`}>
                          {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex space-x-2">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">Select a conversation to start messaging</div>
        )}
      </div>
    </div>
  );
};


export default Messaging;
