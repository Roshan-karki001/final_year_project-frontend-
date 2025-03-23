import { useState, useEffect, useRef } from "react";
import { Search, Send, Info } from "lucide-react";
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  withCredentials: true,
  transports: ['websocket']
});

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
  const [isTyping, setIsTyping] = useState(false);
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
        
        // Fetch user details for each conversation partner
        const conversationDetails = await Promise.all(
          response.data.conversationPartners.map(async (partnerId) => {
            const userResponse = await axios.get(`http://localhost:5000/api/auth/user/${partnerId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            return userResponse.data.user;
          })
        );
        
        setConversations(conversationDetails);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };
    fetchConversations();
  }, [token]);

  // Socket connection and event handlers
  useEffect(() => {
    if (currentUser?.id) {
      socket.emit('userConnected', currentUser.id);

      socket.on('newMessage', ({ message }) => {
        if (selectedUser && 
            (message.sender_id === selectedUser._id || 
             message.receiver_id === selectedUser._id)) {
          setMessages(prev => [...prev, message]);
          scrollToBottom();
        }
      });

      socket.on('userTyping', ({ sender_id }) => {
        if (sender_id === selectedUser?._id) setIsTyping(true);
      });

      socket.on('userStoppedTyping', ({ sender_id }) => {
        if (sender_id === selectedUser?._id) setIsTyping(false);
      });

      return () => {
        socket.off('newMessage');
        socket.off('userTyping');
        socket.off('userStoppedTyping');
      };
    }
  }, [currentUser, selectedUser]);

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

  // Handle message sending
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
      socket.emit('stopTyping', {
        sender_id: currentUser.id,
        receiver_id: selectedUser._id
      });
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Handle typing events
  let typingTimeout = null;
  const handleTyping = () => {
    if (selectedUser) {
      socket.emit('typing', {
        sender_id: currentUser.id,
        receiver_id: selectedUser._id
      });

      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        socket.emit('stopTyping', {
          sender_id: currentUser.id,
          receiver_id: selectedUser._id
        });
      }, 2000);
    }
  };

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv => 
    `${conv.F_name} ${conv.L_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Conversations Sidebar */}
      <div className="w-1/4 bg-white border-r">
        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            {filteredConversations.map((conv) => (
              <div
                key={conv._id}
                onClick={() => setSelectedUser(conv)}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${
                  selectedUser?._id === conv._id ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <Avatar name={conv.F_name} />
                <div>
                  <p className="font-medium">{`${conv.F_name} ${conv.L_name}`}</p>
                  <p className="text-sm text-gray-500">{conv.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="bg-white p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar name={selectedUser.F_name} />
                <div>
                  <p className="font-medium">{`${selectedUser.F_name} ${selectedUser.L_name}`}</p>
                  <p className="text-sm text-gray-500">
                    {isTyping ? 'Typing...' : 'Online'}
                  </p>
                </div>
              </div>
              <Info className="w-6 h-6 text-gray-500 cursor-pointer" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${
                    message.sender_id === currentUser.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.sender_id === currentUser.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="bg-white p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleTyping}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default Messaging;
