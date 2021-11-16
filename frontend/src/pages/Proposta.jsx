import React, {useState} from 'react'
import { Row, Col, Container, Button } from 'react-bootstrap'
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import { formatNumber } from '../helpers/cabanas'
import { enviarProposta } from '../helpers/enviarProposta'

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

const initialUnidades = {
    cabanas: []
}

const initialPaymentFields = {
    valorProposta: 0,
    entrada: 0,
    nParcelas: 1,
    valorParcela: 0,    
    valorFinal: 0,
    meioPagamento: 'transferencia_pix'
}

const initialFields = {
    infoComprador: {
        nomeCompleto: '',
        dataNasc: '',
        nacionalidade: '',
        profissao: '',
        cpf: '',
        rg: '',
        orgaoExp: '',
    },
    estadoCivil: '',
    regimeCasamento: '',
    infoConjuge: {
        nomeCompleto: '',
        dataNasc: '',
        nacionalidade: '',
        profissao: '',
        cpf: '',
        rg: '',
        orgaoExp: '',
    },
    endereco: '',
    bairro: '',
    cep: '',
    cidade: '',
    telefone: '',
    email: '',
    pagamento: initialPaymentFields,
    vendedor: 0,
    empreendimento: 0,
    unidades: []
}

export default function Proposta({user}) {
    const { id } = useParams()

    const navigate = useNavigate()

    const { loading, error, data } = useQuery(EMPREENDIMENTO, {
        variables: { id: id }
    })

    const [selected, setSelected] = useState(initialSelected)
    const [activeStage, setStage] = useState(0)
    const [fields, setFields] = useState(initialFields);

    (() => {
        let storedSelected = JSON.parse(sessionStorage.getItem('selectedUnidades'))
        let storedFields = JSON.parse(sessionStorage.getItem('formFields'))
        let storedStage = JSON.parse(sessionStorage.getItem('formStage'))

        if(activeStage === 0 && storedStage && storedStage.empreendimentoId === id) {
            setStage(storedStage.activeStage)
        }

        if(fields === initialFields && storedFields && storedFields.empreendimentoId === id) {
            if(storedFields.fields.vendedor === 0) {
                storedFields.fields.vendedor = user.id
            }
            if(storedFields.fields.empreendimento === 0) {
                storedFields.fields.empreendimento = id
            }
            setFields(storedFields.fields)
        }
        else {
            if(fields.vendedor === 0) {
                let newFields = JSON.parse(JSON.stringify(fields))
                newFields.vendedor = user.id

                setFields(newFields)
            }
            if(fields.empreendimento === 0) {
                let newFields = JSON.parse(JSON.stringify(fields))
                newFields.empreendimento = parseInt(id)

                setFields(newFields)
            }
        }
        
        if(selected === initialSelected && storedSelected && storedSelected.empreendimentoId === id) {
            setSelected(storedSelected.selected)
        }
    
        if(data && fields.unidades.length === 0 && selected !== initialSelected) {
            
            let newCabanas = []
            let valorProposta = 0.00
            data.empreendimento.cabanas.map(cabana => {
                let newCotas = []
    
                let cabanaIndex = selected.cabanas.map(c => c.id).indexOf(cabana.id)
    
                const isSelected = cabanaIndex !== -1
                
                if(isSelected) {
                    cabana.cotas.filter(cota => {
                        let isCotaSelected = selected.cabanas[cabanaIndex].cotas.map(c => c.id).indexOf(cota.id) !== -1
    
                        if(isCotaSelected) {
                            const {__typename, ...other} = cota
                        
                            newCotas.push({
                                ...other
                            })
                            
                            valorProposta += parseFloat(cota.valor)
                        }
                        
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
            
            let newFields = JSON.parse(JSON.stringify(fields))
            newFields.pagamento.valorProposta = valorProposta
            newFields.unidades = newCabanas
            console.log(newFields)
            setFields(newFields)
    
        }
    })()

    const setStageFilter = (newStage) => {
        if(newStage) {
            let stageJSON = JSON.stringify({
                empreendimentoId: id,
                activeStage: newStage
            })

            sessionStorage.setItem('formStage', stageJSON)
            setStage(newStage)
        }
        else {
            sessionStorage.removeItem('formStage')
            setStage(0)
        }
    }

    const setFieldsFilter = (newFields) => {
        if(newFields) {
            let fieldsJSON = JSON.stringify({
                empreendimentoId: id,
                fields: newFields
            })

            sessionStorage.setItem('formFields', fieldsJSON)
            setFields(newFields)
        }
        else {
            sessionStorage.removeItem('formFields')
            setFields(initialFields)
        }
    }

    const setPaymentFields = (paymentFields) => {
        if(paymentFields) {
            let newFields = JSON.parse(JSON.stringify(fields))
            newFields.pagamento = paymentFields;

            let fieldsJSON = JSON.stringify({
                empreendimentoId: id,
                fields: newFields
            })

            sessionStorage.setItem('formFields', fieldsJSON)
            setFields(newFields)
        }
        else {
            let newFields = JSON.parse(JSON.stringify(fields))
            newFields.pagamento = initialPaymentFields

            let fieldsJSON = JSON.stringify({
                empreendimentoId: id,
                fields: newFields
            })

            sessionStorage.setItem('formFields', fieldsJSON)
            setFields(newFields)
        }
    }

    const submitNext = () => {
        if(activeStage === 2){
            enviarProposta(fields)
        }
        else {
            setStageFilter(activeStage + 1)
        }
    }

    const stages = [
        <DadosComprador fields={fields} setFields={setFieldsFilter} submit={submitNext} />,
        <DadosPagamento paymentFields={fields.pagamento} setPaymentFields={setPaymentFields} submit={submitNext} />,
        <RevisaoProposta fields={fields} submit={submitNext} />
    ]
    
    const prevText = [
        'Voltar para o mapa',
        'Voltar',
        'Voltar',
    ]

    const nextText = [
        'seguinte',
        'finalizar proposta',
        'finalizar e enviar proposta por email',
    ]

    const backClick = () => {
        if(activeStage === 0) {
            navigate('/empreendimento/' + id)
        }
        else {
            setStageFilter(activeStage - 1)
        }
    }

    if(loading) {
        return (
            <div className='Proposta d-flex h-100'>
                <p className='m-auto'>Carregando...</p>
            </div>
        ) 
    }
    if(error) {
        return (
            <div className='Proposta d-flex h-100'>
                <p className='m-auto'>Ocorreu um erro ao carregar a página de proposta.</p>
            </div>
        )
    }

    return (
        <div className='Proposta'>


            <Row className='w-100 m-0'>

                <Col lg={8} className='form-col'>

                    <div className="form-inner">
                        <div className="back-button" onClick={backClick}>
                            <span className='bi bi-chevron-left me-1'></span>
                            {prevText[activeStage]}
                        </div>

                        <div className="progress-bars my-3 d-flex justify-content-between">
                            {stages.map((stage, i) => {
                                let className = 'stage-bar'

                                if(activeStage === i)
                                    className += ' active'
                                else if (activeStage > i)
                                    className += ' previous'

                                return (
                                    <div key={'bar' + i} className={className}></div>
                                )
                            })}
                        </div>

                        <div className="stages mt-2 mb-4">
                            {stages.map((stage, i) => {
                                if(i === activeStage) {
                                    return (
                                        <div key={'stage' + i} className="stage-view">
                                            {stage}
                                        </div> 
                                    )
                                }
                            })}
                        </div>
                    </div>

                </Col>

                <Col lg={4} className={'details-col' + ((activeStage === 2) ? ' d-none' : '')}>
                    <h4 className='title'>Detalhes da Proposta</h4>
                    {(selected !== initialSelected) ? (
                        <div className="brief">
                            <p className='title'>Unidade:</p>
                            {fields.unidades.map(cabana => {
                                return (
                                    <div key={cabana.id} className="brief-section my-2">
                                        <h5 className='brief-title'>{cabana.nome}</h5>
                                        {(cabana.cotas.map(cota => {
                                            return (
                                                <div key={cota.id} className="brief-section">
                                                    <span className='nome-cota'>{'Cota ' + cota.numero}</span>
                                                    <span className='datas ms-2'>{cota.dataInicio + ' – ' + cota.dataFim}</span>
                                                </div>
                                            )
                                        }))}
                                    </div>
                                )
                            })}
                            <span className='total-price'>{'R$ ' + formatNumber(fields.pagamento.valorProposta)}</span>
                        </div>
                    ) : (
                        <div className="brief">
                            <p>Nenhuma unidade foi selecionada...</p>
                            <Navigate to={'/empreendimento/' + id} />
                        </div>
                    )}
                    {(activeStage >= 1) ? (
                        <div className="brief mt-3">
                            <p className='title muted'>Comprador:</p>
                            
                            <div className="brief-section mb-2">
                                <h5 className='brief-title'>{fields.infoComprador.nomeCompleto}</h5>
                                <span className=''>{fields.email}</span>
                            </div>
                        </div>
                    ) : (
                        <p onLoad={() => setStageFilter(1)}></p>
                    )}
                    {(activeStage >= 1 && fields.estadoCivil === 'Casado') ? (
                        <div className="brief mt-3">
                            <p className='title muted'>Cônjuge:</p>
                            
                            <div className="brief-section mb-2">
                                <h5 className='brief-title'>{fields.infoConjuge.nomeCompleto}</h5>
                            </div>
                        </div>
                    ) : ''}
                </Col>

            </Row>

            
            
        </div>
    )
}
