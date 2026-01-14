"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ImageWithSkeletonProps extends Omit<ImageProps, "onLoad"> {
    wrapperClassName?: string;
    skeletonClassName?: string;
    onImageLoad?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export function ImageWithSkeleton({
    src,
    alt,
    className,
    wrapperClassName,
    skeletonClassName,
    onImageLoad,
    ...props
}: ImageWithSkeletonProps) {
    const [isLoading, setIsLoading] = useState(true);
    const isFill = props.fill || false;

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setIsLoading(false);
        if (onImageLoad) {
            onImageLoad(e);
        }
    };

    return (
        <div className={cn("relative overflow-hidden", isFill && "w-full h-full", wrapperClassName)}>
            {isLoading && (
                <Skeleton className={cn("absolute inset-0 w-full h-full", skeletonClassName)} />
            )}
            <Image
                src={src}
                alt={alt}
                className={cn(
                    "transition-opacity duration-300",
                    isLoading ? "opacity-0" : "opacity-100",
                    className
                )}
                onLoad={handleLoad}
                unoptimized
                {...props}
            />
        </div>
    );
}
