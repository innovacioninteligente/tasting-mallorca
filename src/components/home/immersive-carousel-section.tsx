
'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const desktopVideoUrl = "https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Fvideos%2FVideo%20Hero%2FAUTENTICA%20MALLORCA%20GENERAL%20v2.mp4?alt=media&token=5f61eb33-037a-43de-9e69-c0c80523f0cb";
const mobileVideoUrl = "https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Fvideos%2FVideo%20Hero%2FAUTENTICA%20MALLORCA%20GENERAL%20v2%20vertical.mp4?alt=media&token=3ab9792a-c507-4ac3-9ddc-9864bd82a67f";

export function ImmersiveCarouselSection() {
    const [isMuted, setIsMuted] = useState(true);
    const [showControls, setShowControls] = useState(false);
    
    const carouselContainerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    
    const { scrollYProgress } = useScroll({
        target: carouselContainerRef,
        offset: ['start end', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);

    const handleVideoClick = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();

        setIsMuted(prevState => !prevState);
        if (!showControls) {
            setShowControls(true);
        }
    };

    return (
        <section 
            ref={carouselContainerRef} 
            className='w-full h-[90vh] md:h-[80vh] overflow-hidden cursor-pointer relative flex justify-center' 
            onClick={handleVideoClick}
        >
            <motion.div style={{ y }} className="w-full h-full relative">
                <video
                    ref={videoRef}
                    autoPlay
                    muted={isMuted}
                    loop
                    playsInline
                    controls={showControls}
                    className="object-cover w-full h-full custom-video-controls"
                >
                    <source src={desktopVideoUrl} type="video/mp4" media="(min-width: 768px)" />
                    <source src={mobileVideoUrl} type="video/mp4" media="(max-width: 767px)" />
                    Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
            </motion.div>
            
            {!showControls && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/50 backdrop-blur-sm text-white px-6 py-3 rounded-full flex items-center gap-3">
                        {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                        <span className="font-semibold text-lg">Activar Sonido</span>
                    </div>
                </div>
            )}
        </section>
    );
}
