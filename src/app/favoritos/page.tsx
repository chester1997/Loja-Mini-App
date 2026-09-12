import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ContentCard from "@/components/content/ContentCard";
import { redirect } from "next/navigation";
import { HeartCrack } from "lucide-react";

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    // Para o MVP: se não estiver logado, redireciona pro login ou mostra aviso
    redirect("/api/auth/signin"); // Ou /login se a página custom existir
  }

  // Get user id from email
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) redirect("/api/auth/signin");

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: {
      content: true
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="flex flex-col w-full min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-4xl font-bold mb-8">Minha Lista</h1>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {favorites.map((fav) => (
            <ContentCard key={fav.id} content={fav.content as any} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center mt-20 text-gray-500">
          <HeartCrack size={64} className="mb-4 opacity-50" />
          <p className="text-lg">Você ainda não adicionou nenhum conteúdo à sua lista.</p>
        </div>
      )}
    </div>
  );
}
