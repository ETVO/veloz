import React from 'react'
import { div, Col, Button } from 'react-bootstrap'
import moment from 'moment'

export default function RevisaoProposta({ fields, submit }) {
    return (
        <div className='RevisaoProposta'>
            <h3>Resumo da proposta</h3>

            <div className="mb-4">
                <div className="review-section mt-3">
                    <h4>Comprador</h4>

                    <div className="field-view">
                        <small>Nome completo:</small>
                        <p>{fields.infoComprador.nomeCompleto}</p>
                    </div>

                    <div className='field-row'>
                        <div className="field-view">
                            <small>Data de nascimento:</small>
                            <p>{moment(fields.infoComprador.dataNasc).format('DD/MM/yyyy')}</p>
                        </div>
                        <div className="field-view">
                            <small>Nacionalidade:</small>
                            <p>{fields.infoComprador.nacionalidade}</p>
                        </div>
                    </div>

                    <div className="field-view">
                        <small>Profissão:</small>
                        <p>{fields.infoComprador.profissao}</p>
                    </div>

                    <div className="field-view">
                        <small>Estado civil:</small>
                        <p>{fields.estadoCivil}</p>
                    </div>

                    <div className='field-row'>
                        <div className="field-view">
                            <small>CPF:</small>
                            <p>{fields.infoComprador.cpf}</p>
                        </div>
                        <div className="field-view">
                            <small>RG:</small>
                            <p>{fields.infoComprador.rg}</p>
                        </div>
                        <div className="field-view">
                            <small>Órgão exp.:</small>
                            <p>{fields.infoComprador.orgaoExp}</p>
                        </div>
                    </div>

                    <div className="field-view">
                        <small>Endereço:</small>
                        <p>{fields.endereco}</p>
                    </div>

                    <div className='field-row'>
                        <div className="field-view">
                            <small>Bairro:</small>
                            <p>{fields.bairro}</p>
                        </div>
                        <div className="field-view">
                            <small>CEP:</small>
                            <p>{fields.cep}</p>
                        </div>
                    </div>

                    <div className="field-view">
                        <small>Cidade/UF:</small>
                        <p>{fields.cidade}</p>
                    </div>

                    <div className='field-row'>
                        <div className="field-view">
                            <small>Telefone:</small>
                            <p>{fields.telefone}</p>
                        </div>
                        <div className="field-view">
                            <small>Email:</small>
                            <p>{fields.email}</p>
                        </div>
                    </div>
                </div>

                {
                    (fields.estadoCivil === 'Casado') ? (
                        <div className="review-section mt-3">
                            <h4>Cônjuge</h4>

                            <div className="field-view">
                                <small>Nome completo:</small>
                                <p>{fields.infoConjuge.nomeCompleto}</p>
                            </div>

                            <div className='field-row'>
                                <div className="field-view">
                                    <small>Data de nascimento:</small>
                                    <p>{moment(fields.infoConjuge.dataNasc).format('DD/MM/yyyy')}</p>
                                </div>
                                <div className="field-view">
                                    <small>Nacionalidade:</small>
                                    <p>{fields.infoConjuge.nacionalidade}</p>
                                </div>
                            </div>

                            <div className="field-view">
                                <small>Profissão:</small>
                                <p>{fields.infoConjuge.profissao}</p>
                            </div>

                            <div className='field-row'>
                                <div className="field-view">
                                    <small>CPF:</small>
                                    <p>{fields.infoConjuge.cpf}</p>
                                </div>
                                <div className="field-view">
                                    <small>RG:</small>
                                    <p>{fields.infoConjuge.rg}</p>
                                </div>
                                <div className="field-view">
                                    <small>Órgão exp.:</small>
                                    <p>{fields.infoConjuge.orgaoExp}</p>
                                </div>
                            </div>
                        </div>
                    ) : ''}
            </div>


            <Button className='ms-auto d-flex' type="submit" onClick={submit}>
                <span className='my-auto'>finalizar e enviar proposta por email</span>
                <span className='my-auto ms-1 bi bi-chevron-right'></span>
            </Button>
        </div>
    )
}
