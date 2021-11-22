import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Button } from 'react-bootstrap'

// styling
import '../scss/Header.scss'

const API_URL = process.env.REACT_APP_API_URL

async function getHeaderLogo() {
    const response = await fetch(API_URL + '/estaticas')

    const data = await response.json()

    if(data.statusCode === 400){
        return null
    }  

    return data 
}

export default function Header({logOut, user}) {

    var [logo, setLogo] = useState();

    (async () => {
        const loginData = await getHeaderLogo()
        setLogo(loginData.logoHeader.url)
    })()

    return (
        <Navbar className='Header px-4 py-1 text-light'>
            <Navbar.Brand>
                <Link to='/'>
                    <img src={API_URL + logo} alt="" />
                </Link>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className='justify-content-end'>
                <div className="logged-as">
                    <span className='name'>
                        {user.fullname}
                    </span>
                    <img className='photo d-block' src={API_URL + user.photo.url} alt="" />
                </div>
                <Button className="log-out" onClick={ logOut }>
                    <span>
                        Sair
                    </span>
                    <span className='bi bi-arrow-bar-right'>

                    </span>
                </Button>
            </Navbar.Collapse>
        </Navbar>
    )
}
