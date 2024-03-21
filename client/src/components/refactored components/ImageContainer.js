import { useEffect } from "react";

const ImageContainer = ({ imageSrc }) => { 

    useEffect(() => {
        const img = new Image();
        img.src = imageSrc;
  
        const loadImage = async () => {
            await new Promise((resolve) => {
                img.onload = () => {
                    resolve();
                };
            });
        };

        loadImage();
    }, [imageSrc]);
  
    return <>
        <img 
            src={imageSrc} 
            alt="image" 
            style={{ 
                objectFit: 'cover', 
                width: '100%', 
                height: 'auto', 
                marginBottom: '1rem' 
            }} />
    </>  
};

export default ImageContainer