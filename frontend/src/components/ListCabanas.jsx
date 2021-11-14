import React from 'react'

import { cycleCotas, numberWithDots } from '../helpers/cabanas'

import '../scss/ListCabanas.scss'

export default function ListCabanas({cabanas, showUnidade}) {
    return (
        <div className="ListCabanas">
            {(cabanas) ? cabanas.map(uni => {

                let disponivel = cycleCotas(uni)

                return (

                    <div key={uni.id} className={'unidade-card' + ((uni.reservada || !disponivel) ? ' muted' : '')} onClick={() => showUnidade(uni)}>
                        <div className="foto">
                            <img src={'http://localhost:1337' + uni.foto.formats.thumbnail.url} />
                        </div>
                        <div className="info">
                            <div className='nome'>
                                {uni.nome}
                            </div>
                            <div className="caracter">
                                {uni.tamanho}&nbsp;&nbsp;{uni.quartos}
                            </div>
                            <div className="valor-base">
                                {'R$ ' + numberWithDots(uni.valorBase)}
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
