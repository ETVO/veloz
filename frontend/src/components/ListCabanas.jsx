import React from 'react'

import { cycleCotas, formatNumber } from '../helpers/cabanas'

import '../scss/ListCabanas.scss'

export default function ListCabanas({selected, cabanas, showUnidade}) {
    return (
        <div className="ListCabanas">
            {(cabanas) ? cabanas.map(uni => {

                let disponivel = cycleCotas(uni)
                let selecionada = selected.cabanas.map(el => { if(el.cotas.length > 0) return el.id; else return -1; }).indexOf(uni.id) !== -1

                return (

                    <div key={uni.id} className={'unidade-card' + ((uni.reservada || !disponivel) ? ' muted' : '')} onClick={() => showUnidade(uni)}>
                        <div className={'foto' + ((selecionada) ? ' selected' : '')}>
                            <img src={'http://localhost:1337' + uni.foto.formats.thumbnail.url} />
                            <div className="icon">
                                <span className='bi bi-check-lg'></span>
                            </div>
                        </div>
                        <div className="info">
                            <div className='nome'>
                                {uni.nome}
                            </div>
                            <div className="caracter">
                                {uni.tamanho}&nbsp;&nbsp;{uni.quartos}
                            </div>
                            <div className="valor-base">
                                {'R$ ' + formatNumber(uni.valorBase)}
                            </div>
                        </div>
                        <div className="tag">
                            {
                                (uni.reservada) ? (
                                    <span className='reservada'>RESERVADA</span>
                                ) : (
                                    (cycleCotas(uni)) ? (
                                        <span className='disponivel'>DISPONÍVEL</span>
                                    )
                                        : (
                                            <span className='vendida'>VENDIDA</span>
                                        )
                                )
                            }
                        </div>
                    </div>
                )
            }) : (
                <p>Carregando...</p>
            )}
        </div>
    )
}
