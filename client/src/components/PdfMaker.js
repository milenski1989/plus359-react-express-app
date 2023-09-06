

import React, { useContext, useEffect, useState } from 'react'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import Navbar from './Navbar';
import { ImageContext } from './contexts/ImageContext';
import IconEdit from './icons as components/IconEdit';
import IconSave from './icons as components/IconSave';
import axios from 'axios';
import Icon277Exit from './icons as components/IconExit';
import { useNavigate } from 'react-router-dom';

const PdfMaker = () => {

    const {
        currentImages,
        setCurrentImages
    } = useContext(ImageContext);

    let navigate = useNavigate();

    const myStorage = window.localStorage;
    const [urls, setUrls] = useState('')
    const [inputsData, setInputsData] = useState({
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
        const res = await fetch(`http://localhost:5000/bios/bio/${name}`)
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
            `http://localhost:5000/bios/bio/${id}`,
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
            promises.push(await fetch(image.image_url))
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

    const createCertificate = async () => {

        try {
            const response = await fetch('http://localhost:5000/pdf/create-certificate', {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body:  JSON.stringify({ imageSrc: urls[0],
                    bio: `${bio.bio} \n\n ${inputsData.notes}`,
                    artist: currentImages[0].artist,
                    title: currentImages[0].title,
                    technique: currentImages[0].technique,
                    dimensions: currentImages[0].dimensions
                })
            });

            console.log(response)
      
            // Convert the response body to a ReadableStream
            const reader = response.body.getReader();
            
            // Create a new ReadableStream with the response body
            const stream = new ReadableStream({
                start(controller) {
                    async function push() {
                        // Read the data from the response body
                        const { done, value } = await reader.read();
                  
                        if (done) {
                            // Close the stream
                            controller.close();
                            return;
                        }
                  
                        // Push the data to the stream
                        controller.enqueue(value);
                        await push();
                    }
                
                    push();
                }
            });
            
            // Create a new response object with the new stream
            const newResponse = new Response(stream, response);
            
            // Create a blob from the response
            const blob = await newResponse.blob();
            
            // Create a URL for the blob
            const url = URL.createObjectURL(blob);
            
            // Create a link element and click it to download the file
            const link = document.createElement('a');
            link.href = url;
            link.download = 'file.pdf';
            link.click();
            
            // Clean up the URL object
            URL.revokeObjectURL(url);
        }catch (error) {
            console.log(error)
        }
        
        //setCurrentImages([])
    }

    return <>
        <Navbar/>
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
                        onClick={createCertificate}>Create and download a certificate
                    </button>
                    <button
                        className='flex bg-main text-white rounded mr-4 max-sm:mr-0 max-sm:mb-3 max-sm:w-4/5 justify-center px-2 py-2 text-sm leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                        onClick={() => {setCurrentImages([]); navigate('/')}}>Cancel
                    </button>
                </div> :
                <div>Please wait...</div>
            }
        </div>
    </>    
}

export default PdfMaker