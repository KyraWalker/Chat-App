import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom'; // Import useNavigate
import '../../styles/ListChat.css';
import {db, auth} from '../../utils/firebaseConfig';
import {collection, onSnapshot, query, where} from 'firebase/firestore';
import {Chat} from '../Chat/Chat';

const ListChat = ({setRoom, setIsInChat}) => {
    const [rooms, setRooms] = useState([]);
    const user = auth.currentUser?.displayName;
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const chatRef = collection(db, 'messages');
            const queryChat = query(chatRef, where('user', '==', user));
            const unsubscribe = onSnapshot(queryChat, (snapshot) => {
                const chatData = {};
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    const room = data.room;

                    if (!chatData[room]) {
                        chatData[room] = [];
                    }
                    chatData[room].push({...data, id: doc.id});
                });

                const roomArray = Object.keys(chatData).map((room) => ({
                    roomName: room,
                    messages: chatData[room],
                }));
                setRooms(roomArray);
                console.log('chatdata: ', chatData);
            });

            return () => unsubscribe();
        }
    }, [user]);

    console.log('Room list: ', rooms.messages);

    const handleRoomClick = (roomName) => {
        setRoom(roomName);
        setIsInChat(true);
        navigate(`/room/${roomName}`);
    };

    return (
        <div className='list-chat'>
            <h3 className='header-room'>Recent Rooms</h3>
            <div className='card'>
                {rooms.length > 0 ? (
                    rooms.map((room, index) => (
                        <button
                            key={index}
                            className='button-chat'
                            onClick={() => handleRoomClick(room.roomName)}
                            aria-label={`Chat with ${room.roomName}`}
                        >
                            <div className='chat-list'>
                                <img
                                    className='icon-profile'
                                    src='https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-32-02_vll8uv.jpg'
                                    width='32'
                                    height='32'
                                    alt='Nhu Cassel'
                                />
                                <div>
                                    <h4 className='title-name'>
                                        {room.roomName}
                                    </h4>

                                    <div className='title-chat'>
                                        {
                                            room.messages[
                                                room.messages.length - 1
                                            ]?.text
                                        }{' '}
                                        {/* Display last message */}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))
                ) : (
                    <div>No recent chat rooms found.</div>
                )}
            </div>
        </div>
    );
};

export default ListChat;
