import React, { useState } from 'react'
import { Form, Col, Row, Button } from 'react-bootstrap'
import { numberWithDots } from '../helpers/cabanas';

export default function DadosPagamento({ submit }) {

    const [validated, setValidated] = useState(false);
    const [paymentFields, setPaymentFields] = useState({
        valorFinal: 105000,
        entrada: null,
        nParcelas: null,
        valorParcela: 0
    });

    const handleSubmit = e => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
            setValidated(true)
        }
        else {
            submit()
        }
    }

    const handleChange = e => {
        e.preventDefault()
        let { value, id } = e.target

        changeField(value, id)    
    }

    const changeField = (value, id) => {
        let formValues = JSON.parse(JSON.stringify(paymentFields))

        // If there are dots in the input id, use it to 
        // assign the value to a property one-level deeper
        if (id.indexOf('.') !== -1) {
            let ids = id.split('.')
            let id1 = ids[0]
            let id2 = ids[1]
            formValues[id1][id2] = value;
        }
        // Else, just assign it normally
        else {
            formValues[id] = value;
        }

        setPaymentFields(formValues)
    }

    const calcParcela = () => {
        // =IF(C7=0;C3; PMT(C4;C7;(-C3+C6);;0))

        let P = parseFloat(paymentFields.valorFinal)
        const r = .9; // taxa de juros a.m. 
        const n = parseInt(paymentFields.nParcelas)
        const PV = - P + parseFloat(paymentFields.entrada)
        
        if(n > 0) {
            P = (r * (PV)) / (1 - (1 + r)^(-n))
        }

        return P
    }

    const requiredErrorText = 'Campo obrigatório.'

    return (
        <div className='DadosPagamento'>
            <h3>Informações</h3>

            <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <div className="form-section mb-4">
                    <div className="section-title">
                        <h5>Pagamento</h5>
                    </div>
                    <div className="section-content">
                        <Form.Group className="form-row" controlId="valorFinal">
                            <Form.Label>Valor final da proposta:</Form.Label>
                            <Form.Control
                                type="text"
                                value={'R$ ' + numberWithDots(paymentFields.valorFinal)}
                                disabled
                            />
                            <Form.Control.Feedback type="invalid">
                                {requiredErrorText}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="form-row" controlId="entrada">
                            <Form.Label>Valor da entrada (R$):</Form.Label>
                            <Form.Control
                                onChange={handleChange}
                                type="number"
                                min={0}
                                defaultValue={paymentFields.entrada}
                                required 
                            />
                            <Form.Control.Feedback type="invalid">
                                {requiredErrorText}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="form-row" controlId="nParcelas">
                            <Form.Label>Número de parcelas mensais:</Form.Label>
                            <Form.Control
                                onChange={handleChange}
                                type="number"
                                min={1}
                                defaultValue={paymentFields.nParcelas}
                                required 
                            />
                            <Form.Control.Feedback type="invalid">
                                {requiredErrorText}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="form-row" controlId="valorParcelas">
                            <Form.Label>Valor da parcela (R$):</Form.Label>
                            <Form.Control
                                type="number"
                                min={0}
                                value={ 'R$ ' + numberWithDots(calcParcela().toStrin ) }
                                disabled
                            />
                            <Form.Control.Feedback type="invalid">
                                {requiredErrorText}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </div>
                </div>
            </Form>
        </div>
    )
}
