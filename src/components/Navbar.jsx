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
        <div className="w-full flex justify-between items-center px-6 py-3 bg-slate-800 text-white shadow-md">
            <div className="text-lg font-semibold">AR-APP</div>
            <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
            >
                Logout
            </button>
        </div>
    );
}

export default Navbar;
