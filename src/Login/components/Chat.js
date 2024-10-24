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

export const Chat = (props) => {
    const {room, signUserOut} = props;
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);

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

    return (
        <div className='chat-app'>
            <div className='header'>
                <h1 className='header-title'>{room.toUpperCase()}</h1>
                <button onClick={signUserOut} className='sign-out-button'>
                    <img
                        src='../styles/icon/signout.png'
                        alt='Sign Out'
                        className='h-6 w-6'
                    />
                </button>
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
        </div>
    );
};
