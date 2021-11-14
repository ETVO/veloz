import React, {useState} from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import { useParams, Navigate, Link } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import { numberWithDots } from '../helpers/cabanas'

import '../scss/Proposta.scss'

import DadosPagamento from '../components/DadosPagamento'
import DadosComprador from '../components/DadosComprador'
import RevisaoProposta from '../components/RevisaoProposta'

const EMPREENDIMENTO = gql`
    query GetEmpreendimento($id: ID!) {
        empreendimento(id: $id) {
            id
            nome
            cabanas {
                id
                nome
                cotas {
                    id
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

export default function Proposta() {
    const { id } = useParams()

    const { loading, error, data } = useQuery(EMPREENDIMENTO, {
        variables: { id: id }
    })

    const [selected, setSelected] = useState(initialSelected)
    const [cabanas, setCabanas] = useState([])
    const [price, setPrice] = useState(0)
    const [stage, setStage] = useState(0)
    const [backText, setBackText] = useState('Voltar para o mapa');

    const stages = [
        <DadosComprador />,
        <DadosPagamento />,
        <RevisaoProposta />
    ]

    (() => {
        let storedSelected = JSON.parse(sessionStorage.getItem('selectedUnidades'))
        
        if(selected === initialSelected && storedSelected && storedSelected.empreendimentoId === id) {
            setSelected(storedSelected.selected)
        }
    
        if(data && cabanas.length === 0 && selected !== initialSelected) {
            
            let newCabanas = []
            let newPrice = 0
            data.empreendimento.cabanas.map(cabana => {
                let newCotas = []
    
                let cabanaIndex = selected.cabanas.map(c => c.id).indexOf(cabana.id)
    
                const isSelected = cabanaIndex !== -1
                
                if(isSelected) {
                    newCotas = cabana.cotas.filter(cota => {
                        let isCotaSelected = selected.cabanas[cabanaIndex].cotas.map(c => c.id).indexOf(cota.id) !== -1
    
                        if(isCotaSelected)
                            newPrice += cota.valor
                        
                        return isCotaSelected
                    })
    
                    newCabanas.push({
                        id: cabana.id,
                        nome: cabana.nome,
                        cotas: newCotas,
                    })
    
                } 
                
                return isSelected
            })
            
            setPrice(newPrice)
            setCabanas(newCabanas)
    
        }
    })()

    if (loading) return <p>Carregando...</p>
    if (error) return <p>Ocorreu um erro ao carregar a página de Proposta.</p>

    return (
        <div className='Proposta'>

            <Row className='w-100 m-0'>

                <Col lg={8} className='form-col'>

                    <Link className="back-button" to={'/empreendimento/' + id}>
                        <span className='bi bi-chevron-left me-1'></span>
                        Voltar para o mapa
                    </Link>

                    <div className="stages my-2">

                    </div>

                </Col>

                <Col lg={4} className='details-col'>
                    <h4 className='title'>Detalhes da Proposta</h4>
                    {(selected !== initialSelected) ? (
                        <div className="selected-brief">
                            <p className='title'>Unidade:</p>
                            {cabanas.map(cabana => {
                                return (
                                    <div key={cabana.id} className="cabana-brief my-2">
                                        <h5 className='nome-cabana'>{cabana.nome}</h5>
                                        {(cabana.cotas.map(cota => {
                                            return (
                                                <div key={cota.id} className="cota-brief">
                                                    <span className='nome-cota'>{'Cota ' + cota.numero}</span>
                                                    <span className='datas ms-2'>{cota.dataInicio + ' – ' + cota.dataFim}</span>
                                                </div>
                                            )
                                        }))}
                                    </div>
                                )
                            })}
                            <span className='total-price'>{'R$ ' + numberWithDots(price)}</span>
                        </div>
                    ) : (
                        <div className="selected-brief">
                            <p>Nenhuma unidade foi selecionada...</p>
                            <Navigate to={'/empreendimento/' + id} />
                        </div>
                    )}
                </Col>

            </Row>

            
            
        </div>
    )
}
