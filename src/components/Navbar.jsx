import {useContext} from 'react';
import { UserContext } from '../UserContext';
import axios from 'axios';

function Navbar() {
    const { username, id, setId, setUsername } = useContext(UserContext);
    function logout() {
        axios.post('/logout')
            .then(() => {
                setId(null);
                setUsername(null);
            })
            .catch((error) => {
                console.error("Logout failed", error);
            });
    }

    return (
        <div className="w-full flex justify-between items-center px-6 py-3 bg-white text-blue-800 shadow-md border-b border-gray-200">
            <div className="text-xl font-bold">AR-Application</div>
            <button
                onClick={logout}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
            >
                Logout
            </button>
        </div>

    );
}

export default Navbar;
