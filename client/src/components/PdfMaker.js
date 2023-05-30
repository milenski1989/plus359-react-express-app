
import React, { useContext, useEffect, useState } from 'react'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import SecondaryNavbar from './SecondaryNavbar';
import { ImageContext } from './App';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import IconEdit from './icons as components/IconEdit';
import IconSave from './icons as components/IconSave';
import axios from 'axios';
import Icon277Exit from './icons as components/IconExit';

const PdfMaker = () => {

    const history = useHistory()
    const location = useLocation()
    let { from } = location.state || { from: { pathname: '/artworks' } }

    const {
        currentImages,
        setCurrentImages
    } = useContext(ImageContext);

    const myStorage = window.localStorage;
    const [urls, setUrls] = useState('')
    const [inputsData, setInputsData] = useState({
        paragraph: "",
        notes: ""
    });
    const [bio, setBio] = useState('')
    const [isEditMode, setIsEditMode] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        JSON.parse(myStorage.getItem('image'))
    },[])

    useEffect(() => {
        getBase64()
    },[])

    const getBioOfArtist = async (name) => {
        const res = await fetch(`http://localhost:5000/api/bio/${name}`)
        const data = await res.json()
        return data
    };

    const handleChangeBio = (e) => {
        let updatedValue = {};
        updatedValue = {['bio']: e.target.value};
        setBio(prev => ({
            ...prev,
            ...updatedValue
        }));
    }

    const updateBio = async (bio, id) => {
        const response = await axios.put(
            `http://localhost:5000/api/bio/${id}`,
            bio
        );

        if (response.status === 200) {
            setIsEditMode(false);
    
            await getBioOfArtist(currentImages[0].artist)
        } else {
            setIsEditMode(false);
        }
    };

    const getUrlAsBlob = async () => {
        setLoading(true)
        const promises = []
        const files = []

        for (let image of currentImages) {
            promises.push(await fetch(image.download_url))
        }

        try {
            const allPromises = Promise.all(promises);
            const responses = await allPromises;
            for (let response of responses) {
                files.push(await response.blob())
            }
            setLoading(false)

        } catch (error) {
            setLoading(false)
            console.log(error);
            setCurrentImages([])
        }
        
        return files
    }

    const getBase64 = async () => {
        const promises = []
        const urls = []
        let responses
        const files = await getUrlAsBlob()

        for (let file of files) {
            promises.push(await new Promise(resolve => {
                let baseURL = "";
                let reader = new FileReader();
        
                reader.readAsDataURL(file);
        
                reader.onload = () => {
                    baseURL = reader.result;
                    const newUrl = baseURL.replace('application/octet-stream', 'image/jpeg')
                    urls.push(newUrl)
                    resolve(newUrl);
                };
            }))
        }

        try {
            const allPromises = Promise.all(promises);
            responses = await allPromises;
            setUrls(responses)

            if (currentImages.length) {
                const data = await getBioOfArtist(currentImages[0].artist)
                setBio(data)
            }
           
        } catch (error) {
            console.log(error)
            setCurrentImages([])

        }
    };

    console.log(bio)

    const createCertificate = async () => {

        const docDefinition = {
            pageOrientation: 'landscape',
            content: [
                'СЕРТИФИКАТ ЗА АВТЕНТИЧНОСТ\n\n',
                {
                    columns: [
                       
                        {
                            alignment: 'justify',
                            columns: [
                                
                                {
                                    stack:[
                                        {
                                            text: `АВТОР: ${currentImages[0].artist}\n\nТВОРБА: ${currentImages[0].title}\n\nТЕХНИКА: ${currentImages[0].technique}\n\nРАЗМЕР: ${currentImages[0].dimensions}\n\n`,
                                            fontSize: 10
                                        },
                                        {
                                            image: urls[0],
                                            width: 200,
                                            height: 300
                                        },
                                        '\n\n',
                                        {
                                            text: 'Заключение: Произведението е оригинал',
                                            fontSize: 8
                                        },
                                        '\n\n',
                                        {
                                            text: 'Малка Художествена Галерия',
                                            fontSize: 8,
                                            color: '#6ec1e4'
                                        }
                                    ]
                                },
                                
                                {
                                    stack: [
                                        {
                                            fontSize: 12,
                                            text: !inputsData.paragraph ? `${bio.bio}` : `${bio.bio}\n\n ${inputsData.paragraph} `
                                        }
                                    ]
                                       
                                }
                            ]
                        }
                    ],
                },
            ],
            footer: {
                columns: [
                    {   fontSize: 8,
                        alignment: 'center',
                        text: '"МХГ" ЕООД е вписана в регистъра по чл.116, ал.1 от Закона за културното наследство и може да осъществява търговска дейност с движими културни ценности по смисъла на същия закон.'
                    }
                ]
            },
        }
            
        const pdfGenerator = pdfMake.createPdf(docDefinition)
        pdfGenerator.download()
        
    }

    return <>
        <SecondaryNavbar/>
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            </div>

            <div className="mt-10 w-2/5 sm:mx-auto max-sm:w-4/5 max-sm:mr-auto max-sm:ml-auto">
                <div>
                    <div className="flex items-center justify-between">
                    </div>
                </div>
                <div>
                    <div className='flex justify-between mb-4'>
                        <IconEdit
                            onClick={() => {
                                setIsEditMode(true)
                            } } />
                        {isEditMode && 
                        <>
                            <IconSave onClick={() => updateBio(bio, bio.id)} />
                            <Icon277Exit onClick={() => setIsEditMode(false)} />
                        </>}
                    </div>
                    
                    {isEditMode ?
                        <>
                            <div className="mt-1">
                                <textarea size="50" value={bio.bio}
                                    onChange={handleChangeBio} 
                                    id="textField" 
                                    type="text" 
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </> :
                        <div style={{marginBottom: "1rem"}}>{bio.bio}</div>
                    }
                </div>
                {Object.entries(inputsData).map(([key, value]) => {
                    return (
                        <div key={key}>
                            <div className="flex items-center justify-between">
                                <label htmlFor="textField" className="block text-sm font-medium leading-6 text-gray-900">{key === 'artist' || key === 'technique' ? `*${key}` : key}</label>
                            </div>
                            <div className="mt-1">
                                <textarea size="50" value={value} 
                                    onChange={(event) =>
                                        setInputsData((prevState) => ({
                                            ...prevState,
                                            [key]: event.target.value,
                                        }))} id="textField" name={key} type="text" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>
                    )
                })}

            </div>
        </div>
      
        <div className="flex items-center justify-center">
            {currentImages.length && urls.length && !loading ?
                <div className="flex max-sm:flex-col mb-8 max-sm:mb-8 items-center justify-center mt-32">
                    <button
                        className='flex bg-main text-white rounded mr-4 max-sm:mr-0 max-sm:mb-3 max-sm:w-4/5 justify-center px-2 py-2 text-sm leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                        onClick={createCertificate}>Create and download PDF
                    </button>
                    <button
                        className='flex bg-main text-white rounded mr-4 max-sm:mr-0 max-sm:mb-3 max-sm:w-4/5 justify-center px-2 py-2 text-sm leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                        onClick={() => {setCurrentImages([]); history.replace(from)}}>Cancel
                    </button>
                </div> :
                <div>Please wait...</div>
            }
        </div>
    </>    
}

export default PdfMaker