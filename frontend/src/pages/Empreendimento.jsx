import React, { useState } from 'react'
import { Col, Row, Toast } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import { CabanaIcon, cycleCotas } from '../helpers/cabanas'

import '../scss/Empreendimento.scss'

import FilterCabanas from '../components/FilterCabanas'
import ListCabanas from '../components/ListCabanas'
import GalleryCabana from '../components/GalleryCabana'

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
                galeria {
                    id
                    url
                    caption
                }
                cotas {
                    id
                    numero
                    disponivel
                }
            }
        }
    } 
`

export default function Empreendimento() {
    const { id } = useParams()

    const { loading, error, data } = useQuery(EMPREENDIMENTO, {
        variables: { id: id }
    })

    const [cabanas, setCabanas] = useState()
    const [active, setActive] = useState()
    const [toastShow, setToastShow] = useState(false)
    const [toastText, setToastText] = useState('Empreendimento')

    if (data) {
        if (!cabanas)
            setCabanas(data.empreendimento.cabanas)
    }

    if (loading) return <p>Carregando...</p>
    if (error) return <p>Ocorreu um erro ao carregar os empreendimentos.</p>

    const showUnidade = uni => {
        let disponivel = cycleCotas(uni)

        if (uni.reservada) {
            setToastShow(true)
            setToastText('A unidade selecionada encontra-se reservada.')
        }
        else if (!disponivel) {
            setToastShow(true)
            setToastText('A unidade selecionada já foi vendida.')

        }
        else {
            setActive(uni)
        }
    }

    return (
        <div className='Empreendimento'>
            <Toast onClose={() => setToastShow(false)} show={toastShow} delay={5000} autohide>
                <Toast.Header className='text-warning'>
                    <span className="bi bi-lightbulb me-2"></span>
                    <strong className="me-auto">Sistema Veloz</strong>
                </Toast.Header>
                <Toast.Body>{toastText}</Toast.Body>
            </Toast>
            <Row>
                <Col lg={4} className='unidades'>

                    {(active) ? (
                        <div className="selection">
                            <div className="heading">
                                <div className='back-button'>
                                    <span className='bi bi-chevron-left me-1'></span>
                                    Lista de unidades
                                </div>
                                <div className="title mt-3">
                                    <h2 className='d-flex align-items-center'>
                                        <CabanaIcon />
                                        <span className='ms-2'>{active.nome}</span>
                                    </h2>
                                </div>
                                <div className="gallery">
                                    <GalleryCabana id={'galleryCabana' + active.id} images={active.galeria} />
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="no-selection">
                            <div className="heading">
                                <h1>Unidades</h1>
                                <FilterCabanas cabanas={data.empreendimento.cabanas} setCabanas={setCabanas} />
                            </div>

                            <ListCabanas cabanas={cabanas} showUnidade={showUnidade} />
                        </div>
                    )}

                </Col>
                <Col lg={8} className='mapa'>
                </Col>
            </Row>
        </div>
    )
}
