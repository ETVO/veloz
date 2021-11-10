import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

// import pages
import Login from './pages/Login'
import Empreendimentos from './pages/Empreendimentos'

// import hooks
import useToken from './hooks/useToken'

// import CSS
import './css/App.css'

function App() {

	const { token, setToken } = useToken()

	if(!token) {
		return <Login setToken={setToken} />
	}

	const logOut = e => {
		setToken(null)
	}

	return (
		<Router>
			<div className="App">
				<h1>Sistema Veloz</h1>
				<Routes>
					<Route path="/empreendimentos" element={(<Empreendimentos />)}></Route>
				</Routes>
				<button onClick={logOut}>Logout</button>
			</div>
		</Router>
	)
}

export default App
