import {signInWithPopup} from 'firebase/auth';
import {auth, provider} from '../../firebaseConfig.js';
import Cookies from 'universal-cookie';
import '../../index.css';

const cookies = new Cookies();

const Auth = () => {
    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            cookies.set('auth-token', result.user.refreshToken);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className='relative flex flex-col justify-center min-h-screen overflow-hidden'>
            <span>
                <p className='font-bold text-xl mb-2'>Sign In</p>
            </span>

            <div className='px-6 pt-4 pb-2'>
                <button
                    className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mt-4 rounded'
                    onClick={signInWithGoogle}
                >
                    Google
                </button>
            </div>

            <div>
                <span>Username</span>
                <input
                    type='text'
                    className='mr-2.5 mb-2 h-full min-h-[44px] w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-950 placeholder:text-zinc-400 focus:outline-0 dark:border-zinc-800 dark:bg-transparent dark:text-white dark:placeholder:text-zinc-400'
                ></input>
            </div>
            <div>
                <span>Password</span>
                <input
                    type='text'
                    className='mr-2.5 mb-2 h-full min-h-[44px] w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-950 placeholder:text-zinc-400 focus:outline-0 dark:border-zinc-800 dark:bg-transparent dark:text-white dark:placeholder:text-zinc-400'
                ></input>
            </div>
        </div>
    );
};

export default Auth;
