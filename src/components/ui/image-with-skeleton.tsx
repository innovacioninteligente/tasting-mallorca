"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ImageWithSkeletonProps extends Omit<ImageProps, "onLoad"> {
    wrapperClassName?: string;
    skeletonClassName?: string;
}

export function ImageWithSkeleton({
    src,
    alt,
    className,
    wrapperClassName,
    skeletonClassName,
    ...props
}: ImageWithSkeletonProps) {
    const [isLoading, setIsLoading] = useState(true);
    const isFill = props.fill || false;

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
                onLoad={() => setIsLoading(false)}
                unoptimized
                {...props}
            />
        </div>
    );
}
