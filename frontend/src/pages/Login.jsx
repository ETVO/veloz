import React, { useState } from 'react'

// import CSS
import '../css/Login.css'

async function loginUser(credentials) {
    const response = await fetch('http://localhost:1337/auth/local', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })

    const data = await response.json()

    if(data.statusCode == 400){
        return null
    }  

    return data
        
}

function Login({ setToken }) {

    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [error, setError] = useState()

    const handleSubmit = async e => {
        setError('')
        e.preventDefault()

        const token = await loginUser({
            identifier: username,
            password: password
        })
        if(token !== null) {
            setToken(token)
        }
        else {
            setError('Incorrect password or username')
        }
    }

    return (
        <div className="login-wrapper">
            <h1>Please Login</h1>
            <small style={{color: 'red'}}>{error}</small>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input type="text" onChange={e => setUsername(e.target.value)} />
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={e => setPassword(e.target.value)} />
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default Login
