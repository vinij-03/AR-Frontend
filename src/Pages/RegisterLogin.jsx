import { useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import axios from 'axios';

function RegisterLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isRegisterOrLogin, setIsRegisterOrLogin] = useState('register');

    const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

    async function Register(ev) {
        const url = isRegisterOrLogin === 'register' ? '/register' : '/login';
        ev.preventDefault();
        try {
            const { data } = await axios.post(url, { username, password });
            setLoggedInUsername(username);
            setId(data.id);
        } catch (error) {
            console.error("An error occurred during registration or login:", error);
        }
    }

    return (
        <>
            <div className='bg-gray-100 h-screen flex items-center justify-center'>
                <form className='bg-white shadow-xl rounded-lg px-10 pt-8 pb-10 w-full max-w-sm' onSubmit={Register}>
                    <h2 className='text-blue-800 text-2xl font-bold mb-6 text-center'>AR-Application</h2>

                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className='appearance-none block w-full bg-gray-100 text-gray-800 border border-gray-300 rounded py-3 px-4 mb-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
                        type='text'
                        placeholder='Username'
                    />
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='appearance-none block w-full bg-gray-100 text-gray-800 border border-gray-300 rounded py-3 px-4 mb-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
                        type='password'
                        placeholder='Password'
                    />

                    <div className='flex flex-col space-y-3'>
                        <button
                            className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                            type='submit'
                        >
                            {isRegisterOrLogin === 'register' ? 'Register' : 'Log In'}
                        </button>

                        {isRegisterOrLogin === 'register' ? (
                            <button
                                className='text-blue-600 border border-blue-600 hover:bg-blue-50 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                                type='button'
                                onClick={() => setIsRegisterOrLogin('Log In')}
                            >
                                Log In
                            </button>
                        ) : (
                            <button
                                className='text-blue-600 border border-blue-600 hover:bg-blue-50 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                                type='button'
                                onClick={() => setIsRegisterOrLogin('register')}
                            >
                                Register
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </>
    
    );
}

export default RegisterLogin;
