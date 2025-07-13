"use client";

import { Section as SectionType } from "@/types/blocks/section";

export default function SpecialImages({ section }: { section: SectionType }) {
  return (
    <section id={section.name} className='py-16'>
      <div className='container'>
        <div className='mb-8 flex flex-col justify-between md:mb-14 lg:mb-16'>
          <h2 className='mb-5 text-pretty text-2xl font-bold lg:text-3xl text-center'>{section.title}</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {section.items &&
              section.items.map((v, i) => {
                return (
                  <img
                    src={v.image?.src || ""}
                    key={i}
                    width={300}
                    height={300}
                    alt={v.image?.alt || ""}
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
