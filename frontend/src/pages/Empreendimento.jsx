import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'

import '../scss/Empreendimento.scss'

import FilterCabanas from '../components/FilterCabanas'

const EMPREENDIMENTO = gql`
    query GetEmpreendimento($id: ID!) {
        empreendimento(id: $id) {
            id
            nome
            cabanas {
                id
                nome
                tamanho
                quartos
                valorBase
                reservada
                foto {formats}
                cotas {
                    id
                    numero
                    disponivel
                }
            }
        }
    } 
`

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// returns true if available, false if sold out
function cycleCotas(cabana) {
    if(cabana.cotas) {
        if(cabana.cotas.map(cota => {
            if(cota.disponivel)
                return true
        })) {
            return true
        }
        else {
            return false
        }
    }
}

export default function Empreendimento() {
    const { id } = useParams()
    
    const { loading, error, data } = useQuery(EMPREENDIMENTO, {
        variables: { id: id }
    })

    const [cabanas, setCabanas] = useState()

    if(!cabanas && data)
        setCabanas(data.empreendimento.cabanas)

    if (loading) return <p>Carregando...</p>
    if (error) return <p>Ocorreu um erro ao carregar os empreendimentos.</p>

    return (
        <div className='Empreendimento'>
            <Row>
                <Col lg={4} className='unidades'>
                    <div className="heading">
                        <h1>Unidades</h1>
                        <FilterCabanas cabanas={cabanas} setCabanas={setCabanas} />
                    </div>
                    <div className="list-unidades">
                        {data.empreendimento.cabanas.map(uni => (
                            <div key={uni.id} className="unidade-card">
                                <div className="foto">
                                    <img src={'http://localhost:1337' + uni.foto.formats.thumbnail.url } />
                                </div>
                                <div className="info">
                                    <div className='nome'>
                                        {uni.nome}
                                    </div>
                                    <div className="caracter">
                                        {uni.tamanho}&nbsp;&nbsp;{uni.quartos}
                                    </div>
                                    <div className="valor-base">
                                        {'R$ ' + numberWithCommas(uni.valorBase)}
                                    </div>
                                </div>
                                <div className="tag">
                                    {
                                    (uni.reservada) ? (
                                        <span>RESERVADA</span>
                                    ) : (
                                        (cycleCotas(uni)) ? (
                                            <span>DISPONÍVEL</span>
                                        ) 
                                        : (
                                            <span>VENDIDA</span>
                                        )
                                    )
                                    }
                                </div>
                            </div>
                        ))}
                    </div>

                </Col>
                <Col lg={8} className='mapa'>
                </Col>
            </Row>
        </div>
    )
}
