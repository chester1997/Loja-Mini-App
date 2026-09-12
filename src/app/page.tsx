import { prisma } from "@/lib/prisma";
import HeroBanner from "@/components/home/HeroBanner";
import SectionSlider from "@/components/home/SectionSlider";

export const revalidate = 60; // revalidate every 60 seconds

export default async function Home() {
  // 1. Fetch Active Hero Banners
  const banners = await prisma.homeBanner.findMany({
    where: { active: true },
    orderBy: { position: "asc" },
    include: {
      content: {
        select: { slug: true }
      }
    }
  });

  // 2. Fetch Active Sections with related Content
  const sections = await prisma.homeSection.findMany({
    where: { active: true },
    orderBy: { position: "asc" },
    include: {
      category: {
        include: {
          contents: {
            include: {
              content: true
            }
          }
        }
      }
    }
  });

  const mainBanner = banners[0];

  return (
    <div className="flex flex-col w-full min-h-screen">
      
      {/* HERO BANNER */}
      {mainBanner ? (
        <HeroBanner banner={mainBanner} />
      ) : (
        <div className="w-full h-[60vh] bg-neutral-900 flex items-center justify-center">
          <p className="text-gray-500">Nenhum destaque configurado.</p>
        </div>
      )}

      {/* DYNAMIC SECTIONS */}
      <div className="mt-[-2rem] relative z-10">
        {sections.map((section) => {
          let items: any[] = [];
          
          if (section.type === "CATEGORY" && section.category) {
            // Extract contents linked to this category
            items = section.category.contents
              .map(cc => cc.content)
              .filter(c => c.active)
              .slice(0, section.limit);
          }
          
          // ToDo: Implement logic for LATEST, BEST_SELLERS, CONTINUE_WATCHING

          if (items.length === 0) return null;

          return (
            <SectionSlider 
              key={section.id} 
              title={section.title} 
              contents={items} 
            />
          );
        })}
      </div>
    </div>
  );
}
