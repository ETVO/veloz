import React, { useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { numberWithDots } from '../helpers/cabanas'

import '../scss/CotasCabana.scss'

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
}

export default function CotasCabana({cabanaId, cotas, selected, setSelected}) {
    
    if(!cotas) return (<p>Nenhuma cota foi encontrada.</p>)

    const changeSelect = (disponivel, cota) => {
        if(disponivel) {
            let newSelected = JSON.parse(JSON.stringify(selected))

            // get index of cabana element that has id property equal tocabanaId prop value
            var cabanaIndex = newSelected.cabanas.map(el => el.id).indexOf(cabanaId)


            if(cabanaIndex === -1) { // cabana does not exist in cabanas array yet
                newSelected.cabanas.push({
                    id: cabanaId,
                    cotas: [cota]
                })
            } // cabana element already exists -> let's push this 'cota' in the 'cotas' array of this element
            else {
                // console.log(newSelected.cabanas[index].cotas.includes(simpleCota))
                
                var cotaIndex = newSelected.cabanas[cabanaIndex].cotas.map(c => c.id).indexOf(cota.id)

                if(cotaIndex !== -1) {
                    newSelected.cabanas[cabanaIndex].cotas.splice(cotaIndex, 1)
                }
                else {
                    newSelected.cabanas[cabanaIndex].cotas.push(cota)
                }
            }

            setSelected(newSelected)
        }
    }
    
    return (
        <div className='CotasCabana'>
            <Row className='cotas-row'>
                {cotas.map(cota => {

                    let cotaClassName = 'cota-option d-flex justify-content-evenly'

                    // view changeSelect function of this component for explanation comments
                    let newSelected = JSON.parse(JSON.stringify(selected))
                    var cabanaIndex = newSelected.cabanas.map(el => el.id).indexOf(cabanaId)

                    
                    if(!cota.disponivel) {
                        cotaClassName += ' sold-out'
                    }

                    // if index is diff than -1, cabanaId is in the cabana array of the selectedCotas array
                    if(cabanaIndex !== -1) {
                        var cotaIndex = newSelected.cabanas[cabanaIndex].cotas.map(c => c.id).indexOf(cota.id)
                        
                        // cota is selected
                        if(cotaIndex !== -1) {

                            // cota is unavailable -> remove it from selectedCotas array
                            if(!cota.disponivel) {
                                newSelected.cabanas[cabanaIndex].cotas.splice(cotaIndex, 1)
                            }
                            // cota is available -> add selected className
                            else {
                                cotaClassName += ' selected'
                            }
                        }
                    }
                
                    return (
                        <Col sm={3} key={cota.id} className="cota-option-wrap" onClick={() => changeSelect(cota.disponivel, cota)}>
                            <div className={cotaClassName} title={'R$ ' + numberWithDots(cota.valor)}>
                                <div className="sold-out-text">
                                    <span>VENDIDA</span>
                                </div>
                                <div className="numero">
                                    <div>{ cota.numero }</div>
                                    <div className="icon"><span className='bi bi-check-lg'></span></div>
                                </div>
                                <div className="datas">
                                    <div>{ cota.dataInicio }</div>
                                    <div>{ cota.dataFim }</div>
                                </div>
                            </div>
                        </Col>
                    )
                })}
            </Row>
        </div>
    )
}
