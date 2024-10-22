import {auth, provider} from '../../firebaseConfig';
import {
    signInWithPopup,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
} from 'firebase/auth';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const Login = ({setIsAuth}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            cookies.set('auth-token', result.user.refreshToken);
            setIsAuth(true);
            alert('Successfully login!');
        } catch (err) {
            console.error(err);
            setError('Failed to sign in with Google');
        }
    };

    const signInWithEmailPassword = async () => {
        if (!email || !password) {
            setError('Please enter both email and password. ');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            );

            const user = result.user;

            // Check if the email is verified
            if (!user.emailVerified) {
                alert('Please verify your email before logging in.');
                setIsSubmitting(false);

                return; // Prevent the user from logging in
            }
            console.log(result.user);
            alert('Successfully login!');
            cookies.set('auth-token', result.user.refreshToken);
            setError('');
            setEmail('');
            setPassword('');
            setIsAuth(true);
        } catch (err) {
            console.error(err);
            setError('Invalid email or password');
        }
        setIsSubmitting(false);
    };

    // const forgotPassword = async () => {
    //     const resetEmail = sendPasswordResetEmail(auth, email)
    //         .then(() => {
    //             alert('Password reset email sent! Check your inbox.');
    //         })
    //         .catch((error) => {
    //             const errorCode = error.code;
    //             const errorMessage = error.message;
    //         });
    // };

    return (
        <div className='relative flex flex-col justify-center min-h-screen overflow-hidden'>
            <div className='w-full p-6 m-auto bg-white rounded-md shadow-xl lg:max-w-xl'>
                <h1 className='text-3xl font-semibold text-center text-red-700 uppercase'>
                    Sign in
                </h1>
                {error && <p className='text-red-500 text-center '>{error}</p>}

                <form
                    className='mt-6'
                    onSubmit={(e) => {
                        e.preventDefault();
                        signInWithEmailPassword();
                    }}
                >
                    <div className='mb-2'>
                        <label
                            htmlFor='email'
                            className='block text-sm font-semibold text-gray-800'
                        >
                            Email
                        </label>
                        <input
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='block w-full px-4 py-2 mt-2 text-red-700 bg-white border rounded-md focus:border-red-400 focus:ring-red-300 focus:outline-none focus:ring focus:ring-opacity-40'
                            placeholder='Enter your email'
                        />
                    </div>
                    <div className='mb-2'>
                        <label
                            htmlFor='password'
                            className='block text-sm font-semibold text-gray-800'
                        >
                            Password
                        </label>
                        <input
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='block w-full px-4 py-2 mt-2 text-red-700 bg-white border rounded-md focus:border-red-400 focus:ring-red-300 focus:outline-none focus:ring focus:ring-opacity-40'
                            placeholder='Enter your password'
                        />
                    </div>

                    <p className='mt-1 text-xs font-light text-center text-gray-700'>
                        <a className='font-medium text-red-600 hover:underline'>
                            Forgot Password?
                        </a>
                    </p>
                    <div className='mt-6'>
                        <button
                            type='submit'
                            disabled={isSubmitting}
                            className='w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-red-700 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600'
                        >
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>

                <div className='relative flex items-center justify-center w-full mt-6 border border-t'>
                    <div className='absolute px-5 bg-white'>Or</div>
                </div>

                <div className='flex mt-4 gap-x-2'>
                    <button
                        type='button'
                        onClick={signInWithGoogle}
                        className='flex items-center justify-center w-full p-2 border border-gray-600 rounded-md hover:bg-red-200 focus:ring-2 focus:ring-offset-1 focus:ring-violet-600'
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 32 32'
                            className='w-5 h-5 fill-current'
                        >
                            <path d='M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z'></path>
                        </svg>
                    </button>
                </div>

                <p className='mt-8 text-xs font-light text-center text-gray-700'>
                    Don't have an account?{' '}
                    <a
                        onClick={() => navigate('/register')}
                        className='font-medium text-red-600 hover:underline'
                    >
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
};
