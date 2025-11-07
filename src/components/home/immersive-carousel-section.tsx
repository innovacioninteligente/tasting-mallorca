'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

const videoUrl = "https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Fvideos%2FAUTENTICA%20MALLORCA%20GENERAL%20%20V1.mp4?alt=media&token=90225773-8283-4884-a4d5-565abcafc790";

export function ImmersiveCarouselSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const carouselContainerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: carouselContainerRef,
        offset: ['start end', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], ['-70%', '70%']);

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
                <DialogContent className="max-w-none w-screen h-screen md:h-auto md:w-auto md:max-w-6xl p-0 bg-black/90 border-0 flex items-center justify-center">
                    <DialogTitle className="sr-only">Video Player</DialogTitle>
                   {isModalOpen && (
                     <video
                        src={videoUrl}
                        autoPlay
                        controls
                        className="w-full h-auto max-h-screen"
                    >
                        Your browser does not support the video tag.
                    </video>
                   )}
                </DialogContent>
            </Dialog>
        </>
    );
}
