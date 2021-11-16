import React, { useState } from 'react'
import { Form, Col, Row, Button } from 'react-bootstrap'
import InputMask from 'react-input-mask';
import moment from 'moment'

export default function DadosComprador({ fields, setFields, submit }) {

    let minDataNasc = moment().subtract(105, 'years')
    let maxDataNasc = moment().subtract(18, 'years')

    const [conjuge, setConjuge] = useState(fields.estadoCivil === 'Casado');
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
        let formValues = JSON.parse(JSON.stringify(fields))
        let { value, id } = e.target

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
        
        // show/hide infoConjuge fields depending on the estadoCivil value
        if(id === 'estadoCivil') setConjuge(value === 'Casado')

        setFields(formValues)
    }

    const requiredErrorText = 'Campo obrigatório.'
    const dataNascErrorText = 'Data inválida.'

    return (
        <div className='DadosComprador'>
            <h3>Preenchimento de dados da proposta</h3>

            <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <div className="form-section mb-4">
                    <div className="section-title">
                        <h5>Comprador</h5>
                    </div>
                    <div className="section-content">
                        <Form.Group className="form-row" controlId="infoComprador.nomeCompleto">
                            <Form.Label>Nome completo:</Form.Label>
                            <Form.Control onChange={handleChange} type="text" defaultValue={fields.infoComprador.nomeCompleto} placeholder="Nome Sobrenome" required />
                            <Form.Control.Feedback type="invalid">
                                {requiredErrorText}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Row className="form-row">
                            <Form.Group as={Col} lg={4} controlId="infoComprador.dataNasc">
                                <Form.Label>Data de nascimento:</Form.Label>
                                <Form.Control onChange={handleChange}
                                    type="date"
                                    defaultValue={fields.infoComprador.dataNasc}
                                    placeholder="DD/MM/AAAA"
                                    min={minDataNasc.format('YYYY-MM-DD')}
                                    max={maxDataNasc.format('YYYY-MM-DD')}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {dataNascErrorText}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} controlId="infoComprador.nacionalidade">
                                <Form.Label>Nacionalidade:</Form.Label>
                                <Form.Control onChange={handleChange} type="text"
                                    defaultValue={fields.infoComprador.nacionalidade}
                                    placeholder="Brasileiro(a)" required />
                                <Form.Control.Feedback type="invalid">
                                    {requiredErrorText}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Form.Group className="form-row" controlId="infoComprador.profissao">
                            <Form.Label>Profissão:</Form.Label>
                            <Form.Control onChange={handleChange} type="text"
                                defaultValue={fields.infoComprador.profissao}
                                placeholder="Profissão" required />
                            <Form.Control.Feedback type="invalid">
                                {requiredErrorText}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="form-row" controlId="estadoCivil">
                            <Form.Label>Estado civil:</Form.Label>
                            <Form.Control onChange={handleChange} as={Form.Select} required defaultValue={fields.estadoCivil}>
                                <option disabled value=''>Escolha uma opção</option>
                                <option value="Solteiro">Solteiro</option>
                                <option value="Casado">Casado</option>
                                <option value="Viúvo">Viúvo</option>
                                <option value="Separado">Separado</option>
                                <option value="Divorciado">Divorciado</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {requiredErrorText}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {(conjuge) ? (
                            <div className="casado-fields">
                                <Form.Group className="form-row" controlId="regimeCasamento">
                                    <Form.Label>Regime de casamento:</Form.Label>
                                    <Form.Control onChange={handleChange} as={Form.Select} required defaultValue={fields.regimeCasamento}>
                                        <option disabled value=''>Escolha uma opção</option>
                                        <option value="Comunhão total de bens">Comunhão total de bens</option>
                                        <option value="Comunhão parcial de bens">Comunhão parcial de bens</option>
                                        <option value="Separação de bens">Separação de bens</option>
                                        <option value="Participação final nos aquestos">Participação final nos aquestos</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {requiredErrorText}
                                    </Form.Control.Feedback>
                                </Form.Group>


                                <div className="form-section">
                                    <div className="section-title">
                                        <h5>Cônjuge</h5>
                                    </div>
                                    <div className="section-content">
                                        <Form.Group className="form-row" controlId="infoConjuge.nomeCompleto">
                                            <Form.Label>Nome completo:</Form.Label>
                                            <Form.Control onChange={handleChange} type="text"
                                                defaultValue={fields.infoConjuge.nomeCompleto}
                                                placeholder="Nome Sobrenome" required />
                                            <Form.Control.Feedback type="invalid">
                                                {requiredErrorText}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Row className="form-row">
                                            <Form.Group as={Col} lg={4} controlId="infoConjuge.dataNasc">
                                                <Form.Label>Data de nascimento:</Form.Label>
                                                <Form.Control onChange={handleChange}
                                                    type="date"
                                                    defaultValue={fields.infoConjuge.dataNasc}
                                                    placeholder="DD/MM/AAAA"
                                                    min={minDataNasc.format('YYYY-MM-DD')}
                                                    max={maxDataNasc.format('YYYY-MM-DD')}
                                                    required
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {requiredErrorText}
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group as={Col} controlId="infoConjuge.nacionalidade">
                                                <Form.Label>Nacionalidade:</Form.Label>
                                                <Form.Control onChange={handleChange} type="text"
                                                    defaultValue={fields.infoConjuge.nacionalidade}
                                                    placeholder="Brasileiro(a)" />
                                                <Form.Control.Feedback type="invalid">
                                                    {requiredErrorText}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Row>

                                        <Form.Group className="form-row" controlId="infoConjuge.profissao">
                                            <Form.Label>Profissão:</Form.Label>
                                            <Form.Control onChange={handleChange} type="text"
                                                defaultValue={fields.infoConjuge.profissao}
                                                placeholder="Profissão" required />
                                            <Form.Control.Feedback type="invalid">
                                                {requiredErrorText}
                                            </Form.Control.Feedback>
                                        </Form.Group>


                                        <Row className="form-row">
                                            <Form.Group as={Col} controlId="infoConjuge.cpf">
                                                <Form.Label>CPF:</Form.Label>
                                                <Form.Control onChange={handleChange}
                                                    as={InputMask}
                                                    defaultValue={fields.infoConjuge.cpf}
                                                    mask="999.999.999-99"
                                                    maskChar="_"
                                                    placeholder='000.000.000-00'
                                                    required
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {requiredErrorText}
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group as={Col} controlId="infoConjuge.rg">
                                                <Form.Label>RG:</Form.Label>
                                                <Form.Control onChange={handleChange} type="text"
                                                    defaultValue={fields.infoConjuge.rg}
                                                    placeholder="0000000" required />
                                                <Form.Control.Feedback type="invalid">
                                                    {requiredErrorText}
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group as={Col} controlId="infoConjuge.orgaoExp">
                                                <Form.Label>Órgão Exp.:</Form.Label>
                                                <Form.Control onChange={handleChange} type="text"
                                                    defaultValue={fields.infoConjuge.orgaoExp}
                                                    placeholder="SSP/SC" required />
                                                <Form.Control.Feedback type="invalid">
                                                    {requiredErrorText}
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                        </Row>
                                    </div>
                                </div>
                            </div>
                        ) : ''}

                        <Row className="form-row">
                            <Form.Group as={Col} controlId="infoComprador.cpf">
                                <Form.Label>CPF:</Form.Label>
                                <Form.Control onChange={handleChange}
                                    as={InputMask}
                                    defaultValue={fields.infoComprador.cpf}
                                    mask="999.999.999-99"
                                    maskChar="_"
                                    placeholder='000.000.000-00'
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {requiredErrorText}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} controlId="infoComprador.rg">
                                <Form.Label>RG:</Form.Label>
                                <Form.Control onChange={handleChange} type="text"
                                    defaultValue={fields.infoComprador.rg}
                                    placeholder="0000000" required />
                                <Form.Control.Feedback type="invalid">
                                    {requiredErrorText}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} controlId="infoComprador.orgaoExp">
                                <Form.Label>Órgão Exp.:</Form.Label>
                                <Form.Control onChange={handleChange} type="text"
                                    defaultValue={fields.infoComprador.orgaoExp}
                                    placeholder="SSP/SC" required />
                                <Form.Control.Feedback type="invalid">
                                    {requiredErrorText}
                                </Form.Control.Feedback>
                            </Form.Group>

                        </Row>

                        <Form.Group className="form-row" controlId="endereco">
                            <Form.Label>Endereço:</Form.Label>
                            <Form.Control onChange={handleChange} type="text"
                                defaultValue={fields.endereco}
                                placeholder="Rua, número, apartamento" required />

                            <Form.Control.Feedback type="invalid">
                                {requiredErrorText}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Row className="form-row">

                            <Form.Group as={Col} controlId="bairro">
                                <Form.Label>Bairro:</Form.Label>
                                <Form.Control onChange={handleChange} type="text"
                                    defaultValue={fields.bairro}
                                    placeholder="Bairro" required />
                                <Form.Control.Feedback type="invalid">
                                    {requiredErrorText}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} lg={3} controlId="cep">
                                <Form.Label>CEP:</Form.Label>
                                <Form.Control onChange={handleChange} type="text"
                                    defaultValue={fields.cep}
                                    placeholder="00000-000" required />
                                <Form.Control.Feedback type="invalid">
                                    {requiredErrorText}
                                </Form.Control.Feedback>
                            </Form.Group>

                        </Row>

                        <Form.Group className="form-row" controlId="cidade">
                            <Form.Label>Cidade:</Form.Label>
                            <Form.Control onChange={handleChange} type="text"
                                defaultValue={fields.cidade}
                                placeholder="Cidade/UF" required />
                            <Form.Control.Feedback type="invalid">
                                {requiredErrorText}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Row className="form-row">

                            <Form.Group as={Col} lg={4} controlId="telefone">
                                <Form.Label>Telefone:</Form.Label>
                                <Form.Control onChange={handleChange} type="text"
                                    defaultValue={fields.telefone}
                                    placeholder="(00) 00000-0000" required />
                                <Form.Control.Feedback type="invalid">
                                    {requiredErrorText}
                                </Form.Control.Feedback>
                            </Form.Group>

                        </Row>

                        <Form.Group className="form-row" controlId="email">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control onChange={handleChange} type="email"
                                    defaultValue={fields.email} 
                                     placeholder="email.exemplo@dominio.com" required />
                            <Form.Control.Feedback type="invalid">
                                {requiredErrorText}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </div>

                </div>
                <Button className='ms-auto d-flex' type="submit">
                    <span className='my-auto'>seguinte</span>
                    <span className='my-auto ms-1 bi bi-chevron-right'></span>
                </Button>
            </Form>
        </div>
    )
}
