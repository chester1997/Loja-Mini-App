import Link from "next/link";
import { Heart } from "lucide-react";

interface ContentCardProps {
  content: {
    id: string;
    title: string;
    slug: string;
    coverUrl?: string | null;
    price?: any;
  };
  progress?: number; // 0 to 100
  purchased?: boolean;
}

export default function ContentCard({ content, progress, purchased }: ContentCardProps) {
  return (
    <Link href={`/conteudo/${content.slug}`} className="block group w-full relative">
      <div className="relative aspect-[2/3] w-full bg-neutral-800 rounded-md overflow-hidden transition-transform duration-300 group-hover:scale-105">
        {content.coverUrl ? (
          <img
            src={content.coverUrl}
            alt={content.title}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs text-center p-2">
            {content.title}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <p className="text-white text-sm font-semibold truncate">{content.title}</p>
        </div>

        {/* Favorite Icon */}
        <button className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-gray-300 hover:text-white hover:bg-black/80 transition-colors">
          <Heart size={16} />
        </button>

        {purchased && (
          <div className="absolute top-2 left-2 bg-green-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">
            ✓ COMPRADO
          </div>
        )}

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-600">
            <div
              className="h-full bg-red-600"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
      
      {/* Below Title for mobile/default view */}
      <div className="mt-2 text-sm text-gray-300 group-hover:text-white truncate">
        {content.title}
      </div>
    </Link>
  );
}
