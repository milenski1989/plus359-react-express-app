import { useContext, useRef } from 'react';
import generatePDF, { Margin } from 'react-to-pdf';
import { ImageContext } from './contexts/ImageContext';
import Masonry from '@mui/lab/Masonry';

const PdfMaker = () => {
    const targetRef = useRef();
    const {currentImages} = useContext(ImageContext)

    const options = {
        page: {
            // margin is in MM, default is Margin.NONE = 0
            margin: Margin.SMALL,
            // default is 'A4'
            format: 'letter',
            // default is 'portrait'
            orientation: 'landscape',
        },
        canvas: {
            // default is 'image/jpeg' for better size performance
            mimeType: 'image/png',
            qualityRatio: 1
        },
    };
     
    return (
        <div>
            <button onClick={() => generatePDF(targetRef, options)}>Download PDF</button>
            <Masonry ref={targetRef} columns={3} spacing={2} sequential>
                {currentImages.length ? currentImages.map(image => (
                    <img 
                        style={{width: '200px', height: 'auto'}} 
                        key={image.id} 
                        src={image.download_url} />
                ))
                    :
                    <></>
                }
            </Masonry>
        </div>
    )
}

export default PdfMaker