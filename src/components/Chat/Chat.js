import {useEffect, useState} from 'react';
import {
    addDoc,
    collection,
    serverTimestamp,
    onSnapshot,
    query,
    where,
    orderBy,
} from 'firebase/firestore';
import {auth, db} from '../firebase-config';
import '../styles/Chat.css';
import {UserProfile} from './UserProfile'; // Import UserProfile
import '@mdi/font/css/materialdesignicons.min.css';

export const Chat = (props) => {
    const {room, signUserOut} = props;
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [showProfile, setShowProfile] = useState(false);

    const messagesRef = collection(db, 'messages');

    useEffect(() => {
        const queryMessages = query(
            messagesRef,
            where('room', '==', room),
            orderBy('createdAt'),
        );
        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
            let messages = [];
            snapshot.forEach((doc) => {
                messages.push({...doc.data(), id: doc.id});
            });
            setMessages(messages);
        });

        return () => unsubscribe();
    }, [room]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newMessage === '') return;

        await addDoc(messagesRef, {
            text: newMessage,
            createdAt: serverTimestamp(),
            user: auth.currentUser.displayName,
            room: room,
        });

        setNewMessage('');
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        return new Date(timestamp.seconds * 1000).toLocaleTimeString();
    };

    const toggleProfile = () => {
        setShowProfile(!showProfile);
    };

    return (
        <div className='chat-app'>
            <div className='header'>
                <button
                    onClick={signUserOut}
                    className='mdi mdi-arrow-left back-button'
                ></button>
                <h1 className='header-title'>{room.toUpperCase()}</h1>
                <button
                    onClick={toggleProfile} // Toggle profile on click
                    className='mdi mdi-account-circle-outline profile-button'
                ></button>
                <button
                    onClick={signUserOut}
                    className='mdi mdi-logout sign-out-button'
                ></button>
            </div>
            <div className='messages'>
                {messages.map((message) => (
                    <div
                        className={`message ${
                            message.user === auth.currentUser.displayName
                                ? 'sent'
                                : 'received'
                        }`}
                        key={message.id}
                    >
                        {message.user !== auth.currentUser.displayName && (
                            <span className='user'>{message.user}</span>
                        )}
                        <span className='text'>{message.text}</span>
                        <span className='timestamp'>
                            {formatTimestamp(message.createdAt)}
                        </span>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className='new-message-form'>
                <div className='relative flex items-center w-full'>
                    <i className='mdi mdi-emoticon-excited-outline emoticon-button'></i>
                    <input
                        className='new-message-input'
                        placeholder='Type your message here...'
                        onChange={(e) => setNewMessage(e.target.value)}
                        value={newMessage}
                    />
                    <i className='mdi mdi-paperclip paperclip-button'></i>
                    <button
                        type='submit'
                        className='mdi mdi-send send-button'
                    ></button>
                </div>
            </form>
            {showProfile && <UserProfile onClose={toggleProfile} />}{' '}
            {/* Render UserProfile */}
        </div>
    );
};
