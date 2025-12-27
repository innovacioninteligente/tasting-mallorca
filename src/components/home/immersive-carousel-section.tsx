
'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const desktopVideoUrl = "https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Fvideos%2FAUTENTICA%20MALLORCA%20GENERAL%20V2%20guitar.mp4?alt=media&token=2e3e3905-b373-4f89-8949-5074ea9cf377";
const mobileVideoUrl = "https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Fvideos%2FAUTENTICA%20MALLORCA%20GENERAL%20v2%20GUITAR%204%205.mp4?alt=media&token=6ecf2a48-692b-4c2f-8ca3-8e994b9d3bb2";

export function ImmersiveCarouselSection() {
    const [isMuted, setIsMuted] = useState(true);
    const [showControls, setShowControls] = useState(false);

    const [isInView, setIsInView] = useState(false);

    const carouselContainerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 } // Load when 10% visible
        );

        if (carouselContainerRef.current) {
            observer.observe(carouselContainerRef.current);
        }

        return () => observer.disconnect();
    }, []);

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
            className='w-full h-[90vh] md:h-[80vh] overflow-hidden cursor-pointer relative flex justify-center bg-gray-100'
            onClick={handleVideoClick}
        >
            <motion.div style={{ y }} className="w-full h-full relative">
                {isInView && (
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
                )}
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
