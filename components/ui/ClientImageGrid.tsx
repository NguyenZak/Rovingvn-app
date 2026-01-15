"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
// Optional plugins
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";

interface ClientImageGridProps {
    images: string[];
    title?: string;
    gridClassName?: string;
    imageClassName?: string;
    aspectRatio?: "video" | "square" | "4/3";
}

export function ClientImageGrid({
    images,
    title = "Gallery",
    gridClassName = "grid grid-cols-2 md:grid-cols-3 gap-4",
    imageClassName = "rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300",
    aspectRatio = "video"
}: ClientImageGridProps) {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    const handleImageClick = (clickedIndex: number) => {
        setIndex(clickedIndex);
        setOpen(true);
    };

    const aspectRatioClass = {
        "video": "aspect-video",
        "square": "aspect-square",
        "4/3": "aspect-[4/3]"
    }[aspectRatio];

    if (!images || images.length === 0) return null;

    return (
        <>
            <div className={gridClassName}>
                {images.map((imgUrl, i) => (
                    <div
                        key={i}
                        className={`${aspectRatioClass} ${imageClassName} cursor-pointer group relative`}
                        onClick={() => handleImageClick(i)}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={imgUrl}
                            alt={`${title} - Image ${i + 1}`}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                ))}
            </div>

            <Lightbox
                open={open}
                close={() => setOpen(false)}
                index={index}
                slides={images.map(src => ({ src }))}
                plugins={[Zoom, Thumbnails]}
                zoom={{ maxZoomPixelRatio: 3 }}
            />
        </>
    );
}
