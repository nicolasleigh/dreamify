"use client";

import { useEffect, useState } from "react";
import { Section as SectionType } from "@/types/blocks/section";

export default function RecentImages({ section }: { section: SectionType }) {
  const [imagesUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const res = await fetch("/api/get-images", {
        method: "GET",
      });

      const result = await res.json();
      // console.log(result);

      if (result.data) {
        setImageUrls(result.data.map((v, i) => v.imageUrl));
      } else {
        // TODO:
        console.log("Error fetch image");
      }
    };

    fetchImages();
  }, []);

  return (
    <section id={section.name} className='py-16'>
      <div className='container'>
        <div className='mb-8 flex flex-col justify-between md:mb-14 lg:mb-16'>
          <h2 className='mb-5 text-pretty text-2xl font-bold lg:text-3xl text-center'>{section.title}</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {imagesUrls &&
              imagesUrls.map((v, i) => {
                return (
                  <img
                    src={v}
                    key={i}
                    width={300}
                    height={300}
                    alt='AI images'
                    className='rounded-md hover:scale-105 transition-all duration-500'
                  />
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
}
