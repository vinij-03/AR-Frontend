import Routes from './Routes';
import axios from 'axios';
import { UserContextProvider } from './UserContext'



function App() {

  axios.defaults.baseURL = 'https://resonant-lillian-vineetjana-d2332314.koyeb.app/';  

  axios.defaults.withCredentials = true;

  return (
    <>
      <UserContextProvider>
        <Routes />
      </UserContextProvider>
    </>
  )
}

export default App