import React, { useState } from 'react'

function Empreendimentos() {

    const [token, setToken] = useState(localStorage.getItem('authToken'));

    if(!token) window.location.href = '/login'

    const logOut = e => {
        setToken(null)
        localStorage.removeItem('authToken')
        window.location.href = '/login'
    }

    return (
        <div>
            <h1>Empreendimentos</h1>
            your token is {token}
            <br />
            <button onClick={logOut}>Log Out</button>
        </div>
    )
}

export default Empreendimentos
