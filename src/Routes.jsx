// import React from 'react'
import RegisterLogin from './Pages/RegisterLogin'
import { useContext } from 'react'
import { UserContext } from './UserContext'
import AppPage from './Pages/ARComp'


function Routes() {
    const { username } = useContext(UserContext)
    if (username) {
        return (
            <>
                <AppPage />
            </>
        )
    }
    return (
        <>
            <RegisterLogin />
        </>
    )
    // return(
    //     <>
    //         <AppPage />
    //     </>
    // )
}


export default Routes