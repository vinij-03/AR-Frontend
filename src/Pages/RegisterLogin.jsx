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
            <div className='bg-blue-100 h-screen flex items-center justify-center'>
                <form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4' onSubmit={Register}>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
                        type='text'
                        placeholder='username'
                    />
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
                        type='password'
                        placeholder='password'
                    />
                    <div className='flex flex-col w-full space-y-2 justify-center'>
                        <button
                            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                            type='submit'
                        >
                            {isRegisterOrLogin === 'register' ? 'Register' : 'Log In'}
                        </button>
                        <div>
                            {isRegisterOrLogin === 'register' && (
                                <button
                                    className='bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                                    type='button'
                                    onClick={() => setIsRegisterOrLogin('Log In')}
                                >
                                    Log In
                                </button>
                            )}
                            {isRegisterOrLogin === 'Log In' && (
                                <button
                                    className='bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                                    type='button'
                                    onClick={() => setIsRegisterOrLogin('register')}
                                >
                                    Register
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default RegisterLogin;
