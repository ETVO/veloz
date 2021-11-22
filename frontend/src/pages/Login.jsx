import React, { useState } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useQuery, gql } from '@apollo/client'

// import styling
import '../scss/Login.scss'

// Create login page query
const LOGIN = gql`
    query GetLogin {
        login {
            id,
            imagem
        }
    }
`

const API_URL = process.env.REACT_APP_API_URL

async function loginUser(credentials) {
    const response = await fetch(API_URL + '/auth/local', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })

    const data = await response.json()

    if(data.statusCode === 400){
        return null
    }  

    return data       
}

async function getLoginCover() {
    const response = await fetch(API_URL + '/estaticas')

    const data = await response.json()

    if(data.statusCode === 400){
        return null
    }  

    return data 
}

function Login({ setToken }) {

    var [image, setImage] = useState();

    try {
        (async () => {
            const loginData = await getLoginCover()
        
            setImage(loginData.coverLogin.url)
        })()
    } catch(err) {
        
    }

    const [userInput, setUserInput] = useState()
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
            setError('Usuário ou senha incorretos')
            userInput.focus()
        }
    }

    return (

        <div className="Login">
            <Row className='p-0 w-100'>
                <Col lg='8' className="present p-0">
                    <img className='cover-img d-block' src={API_URL + image} alt="" />
                </Col>

                <Col lg='4' className="form d-flex p-0">
                    <div className="my-auto form-wrap">
                        <small className="text-danger mb-3" >{error}</small>

                        <h1 className='text-primary'>Login</h1>

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className='mb-3' controlId='username'>
                                <Form.Label>Usuário ou Email</Form.Label>
                                <Form.Control type='text' ref={(input => { setUserInput(input) })} onChange={e => setUsername(e.target.value)} />
                            </Form.Group>

                            <Form.Group className='mb-3' controlId='password'>
                                <Form.Label>Senha</Form.Label>
                                <Form.Control type='password' onChange={e => setPassword(e.target.value)} />
                            </Form.Group>

                            <div className="d-flex">
                                <div className="ms-auto">
                                    {/* <a href='' className='text-primary forget'>
                                        <small>
                                            Esqueceu sua senha?
                                        </small>
                                    </a> */}
                                    <Button className='submit' variant='primary' type='submit'>
                                        logar
                                    </Button>
                                </div>
                            </div>

                        </Form>
                    </div>
                </Col>
            </Row>
        </div>

    )
}

export default Login
