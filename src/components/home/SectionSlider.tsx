"use client";

import { useRef } from "react";
import ContentCard from "@/components/content/ContentCard";

interface SectionSliderProps {
  title: string;
  contents: any[];
}

export default function SectionSlider({ title, contents }: SectionSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!contents || contents.length === 0) return null;

  return (
    <section className="w-full px-4 md:px-8 py-6">
      <h2 className="text-lg md:text-xl font-semibold mb-4 text-white">
        {title}
      </h2>
      
      <div 
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {contents.map((item) => (
          <div key={item.id} className="min-w-[140px] md:min-w-[180px] snap-start">
            <ContentCard content={item as any} />
          </div>
        ))}
      </div>
    </section>
  );
}
