import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Button } from 'react-bootstrap'

// styling
import '../scss/Header.scss'

async function getHeaderLogo() {
    const response = await fetch('http://localhost:1337/estaticas')

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
                    <img src={'http://localhost:1337' + logo} alt="" />
                </Link>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className='justify-content-end'>
                <div className="logged-as">
                    <span className='name'>
                        {user.fullname}
                    </span>
                    <img className='photo d-block' src={'http://localhost:1337' + user.photo.url} alt="" />
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
