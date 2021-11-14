import React, {useState} from 'react'
import { Carousel } from 'react-bootstrap'

import '../scss/GalleryCabana.scss'

export default function GalleryCabana({ id, images }) {
    if (!id)
        id = 'galleryCabana' + Math.random()

    const [index, setIndex] = useState(0);

    const changeSelect = i => {
        setIndex(i);
    };

    return (

        <div className='GalleryCabana'>
            <Carousel activeIndex={index} indicators={false} onSelect={(i, e) => changeSelect(i)}>
                {images.map(image => (
                    <Carousel.Item key={image.id}>
                        <img
                            className="d-block w-100"
                            src={'http://localhost:1337' + image.url}
                            alt={image.caption}
                        />
                    </Carousel.Item>
                ))}
            </Carousel>
            <div className="selectors d-flex justify-content-between">
                {images.map((image, i) => {
                    if(i === 3) {
                        return (
                            <div className='selector view-more' key={'selMore'}>
                                <span className='bi bi-three-dots'></span>
                            </div>
                        )
                    } 
                    else if(i > 3) 
                        return;
                    
                    return (
                        <div className='selector' key={'sel' + image.id} onClick={() => changeSelect(i)}>
                            <img
                                className="d-block w-100"
                                src={'http://localhost:1337' + image.url}
                                alt={image.caption}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
