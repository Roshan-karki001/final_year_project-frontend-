'use client';

import { useEffect, useState, useRef } from 'react';
import { 
    initSocket, 
    connectUser, 
    listenToMessages, 
    listenToTyping, 
    emitTyping, 
    listenToUserStatus 
} from '../utils/socket';

const Chat = ({ userId }) => {
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Initialize socket connection
        const socket = initSocket();
        connectUser(userId);

        // Set up listeners
        listenToMessages((data) => {
            setMessages(prev => [...prev, data]);
            scrollToBottom();
        });

        listenToTyping(() => {
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 3000);
        });

        listenToUserStatus(
            (data) => setOnlineUsers(prev => new Set([...prev, data.userId])),
            (data) => {
                setOnlineUsers(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(data.userId);
                    return newSet;
                });
            }
        );

        // Cleanup on unmount
        return () => {
            socket.disconnect();
        };
    }, [userId]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            emitTyping(userId, 'receiverId'); // Replace with actual receiver ID
            // Add your send message logic here
            setNewMessage('');
            scrollToBottom();
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Chat Header */}
            <div className="bg-white shadow-md p-4">
                <h2 className="text-xl font-semibold">Chat</h2>
                <div className="text-sm text-gray-500">
                    {onlineUsers.size} users online
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.sender_id === userId ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                                message.sender_id === userId
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-gray-800'
                            } shadow`}
                        >
                            <p>{message.content}</p>
                            <span className="text-xs opacity-75">
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="text-gray-500 text-sm">Someone is typing...</div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white p-4 shadow-md">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;