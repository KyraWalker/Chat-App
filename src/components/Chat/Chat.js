import {useEffect, useState, useRef} from 'react';
import {
    addDoc,
    collection,
    serverTimestamp,
    onSnapshot,
    query,
    where,
    orderBy,
} from 'firebase/firestore';
import {auth, db, storage} from '../firebase-config';
import {useNavigate} from 'react-router-dom';
import '../styles/Chat.css';
import {UserProfile} from './UserProfile';
import '@mdi/font/css/materialdesignicons.min.css';

export const Chat = (props) => {
    const {room, signUserOut} = props;
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [showProfile, setShowProfile] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [emojiCategory, setEmojiCategory] = useState('Smileys');
    const [replyToMessageText, setReplyToMessageText] = useState(''); // Store replied message text
    const messagesEndRef = useRef(null);

    const messagesRef = collection(db, 'messages');

    const navigate = useNavigate();

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
            scrollToBottom();
        });

        return () => unsubscribe();
    }, [room]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newMessage === '') return;

        // Create the message object with the text being replied to
        const newMessageData = {
            text: newMessage,
            createdAt: serverTimestamp(),
            user: auth.currentUser.displayName,
            room: room,
            replyTo: replyToMessageText || null, // Include the replied message text
        };

        // Add the message to Firestore
        await addDoc(messagesRef, newMessageData);

        // Reset the state after sending the message
        setNewMessage('');
        setReplyToMessageText(''); // Clear the "Replying to" text
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        return new Date(timestamp.seconds * 1000).toLocaleTimeString();
    };

    const toggleProfile = () => {
        setShowProfile(!showProfile);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleEmojiClick = (emoji) => {
        setNewMessage((prevMessage) => prevMessage + emoji);
        setShowEmojiPicker(false); // Hide emoji picker after selection
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker((prev) => !prev);
    };

    const handleCategoryChange = (category) => {
        setEmojiCategory(category);
    };

    const handleMessageClick = (message) => {
        // If the clicked message is a received message, show the "Replying to" message text
        if (message.user !== auth.currentUser.displayName) {
            setReplyToMessageText(message.text);
        }
    };

    // Emojis by category (same as before)
    const emojis = {
        Smileys: [
            '😊',
            '😂',
            '😍',
            '❤️',
            '😁',
            '😜',
            '😎',
            '🤔',
            '🥺',
            '🤗',
            '😢',
            '🥳',
        ],
        Animals: ['🐶', '🐱', '🐯', '🐸', '🦁', '🐯', '🦊', '🐻', '🦄', '🐨'],
        Food: ['🍏', '🍔', '🍕', '🍣', '🍩', '🍪', '🍔', '🍓', '🍉', '🍍'],
        Objects: ['💻', '📱', '📸', '🎧', '💼', '📚', '🏠', '🚗', '⚽'],
        Travel: ['🌍', '🌎', '🏖️', '🗽', '🏕️', '🚢', '✈️', '🚉'],
        Symbols: ['❤️', '💔', '💯', '👍', '👎', '✨', '🔥', '⚡'],
    };

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    return (
        <div className='chat-app'>
            <div className='header'>
                <button
                    onClick={() => navigate('/findRoom')}
                    className='mdi mdi-arrow-left back-button'
                ></button>
                <h1 className='header-title'>{room.toUpperCase()}</h1>
                <button
                    onClick={toggleProfile}
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
                        onClick={() =>
                            message.user !== auth.currentUser.displayName &&
                            handleMessageClick(message)
                        }
                    >
                        {message.user !== auth.currentUser.displayName && (
                            <span className='user'>{message.user}</span>
                        )}
                        <span className='text'>{message.text}</span>

                        {/* If the message is a reply, show the replied-to message text */}
                        {message.replyTo && (
                            <div className='reply-info'>
                                <span className='reply-to'>
                                    Replying to: {message.replyTo}
                                </span>
                            </div>
                        )}

                        <span className='timestamp'>
                            {formatTimestamp(message.createdAt)}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef} /> {/* Scroll target */}
            </div>

            <form onSubmit={handleSubmit} className='new-message-form'>
                {/* Show the "Replying to" message text if applicable */}
                {replyToMessageText && (
                    <div className='replying-to'>
                        <span>Replying to: {replyToMessageText}</span>
                        <button
                            type='button'
                            className='mdi mdi-alpha-x-circle cancel-reply-button'
                            onClick={() => setReplyToMessageText('')} // Clear the reply text
                        ></button>
                    </div>
                )}

                <div className='relative flex items-center w-full'>
                    <button
                        type='button'
                        className='mdi mdi-emoticon-outline emoticon-button'
                        onClick={toggleEmojiPicker}
                    ></button>

                    {/* Emoji Picker */}
                    {showEmojiPicker && (
                        <div className='emoji-picker'>
                            <div className='emoji-categories'>
                                {Object.keys(emojis).map((category) => (
                                    <button
                                        key={category}
                                        onClick={() =>
                                            handleCategoryChange(category)
                                        }
                                        className={`emoji-category-button ${
                                            emojiCategory === category
                                                ? 'active'
                                                : ''
                                        }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>

                            <div className='emoji-grid'>
                                {emojis[emojiCategory].map((emoji, index) => (
                                    <button
                                        key={index}
                                        type='button'
                                        onClick={() => handleEmojiClick(emoji)}
                                        className='emoji-item'
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <input
                        className='new-message-input'
                        placeholder='Type a message...'
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setNewMessage(e.target.value)}
                        value={newMessage}
                    />

                    <div className='icon-buttons'>
                        <button
                            type='button'
                            className='mdi mdi-camera camera-button'
                        ></button>
                    </div>

                    <button
                        type='submit'
                        className='mdi mdi-send send-button'
                    ></button>
                </div>
            </form>

            {showProfile && <UserProfile onClose={toggleProfile} />}
        </div>
    );
};
