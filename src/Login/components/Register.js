import {auth, provider} from '../../firebaseConfig';
import {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    updateProfile,
} from 'firebase/auth';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const Register = ({setIsAuth}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const signUp = async () => {
        setIsSubmitting(true);
        try {
            const result = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );

            const user = result.user;

            alert('Verification email sent. Please check your inbox');

            await updateProfile(user, {
                displayName: name,
            });

            await sendEmailVerification(user);

            // Check if the email is verified
            if (!user.emailVerified) {
                alert('Please verify your email before logging in.');
                navigate('/login');
                return; // Prevent the user from logging in
            }

            cookies.set('auth-token', result.user.refreshToken);
            setIsAuth(true);
            setName('');
            setEmail('');
            setPassword('');
        } catch (err) {
            console.error(err);
            setError('The email is already exist');
        } finally {
            setIsSubmitting(false);
        }
    };

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if the email is verified
            if (!user.emailVerified) {
                alert('Please verify your email before logging in.');
                return; // Prevent the user from logging in
            }

            cookies.set('auth-token', user.refreshToken);
            setIsAuth(true);
            navigate('/'); // Redirect to the home or dashboard page after successful login
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className='relative flex flex-col justify-center min-h-screen overflow-hidden'>
            <div className='w-full p-6 m-auto bg-white rounded-md shadow-xl lg:max-w-xl'>
                <h1 className='text-3xl font-semibold text-center text-red-700 uppercase'>
                    Register
                </h1>
                {error && (
                    <p className='text-red-500 text-center bg-white border rounded-md border-red-400'>
                        {error}
                    </p>
                )}

                <form
                    className='mt-6'
                    onSubmit={(e) => {
                        e.preventDefault();
                        signUp();
                    }}
                >
                    <div className='mb-2'>
                        <label
                            htmlFor='name'
                            className='block text-sm font-semibold text-gray-800'
                        >
                            Name
                        </label>
                        <input
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className='block w-full px-4 py-2 mt-2 text-red-700 bg-white border rounded-md focus:border-red-400 focus:ring-red-300 focus:outline-none focus:ring focus:ring-opacity-40'
                            placeholder='Enter your name'
                        />
                    </div>
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
                    <div className='mt-6'>
                        <button
                            type='submit'
                            disabled={isSubmitting}
                            className='w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-red-700 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600'
                        >
                            {isSubmitting ? 'Registering...' : 'Register'}
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
                    Already have an account?{' '}
                    <a
                        className='font-medium text-red-600 hover:underline'
                        onClick={() => navigate('/login')}
                    >
                        Log In
                    </a>
                </p>
            </div>
        </div>
    );
};
