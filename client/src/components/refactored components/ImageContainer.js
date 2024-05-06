import { useEffect } from "react";
import { useLongPress } from "use-long-press";

const ImageContainer = ({ imageSrc, setShowCheckbox = null }) => { 

    const bind = useLongPress(() => {
        if (!setShowCheckbox) return;
        setShowCheckbox(prev => !prev);
    }, {
        onStart: (event) => {
            event.preventDefault();
        }
    });

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
            {...bind()}
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