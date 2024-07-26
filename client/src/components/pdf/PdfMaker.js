import { useContext, useRef, useState } from 'react';
import generatePDF, { Margin } from 'react-to-pdf';
import { ImageContext } from '../contexts/ImageContext';
import Logo from '../assets/logo359 gallery-black.png'
import { Button, Checkbox, TextField } from '@mui/material';
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const PdfMaker = () => {
    const targetRef = useRef();
    const {currentImages} = useContext(ImageContext)
    const [bio, setBio] = useState()
    const [info, setInfo] = useState()
    const [signed, setSigned] = useState(false)

    const handleChangeBio = (e) => {
        setBio(e.target.value)
    }

    const handleChangeInfo = (e) => {
        setInfo(e.target.value)
    }

    const options = {
        page: {
            // margin is in MM, default is Margin.NONE = 0
            margin: Margin.SMALL,
            // default is 'A4'
           
            // default is 'portrait'
            orientation: 'landscape',
            height: '11.7in', // A4 height
            width: '8.3in', // A4 width
        },
        canvas: {
            // default is 'image/jpeg' for better size performance
            mimeType: 'image/png',
            qualityRatio: 1
        },
        overrides: {
            pdf: {
                compress: true
            },
        }
    };
     
    return (

        <>
            <div style={{margin: '2rem auto', width: '50%'}}>
                <TextField
                    multiline
                    style={{ width: '50vw', minHeight: '100px', marginBottom: '1rem' }}
                    placeholder="Биография..."
                    onChange={(e) => handleChangeBio(e)}
                    value={bio}
                />
                <div style={{display: 'flex'}}>
                    <TextField sx={{width: '20vw'}} multiline placeholder='История на картината...' onChange={(e) => handleChangeInfo(e)}>{info}</TextField>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Checkbox
                            onChange={() => setSigned(prev => !prev)}
                            checked={signed}
                            sx={{
                                marginLeft: '1rem',
                                color: "black",
                                "&.Mui-checked": {
                                    color: "black",
                                },
                            }}
                            icon={<RadioButtonUncheckedIcon />}
                            checkedIcon={<CheckCircleOutlineIcon />}
                        />
                        <span>Подписана</span>
                        <Button style={{ marginLeft: '3rem', marginRight: '3rem' }} onClick={() => generatePDF(targetRef, options)}>Download PDF</Button>
                    </div>
                </div>
            </div>
           
            <div ref={targetRef} style={{marginBottom: '2rem', marginTop: '2rem'}}>
                <div style={{ display: 'flex', marginRight: '3rem'}}>
                    <img src={Logo} style={{ width: '80px', height: '55px', marginTop: '1rem', marginLeft: '3rem' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '3rem', marginRight: '3rem', marginBottom: '2rem' }}>
                        <h2 style={{ marginBottom: '1rem', fontSize: '22px' }}>СЕРТИФИКАТ ЗА АВТЕНТИЧНОСТ</h2>
                        <h3><span style={{fontWeight: 'bold'}}>Автор: </span><span>{currentImages[0].artist}</span></h3>
                        <h3><span style={{fontWeight: 'bold'}}>Творба: </span><span>{currentImages[0].title}</span></h3>
                        <h3><span style={{fontWeight: 'bold'}}>Техника: </span><span>{currentImages[0].technique}</span></h3>
                        <h3><span style={{fontWeight: 'bold'}}>Размер: </span><span>{currentImages[0].dimensions}</span></h3>
                        {signed ? 
                            <h3 style={{fontWeight: 'bold'}}>Подписана</h3> :
                            <></>
                        }
                        <h3 style={{width: '20vw', }}> <span style={{fontWeight: 'bold'}}>История на картината: </span><span style={{whiteSpace: 'pre-line'}}>{info}</span></h3>
                    </div>
                </div>
                <div style={{ minHeight: '500px', position: 'relative', marginLeft: '4rem', marginRight: '3rem'}}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {currentImages.length ? currentImages.map(image => (
                            <img
                                style={{ width: '350px', height: 'auto', marginLeft: '7rem' }}
                                key={image.id}
                                src={image.image_url} />
                        ))
                            :
                            <></>}
                        <p style={{ width: '50vw', whiteSpace: 'pre-line' }}>
                            {bio}
                        </p>
                    </div>
                    <h4 style={{position: 'absolute', right: '20px', bottom: '10px'}}>Малка Художествена Галерия</h4>
                </div>
            </div></>

    )
}

export default PdfMaker