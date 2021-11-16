import React, { useState } from 'react'
import { Col, Row, Toast, Button, Container } from 'react-bootstrap'
import { useParams, Link } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import { CabanaIcon, cycleCotas, formatNumber } from '../helpers/cabanas'

import '../scss/Empreendimento.scss'

import FilterCabanas from '../components/FilterCabanas'
import ListCabanas from '../components/ListCabanas'
import GalleryCabana from '../components/GalleryCabana'
import CotasCabana from '../components/CotasCabana'

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
                    disponivel
                    numero
                    valor
                    dataInicio
                    dataFim
                }
            }
        }
    } 
`

const initialSelected = {
    cabanas: []
}

export default function Empreendimento() {
    const { id } = useParams()

    const { loading, error, data } = useQuery(EMPREENDIMENTO, {
        variables: { id: id }
    })

    const [cabanas, setCabanas] = useState()
    const [active, setActive] = useState()
    const [selected, setSelected] = useState(initialSelected)
    const [toastShow, setToastShow] = useState(false)
    const [toastText, setToastText] = useState('Empreendimento')

    if (data) {
        if (!cabanas)
            setCabanas(data.empreendimento.cabanas)

        let storedSelected = JSON.parse(sessionStorage.getItem('selectedUnidades'))
        
        if(selected === initialSelected && storedSelected) {
            if(storedSelected.empreendimentoId === data.empreendimento.id) {
                setSelected(storedSelected.selected)
            }
        }
    }

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

    const totalPrice = () => {
        let price = 0
        if(selected) {
            selected.cabanas.map(cabana => {
                cabana.cotas.map(cota => {
                    price += cota.valor
                })
            })
        }
        return price
    }

    const countSelected = () => {
        let count = 0
        if(selected) {
            selected.cabanas.map(cabana => {
                count += cabana.cotas.length
            })
        }
        return count
    }

    const setSelectedFilter = selected => {
        if(selected) {
            let selectedJSON = JSON.stringify({
                empreendimentoId: data.empreendimento.id,
                selected: selected
            })
            sessionStorage.setItem('selectedUnidades', selectedJSON)
            setSelected(selected)
        }
        else {
            sessionStorage.removeItem('selectedUnidades')
            setSelected(initialSelected)
        }
    }

    const limparClick = e => {
        if(window.confirm('Deseja realmente limpar a sua seleção de cotas?')) {
            setSelectedFilter(null)
        }        
    }

    if(loading) {
        return (
            <div className='Empreendimento d-flex h-100'>
                <p className='m-auto'>Carregando...</p>
            </div>
        ) 
    }
    if(error) {
        return (
            <div className='Empreendimento d-flex h-100'>
                <p className='m-auto'>Ocorreu um erro ao carregar este empreendimento.</p>
            </div>
        )
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
                        <div className="inner selection">
                            <div className="heading">
                                <div className='back-button' onClick={() => setActive()}>
                                    <span className='bi bi-chevron-left me-1'></span>
                                    Lista de unidades
                                </div>

                                <div className="title mt-3">
                                    <h4 className='d-flex align-items-center'>
                                        <CabanaIcon className='icon' />
                                        <span className='ms-2'>{active.nome}</span>
                                    </h4>
                                </div>
                                <div className="gallery">
                                    <GalleryCabana id={'galleryCabana' + active.id} images={active.galeria} />
                                </div>
                            </div>

                            <div className="cotas">
                                <div className="cotas-title">
                                    <h6>Cotas</h6>
                                </div>
                                <CotasCabana cabana={active} selected={selected} setSelected={setSelectedFilter} />
                            </div>

                        </div>
                    ) : (
                        <div className="inner no-selection">
                            <div className="heading">
                                <div className="d-flex">
                                    <h1>Unidades</h1> 
                                    <Button className='m-auto me-0 limpar' onClick={limparClick}>
                                        limpar seleção
                                    </Button>
                                </div>
                                <FilterCabanas cabanas={data.empreendimento.cabanas} setCabanas={setCabanas} />
                            </div>

                            <ListCabanas selected={selected} cabanas={cabanas} showUnidade={showUnidade} />

                        </div>
                    )}

                    <div className={'overview d-flex justify-content-between' + ((totalPrice() === 0) ? ' disabled' : '')}>
                        <div className="price">
                            {'R$ ' + formatNumber(totalPrice())}
                        </div>
                        <div className="action">
                            <Link className='btn btn-primary' to={'/proposta/' + data.empreendimento.id}>
                                enviar proposta
                            </Link>
                        </div>
                    </div>

                </Col>
                <Col lg={8} className='mapa'>
                    <div className="count-wrap">
                        <div className="count">
                            Cotas selecionadas 
                            <div className={'count-number ms-2 rounded-circle' + ((countSelected() === 0) ? ' zero' : '')}>
                                <span>{countSelected()}</span>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex h-100">
                        <p className='m-auto text-light'>em breve, visualização em mapa</p>
                    </div>
                </Col>
            </Row>
        </div>
    )
}
