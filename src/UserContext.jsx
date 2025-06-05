import axios from 'axios'
import { useState,createContext, useEffect } from 'react'

export const UserContext = createContext({})

export const UserContextProvider = ({ children }) => {
    const [username, setUsername] = useState(null)
    const [ id, setId] = useState(null)

    useEffect(() => {
        axios.get('/profile').then(res => {
            setUsername(res.data.username)
            setId(res.data.id)
        })
    })

    return (
        <UserContext.Provider value={ {username, setUsername, id, setId} }>
            {children}
        </UserContext.Provider> 
    )
} 