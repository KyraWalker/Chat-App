import {auth} from '../utils/firebaseConfig';
import {signOut} from 'firebase/auth';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const AppWrapper = ({children, isAuth, setIsAuth, setIsInChat}) => {
    const signUserOut = async () => {
        await signOut(auth);
        cookies.remove('auth-token');
        setIsAuth(false);
        setIsInChat(false);
    };

    return (
        <div>
            <div className='bg-white-700 rounded-b-lg fixed top-0 left-0 right-0 z-10'>
                <div className='mx-auto flex flex-col lg:flex-row max-w-7xl items-center justify-between p-6 lg:px-8 text-white'>
                    <div className='flex items-center justify-between w-full'>
                        <a href='#' className='flex items-center space-x-2'>
                            <span className='sr-only'>Your Company</span>
                            <img
                                alt='Logo'
                                src='https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600'
                                className='h-8 w-auto'
                            />
                            <h1 className='text-xl font-semibold text-black ml-2'>
                                Chat App
                            </h1>
                        </a>
                    </div>

                    {/* Sign-out button (only visible on large screens and when logged in) */}
                    {isAuth && (
                        <div className='mt-4 lg:mt-0 lg:flex lg:justify-end'>
                            <button
                                className='text-sm font-semibold text-gray-300 hover:text-black'
                                onClick={signUserOut}
                            >
                                Sign Out <span aria-hidden='true'>&rarr;</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main content with padding to prevent it from being hidden behind the fixed header */}
            <div className='app-container pt-20'>{children}</div>
        </div>
    );
};
