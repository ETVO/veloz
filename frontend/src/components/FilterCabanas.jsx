import React from 'react'
import { Form, Button } from 'react-bootstrap'

import '../scss/FilterCabanas.scss'

export default function FilterCabanas({cabanas, setCabanas}) {

    const changeFilter = e => {
        const filter = e.target.value.toLowerCase().trim()
        if(filter === '') {
            setCabanas()
            return
        }

        console.log(filter)
        
        var filteredCabanas = cabanas.filter(function (cabana) { 
            return cabana.nome.toLowerCase().indexOf(filter) != -1; 
        });
        
        setCabanas(filteredCabanas)
    }

    return (
        <Form className='FilterCabanas'>
            <Form.Control type='text' className='input' placeholder='Pesquisar unidade' onChange={changeFilter}/>
            <Button type='submit'>
                <span className='bi bi-search'></span>
            </Button>
        </Form>
    )
}
