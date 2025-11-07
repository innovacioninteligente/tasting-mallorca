
'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';

const videoUrl = "https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Fvideos%2FAUTENTICA%20MALLORCA%20GENERAL%20%20V1.mp4?alt=media&token=90225773-8283-4884-a4d5-565abcafc790";

export function ImmersiveCarouselSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const carouselContainerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const { scrollYProgress } = useScroll({
        target: carouselContainerRef,
        offset: ['start end', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], ['-70%', '70%']);

    const togglePlay = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        }
    }

    return (
        <>
            <section ref={carouselContainerRef} className='w-full min-h-screen overflow-hidden cursor-pointer' onClick={() => setIsModalOpen(true)}>
                <motion.div style={{ y }} className="h-full">
                    <div className='h-screen relative'>
                        <video
                            src={videoUrl}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-black/20"></div>
                    </div>
                </motion.div>
            </section>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-none w-screen h-screen p-0 bg-black/90 border-0 flex items-center justify-center">
                    <DialogTitle className="sr-only">Video Player</DialogTitle>
                   {isModalOpen && (
                     <video
                        ref={videoRef}
                        src={videoUrl}
                        autoPlay
                        loop
                        onClick={togglePlay}
                        className="w-full h-auto max-h-screen max-w-6xl cursor-pointer"
                    >
                        Your browser does not support the video tag.
                    </video>
                   )}
                   <DialogClose className="absolute right-4 top-4 rounded-full p-2 bg-black/50 text-white opacity-80 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-white z-10">
                        <X className="h-8 w-8" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        </>
    );
}
