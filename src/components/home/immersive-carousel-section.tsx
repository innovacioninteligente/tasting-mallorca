
'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

const videoUrl = "https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Fvideos%2FAUTENTICA%20MALLORCA%20GENERAL%20%20V1.mp4?alt=media&token=90225773-8283-4884-a4d5-565abcafc790";

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
        // Prevent the click from propagating to the video element and pausing it.
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
            className='w-full h-auto md:h-[80vh] overflow-hidden cursor-pointer relative flex justify-center' 
            onClick={handleVideoClick}
        >
            <motion.div style={{ y }} className="w-full aspect-video relative">
                <video
                    ref={videoRef}
                    src={videoUrl}
                    autoPlay
                    muted={isMuted}
                    loop
                    playsInline
                    controls={showControls}
                    className="object-cover w-full h-full custom-video-controls"
                />
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
