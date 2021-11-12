import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

// Apollo
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

// import pages & components
import Login from './pages/Login'
import Empreendimentos from './pages/Empreendimentos'
import Empreendimento from './pages/Empreendimento'
import Header from './components/Header'

// import hooks
import useToken from './hooks/useToken'

// import styling
import './scss/App.scss'


function App() {

	const { token, setToken } = useToken()

	if(!token) {
		return (
			<Router>
				<div className="App">
					<Routes>
						<Route exact path="*" element={(<Navigate to="/login" />)}></Route>
						<Route path="/login" element={(<Login setToken={setToken} />)}></Route>
					</Routes>
				</div>
			</Router>
		)
	}
	else if(token.user.confirmed && !token.user.blocked) {

		// Create httpLink
		const httpLink = new HttpLink({
			uri: 'http://localhost:1337/graphql',
		})
	
		// Create authLink with Bearer Token
		const authLink = setContext((_, { headers }) => {
			return {
				headers: {
					...headers,
					authorization: token ? `Bearer ${token.jwt}` : "",
				}
			}
		})
	
		// Create ApolloClient using the authLink along with the base httpLink
		const authClient = new ApolloClient({
			link: authLink.concat(httpLink),
			uri: 'http://localhost:1337/graphql',
			cache: new InMemoryCache()
		})

		const logOut = e => {
			setToken(null)
		}
		
		return (
			<Router>
				<ApolloProvider client={authClient}>
					<Header logOut={ logOut } user={ token.user }>

					</Header>
					<div className="App">
						<Routes>
							<Route path="*" element={<Navigate to="/" />}></Route>
							<Route exact path="/" element={(<Empreendimentos />)}></Route>
							<Route exact path="/empreendimentos" element={(<Empreendimentos />)}></Route>
							<Route exact path="/empreendimento/:id" element={(<Empreendimento />)}></Route>
						</Routes>
					</div>
				</ApolloProvider>
			</Router>
		)
	}
}

export default App
