"use client";

import * as React from "react";
import Image from "next/image"; // Assuming you are using Next.js for the Image component

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
// Assuming 'Image' from '@prisma/client' defines the structure for your image objects,
// for example: { id: string; url: string; alt?: string; }
import { Image as PrismaImage } from "@prisma/client";

interface PostImageProps {
  images: PrismaImage[];
}

export const PostImage = ({ images }: PostImageProps) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const isMultiImage = images.length > 1

  return (
    <div className="max-w-xs">
      <Carousel setApi={setApi} className="w-full max-w-xs border-0">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={image.id || index}>
              <Card className="">
                <CardContent className="flex aspect-square items-center justify-center p-0">
                  <Image
                    src={image.url}
                    alt={`Image ${index + 1}`}
                    width={400}
                    height={400}
                    className="object-cover w-full h-full rounded-md"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {isMultiImage && (
        <div className="text-muted-foreground py-1 text-center text-sm">
          Slide {current} of {count}
        </div>
      )}
    </div>
  );
};