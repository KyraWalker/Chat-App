import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
} from 'firebase/auth';
import {createContext, useContext, useEffect, useState} from 'react';
import {auth} from '../firebaseConfig';
import {GoogleAuthProvider} from 'firebase/auth/web-extension';

const userAuthContext = createContext();

export function UserAuthContextProvider({children}) {
    const [user, setUser] = useState({});

    function logIn(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function signIn(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function logOut() {
        return signOut(auth);
    }

    function googleSignIn() {
        const googleAuthProvider = new GoogleAuthProvider();
        return signInWithPopup(auth, googleAuthProvider);
    }

    useEffect(() => {
        const unsubcribe = onAuthStateChanged(auth, (currentuser) => {
            console.log('Auth', currentuser);
            setUser(currentuser);
        });

        return () => {
            unsubcribe();
        };
    }, []);

    return (
        <userAuthContext.Provider
            value={{user, logIn, signIn, logOut, googleSignIn}}
        >
            [children]
        </userAuthContext.Provider>
    );
}

export function useUserAuth() {
    return useContext(userAuthContext);
}
