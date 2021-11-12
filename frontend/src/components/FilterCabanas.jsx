import React from 'react'
import { Form, Button } from 'react-bootstrap'

import '../scss/FilterCabanas.scss'

export default function FilterCabanas() {
    return (
        <Form className='FilterCabanas'>
            <Form.Control type='text' className='input' placeholder='Pesquisar unidade' />
            <Button type='submit'>
                <span className='bi bi-search'></span>
            </Button>
        </Form>
    )
}
