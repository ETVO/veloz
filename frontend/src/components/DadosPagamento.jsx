import React, { useState } from 'react'
import { Form, Col, Row, Button } from 'react-bootstrap'
import { formatNumber } from '../helpers/cabanas';
import { calcParcela } from '../helpers/enviarProposta';


export default function DadosPagamento({ paymentFields, setPaymentFields, submit }) {

    const [validated, setValidated] = useState(false);

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
            if(id === 'entrada') {
                if(value === '')
                    value = 0
                else 
                    value = parseFloat(value)
            }
            if(id === 'nParcelas') {
                if(value === '')
                    value = 0
                else 
                    value = parseInt(value)
            }
            
            formValues[id] = value;
        }

        setPaymentFields(formValues)
    }

    const getValorParcela = () => {

        let P = parseFloat(paymentFields.valorProposta)
        const n = parseInt(paymentFields.nParcelas)
        const e = parseFloat(paymentFields.entrada)
        
        return calcParcela(P, n, e)
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
                        <Form.Group className="form-row" controlId="valorProposta">
                            <Form.Label>Valor final da proposta:</Form.Label>
                            <Form.Control
                                type="text"
                                value={'R$ ' + formatNumber(paymentFields.valorProposta, true)}
                                disabled
                            />
                            <Form.Control.Feedback type="invalid">
                                {requiredErrorText}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="form-row" controlId="meioPagamento">
                            <Form.Label>Meio de pagamento:</Form.Label>
                            <Form.Control
                                type="text"
                                value={'Transferência / PIX'}
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
                            <Form.Label>Valor da parcela:</Form.Label>
                            <Form.Control
                                type="text"
                                value={ 'R$ ' + formatNumber(getValorParcela(), true) }
                                disabled
                            />
                            <Form.Control.Feedback type="invalid">
                                {requiredErrorText}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </div>
                </div>
                <Button className='ms-auto d-flex' type="submit">
                    <span className='my-auto'>finalizar proposta</span>
                    <span className='my-auto ms-1 bi bi-chevron-right'></span>
                </Button>
            </Form>
        </div>
    )
}
