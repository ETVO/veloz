import React from 'react'

import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client"
import { setContext } from '@apollo/client/link/context'

// import pages
import Empreendimentos from "./Empreendimentos"
import Login from "./Login"


// Get auth token and create ApolloClient
const token = localStorage.getItem('authToken')

// Create httpLink
const httpLink = createHttpLink({
    uri: '/graphql',
})

// Create authLink with Bearer Token
const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
})

// Create ApolloClient using the authLink along with the base httpLink
const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
})

function Homepage() {
    console.log(token)
    return (
        <div>
            {(token !== null) ? (
                <Empreendimentos />
            ) : (
                <Login />
            )}
        </div>
    )
}

export default Homepage
