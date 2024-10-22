import React, {useState} from 'react';
import {Chat} from './Login/components/Chat.js';
import {Login} from './Login/components/Login.js';
import {AppWrapper} from './Login/components/AppWrapper.js';
import Cookies from 'universal-cookie';
import './App.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import {Register} from './Login/components/Register.js';

const cookies = new Cookies();

function App() {
    const [isAuth, setIsAuth] = useState(cookies.get('auth-token'));
    const [isInChat, setIsInChat] = useState(null);
    const [room, setRoom] = useState('');

    // If not authenticated, show login/register page
    if (!isAuth) {
        return (
            <Router>
                <Routes>
                    <Route
                        path='/login'
                        element={
                            <AppWrapper isAuth={isAuth} setIsAuth={setIsAuth}>
                                <Login setIsAuth={setIsAuth} />
                            </AppWrapper>
                        }
                    />
                    <Route
                        path='/register'
                        element={
                            <AppWrapper isAuth={isAuth} setIsAuth={setIsAuth}>
                                <Register setIsAuth={setIsAuth} />
                            </AppWrapper>
                        }
                    />
                    {/* Redirect to login page if any other route is accessed */}
                    <Route path='*' element={<Navigate to='/login' />} />
                </Routes>
            </Router>
        );
    }

    return (
        <AppWrapper
            isAuth={isAuth}
            setIsAuth={setIsAuth}
            setIsInChat={setIsInChat}
        >
            {!isInChat ? (
                <div className='room'>
                    <label> Type room name: </label>
                    <input onChange={(e) => setRoom(e.target.value)} />
                    <button
                        onClick={() => {
                            setIsInChat(true);
                        }}
                    >
                        Enter Chat
                    </button>
                </div>
            ) : (
                <Chat room={room} />
            )}
        </AppWrapper>
    );
}

export default App;
