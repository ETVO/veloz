import React, { useState } from 'react'
import { Container, Button } from 'react-bootstrap'
import { useQuery, gql } from '@apollo/client'
import { Link } from 'react-router-dom'

import '../scss/Empreendimentos.scss'

const EMPREENDIMENTOS = gql`
    query GetEmpreendimentos {
        empreendimentos {
            id,
            nome,
            logo {url},
            cover {url}
        }
    }
`

function Empreendimentos() {

    const { loading, error, data } = useQuery(EMPREENDIMENTOS); 

    


    if(loading) {
        return (
            <div className='Empreendimentos d-flex h-100'>
                <p className='m-auto'>Carregando...</p>
            </div>
        ) 
    }
    if(error) {
        return (
            <div className='Empreendimentos d-flex h-100'>
                <p className='m-auto'>Ocorreu um erro ao carregar a página de proposta.</p>
            </div>
        )
    }

    return (
        <Container className='Empreendimentos mt-5 col-xl-9'>
            <h1 className='title'>Bem vindo!</h1>

            <h5 className='mt-4 mb-3 fw-normal text-secondary'>Empreendimentos:</h5>

            {data.empreendimentos.map(emp => (
                <Link key={emp.id} to={'/empreendimento/' + emp.id}>
                    <div className='emp-card'>
                        <img className='cover' src={'http://localhost:1337' + emp.cover.url} />

                        <div className="overlay">
                            <div className="logo">
                                <img src={'http://localhost:1337' + emp.logo.url} alt="" />
                            </div>
                            <div className="button">
                                <Button className='d-flex'>
                                    vender
                                    <span className='ms-1 bi bi-chevron-right'></span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}

        </Container>
    )
}

export default Empreendimentos
