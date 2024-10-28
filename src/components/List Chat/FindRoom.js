import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import ListChat from './ListChat';
import '../../styles/Room.css';

export const FindRoom = ({setRoom, setIsInChat}) => {
    const [roomName, setRoomName] = useState('');
    const navigate = useNavigate();

    const handleEnterChat = () => {
        setRoom(roomName);
        setIsInChat(true);
        navigate(`/room/${roomName}`);
        console.log('room: ', roomName);
    };

    return (
        <div className='room'>
            <div className='card'>
                <label className='label'>Type room name:</label>
                <div className='card-input'>
                    <input
                        type='text'
                        className='input-room'
                        onChange={(e) => setRoomName(e.target.value)}
                        placeholder='Enter room'
                    />
                    <button
                        className={`enter-button ${
                            roomName === ''
                                ? 'not-allowed-button'
                                : 'allowed-button'
                        }`}
                        onClick={handleEnterChat}
                        disabled={roomName === ''}
                    >
                        Enter Chat
                    </button>
                </div>

                <ListChat setRoom={setRoom} setIsInChat={setIsInChat} />
            </div>
        </div>
    );
};
