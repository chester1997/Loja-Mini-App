const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
  // Create Category
  const cat1 = await prisma.category.upsert({
    where: { slug: "mini-dramas" },
    update: {},
    create: {
      name: "Mini Dramas",
      slug: "mini-dramas",
      position: 1,
    }
  })

  // Create Content
  const content1 = await prisma.content.upsert({
    where: { slug: "o-amor-depois-do-adeus" },
    update: {},
    create: {
      title: "O Amor Depois do Adeus",
      slug: "o-amor-depois-do-adeus",
      description: "Uma história envolvente sobre recomeços, destino e a força inabalável do amor.",
      shortDescription: "Uma história envolvente sobre recomeços.",
      coverUrl: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=600&auto=format&fit=crop",
      bannerUrl: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=1200&auto=format&fit=crop",
      price: 19.90,
      featured: true,
      categories: {
        create: {
          category: { connect: { id: cat1.id } }
        }
      }
    }
  })

  // Create Home Banner
  await prisma.homeBanner.create({
    data: {
      title: "O Amor Depois do Adeus",
      subtitle: "ORIGINAL STUDIO",
      description: "Prepare-se para se emocionar nesta produção original exclusiva.",
      imageUrl: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=1200&auto=format&fit=crop",
      contentId: content1.id,
      buttonPrimaryText: "Assistir",
      buttonSecondaryText: "Mais Detalhes",
      position: 1
    }
  })

  // Create Home Section
  await prisma.homeSection.create({
    data: {
      title: "Mini Dramas em Alta",
      slug: "mini-dramas-em-alta",
      type: "CATEGORY",
      categoryId: cat1.id,
      position: 1,
    }
  })

  console.log("Seed finished.")
}

main().catch(console.error).finally(() => prisma.$disconnect())
