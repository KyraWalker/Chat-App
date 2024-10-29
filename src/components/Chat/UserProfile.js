import React, {useEffect, useState} from 'react';
import {auth} from '../firebase-config';
import '../styles/UserProfile.css';

export const UserProfile = ({onClose}) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    if (!user) {
        return null;
    }

    return (
        <div className='user-profile-popup'>
            <div className='profile-header'>
                <h2>User Profile</h2>
                <button onClick={onClose} className='close-button'>
                    X
                </button>
            </div>
            <div className='profile-info'>
                <img
                    src={user.photoURL || 'default-avatar.png'}
                    alt='Profile'
                    className='profile-pic'
                />
                <h3>Name: {user.displayName}</h3>
                <p>Email: {user.email}</p>
            </div>
        </div>
    );
};
