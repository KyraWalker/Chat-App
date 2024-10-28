import React, {useState} from 'react';
import {Chat} from './components/Chat.js';
import {Login} from './components/Auth/Login.js';
import {AppWrapper} from './components/AppWrapper.js';
import Cookies from 'universal-cookie';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import {Register} from './components/Auth/Register.js';
import {FindRoom} from './components/List Chat/FindRoom.js';
import ListChat from './components/List Chat/ListChat.js';

const cookies = new Cookies();

function App() {
    const [isAuth, setIsAuth] = useState(cookies.get('auth-token'));
    const [isInChat, setIsInChat] = useState(false);
    const [room, setRoom] = useState('');

    return (
        <Router>
            <AppWrapper
                isAuth={isAuth}
                setIsAuth={setIsAuth}
                setIsInChat={setIsInChat}
            >
                <div className='full-screen flex justify-center items-center'>
                    <Routes>
                        {!isAuth ? (
                            <>
                                <Route
                                    path='/login'
                                    element={<Login setIsAuth={setIsAuth} />}
                                />
                                <Route
                                    path='/register'
                                    element={<Register setIsAuth={setIsAuth} />}
                                />
                                <Route
                                    path='*'
                                    element={<Navigate to='/login' />}
                                />
                            </>
                        ) : (
                            <>
                                <Route
                                    path='/findRoom'
                                    element={
                                        <FindRoom
                                            setRoom={setRoom}
                                            setIsInChat={setIsInChat}
                                        />
                                    }
                                />
                                <Route
                                    path='/'
                                    element={
                                        <ListChat
                                            setRoom={setRoom}
                                            setIsInChat={setIsInChat}
                                        />
                                    }
                                />
                                <Route
                                    path='/room/:roomName'
                                    element={<Chat room={room} />}
                                />

                                <Route
                                    path='/room/*'
                                    element={<Navigate to={`/room/${room}`} />}
                                />
                            </>
                        )}
                    </Routes>
                </div>
            </AppWrapper>
        </Router>
    );
}

export default App;
