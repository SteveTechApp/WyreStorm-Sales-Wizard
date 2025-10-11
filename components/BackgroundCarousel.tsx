import React, { useState, useEffect } from 'react';
import { BACKGROUND_IMAGES } from '../data/backgroundImages.ts';

const BackgroundCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % BACKGROUND_IMAGES.length);
        }, 7000); // Change image every 7 seconds

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="background-carousel">
            {BACKGROUND_IMAGES.map((imageUrl, index) => (
                <div
                    key={index}
                    className={`background-carousel-image ${index === currentIndex ? 'visible' : ''}`}
                    style={{ backgroundImage: `url(${imageUrl})` }}
                />
            ))}
        </div>
    );
};

export default BackgroundCarousel;
