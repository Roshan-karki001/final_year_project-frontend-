import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export const initializeSocket = (currentUserId) => {
    socket.emit('userConnected', currentUserId);
};

export const setupMessageListeners = (onNewMessage, onTyping, onUserStatus) => {
    socket.on('newMessage', (data) => {
        console.log('New message received:', data);
        onNewMessage(data);
    });

    socket.on('userTyping', (data) => {
        console.log(`User ${data.sender_id} is typing...`);
        onTyping(data);
    });

    socket.on('userOnline', (data) => {
        console.log(`User ${data.userId} is online`);
        onUserStatus(data, true);
    });

    socket.on('userOffline', (data) => {
        console.log(`User ${data.userId} went offline`);
        onUserStatus(data, false);
    });
};

export const emitTypingEvent = (senderId, receiverId) => {
    socket.emit('typing', {
        sender_id: senderId,
        receiver_id: receiverId
    });
};

export default socket;