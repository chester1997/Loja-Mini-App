import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Play, Heart, ShieldCheck } from "lucide-react";
import Link from "next/link";
import SectionSlider from "@/components/home/SectionSlider";

export const revalidate = 60;

export default async function ContentPage({ params }: { params: { slug: string } }) {
  const content = await prisma.content.findUnique({
    where: { slug: params.slug },
    include: {
      categories: {
        include: { category: true }
      }
    }
  });

  if (!content) {
    notFound();
  }

  // Fetch related content by first category
  const firstCategoryId = content.categories[0]?.categoryId;
  let relatedContents: any[] = [];
  
  if (firstCategoryId) {
    const related = await prisma.contentCategory.findMany({
      where: { 
        categoryId: firstCategoryId,
        contentId: { not: content.id } // Exclude current
      },
      include: {
        content: true
      },
      take: 6
    });
    relatedContents = related.map(r => r.content).filter(c => c.active);
  }

  const isPurchased = false; // Mock for now until Phase 4 (Purchases)

  return (
    <div className="flex flex-col w-full min-h-screen bg-black">
      {/* Banner / Trailer / Video Placeholder */}
      <div className="w-full aspect-video md:h-[60vh] bg-neutral-900 relative">
        {(content.bannerUrl || content.coverUrl) && (
          <img 
            src={(content.bannerUrl || content.coverUrl) as string} 
            alt={content.title}
            className="w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="absolute inset-0 flex items-center justify-center">
           {isPurchased ? (
             <button className="bg-red-600 hover:bg-red-700 text-white p-4 md:p-6 rounded-full transition shadow-lg shadow-red-600/20">
               <Play size={32} fill="currentColor" />
             </button>
           ) : (
             <div className="bg-black/60 backdrop-blur px-6 py-4 rounded-xl text-center border border-white/10">
                <ShieldCheck className="mx-auto mb-2 text-gray-400" size={32} />
                <p className="text-white font-semibold">Conteúdo Exclusivo</p>
                <p className="text-gray-400 text-sm">Adquira para assistir</p>
             </div>
           )}
        </div>
      </div>

      {/* Info Section */}
      <div className="px-6 md:px-12 py-8 max-w-5xl mx-auto w-full -mt-10 relative z-10">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{content.title}</h1>
        
        <div className="flex items-center space-x-4 mb-6 text-sm text-gray-400">
          <span>{new Date(content.createdAt).getFullYear()}</span>
          {content.categories.map(c => (
            <span key={c.categoryId} className="bg-neutral-800 px-2 py-0.5 rounded text-gray-300">
              {c.category.name}
            </span>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 text-gray-300 leading-relaxed text-sm md:text-base">
            <p>{content.description || content.shortDescription || "Nenhuma descrição disponível."}</p>
          </div>

          <div className="w-full md:w-72 shrink-0 bg-neutral-900 border border-neutral-800 p-6 rounded-xl flex flex-col items-center text-center">
            {isPurchased ? (
              <button className="w-full bg-white text-black py-3 rounded font-bold hover:bg-gray-200 transition flex items-center justify-center">
                <Play className="mr-2" size={20} fill="currentColor" /> Assistir
              </button>
            ) : (
              <>
                <p className="text-sm text-gray-400 mb-1">Preço Único</p>
                <p className="text-3xl font-bold text-white mb-4">
                  {content.price ? `R$ ${content.price.toString().replace('.', ',')}` : "Grátis"}
                </p>
                <Link href={`/checkout/${content.id}`} className="w-full">
                  <button className="w-full bg-red-600 text-white py-3 rounded font-bold hover:bg-red-700 transition">
                    Comprar Agora
                  </button>
                </Link>
              </>
            )}

            <button className="w-full mt-4 bg-transparent border border-gray-600 text-white py-3 rounded font-semibold hover:bg-white/5 transition flex items-center justify-center">
              <Heart className="mr-2" size={20} /> Minha Lista
            </button>
          </div>
        </div>
      </div>

      {/* Related Content */}
      {relatedContents.length > 0 && (
        <div className="mt-8 max-w-7xl mx-auto w-full">
          <SectionSlider title="Títulos Semelhantes" contents={relatedContents} />
        </div>
      )}
    </div>
  );
}
