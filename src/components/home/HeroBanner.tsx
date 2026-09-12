import Link from "next/link";
import { Play, Info } from "lucide-react";

interface HeroBannerProps {
  banner: {
    id: string;
    title?: string | null;
    subtitle?: string | null;
    description?: string | null;
    imageUrl?: string | null;
    contentId?: string | null;
    buttonPrimaryText?: string | null;
    buttonSecondaryText?: string | null;
    content?: {
      slug: string;
    } | null;
  };
}

export default function HeroBanner({ banner }: HeroBannerProps) {
  const contentLink = banner.content?.slug ? `/conteudo/${banner.content.slug}` : "#";

  return (
    <section className="relative w-full h-[65vh] md:h-[85vh] bg-neutral-900 overflow-hidden">
      {banner.imageUrl ? (
        <img
          src={banner.imageUrl}
          alt={banner.title || "Banner"}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-black" />
      )}
      
      {/* Gradient Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent hidden md:block" />

      <div className="absolute bottom-0 left-0 w-full p-6 pb-12 md:p-16 md:w-2/3 lg:w-1/2 flex flex-col justify-end h-full">
        {banner.subtitle && (
          <span className="text-red-500 font-bold tracking-widest text-xs md:text-sm mb-2 uppercase">
            {banner.subtitle}
          </span>
        )}
        
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
          {banner.title}
        </h1>
        
        {banner.description && (
          <p className="text-gray-300 text-sm md:text-lg mb-6 line-clamp-3 max-w-xl text-shadow">
            {banner.description}
          </p>
        )}
        
        <div className="flex space-x-3 md:space-x-4">
          <Link href={contentLink}>
            <button className="flex items-center justify-center bg-white text-black px-4 md:px-6 py-2 md:py-2.5 rounded hover:bg-gray-200 transition font-bold text-sm md:text-base">
              <Play className="mr-2" size={20} fill="currentColor" />
              {banner.buttonPrimaryText || "Assistir"}
            </button>
          </Link>
          
          <Link href={contentLink}>
            <button className="flex items-center justify-center bg-white/20 text-white px-4 md:px-6 py-2 md:py-2.5 rounded hover:bg-white/30 backdrop-blur-sm transition font-semibold text-sm md:text-base border border-white/30">
              <Info className="mr-2" size={20} />
              {banner.buttonSecondaryText || "Mais Detalhes"}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
