import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ContentCard from "@/components/content/ContentCard";
import { History as HistoryIcon } from "lucide-react";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) redirect("/api/auth/signin");

  // Fetch unique watch history items, or we can use WatchProgress since it represents unique started contents
  const progresses = await prisma.watchProgress.findMany({
    where: { userId: user.id },
    include: {
      content: true
    },
    orderBy: { lastWatchedAt: "desc" }
  });

  return (
    <div className="flex flex-col w-full min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-4xl font-bold mb-8">Histórico de Visualização</h1>

      {progresses.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {progresses.map((prog) => (
            <ContentCard 
              key={prog.id} 
              content={prog.content as any} 
              progress={prog.progressPercentage} 
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center mt-20 text-gray-500">
          <HistoryIcon size={64} className="mb-4 opacity-50" />
          <p className="text-lg">Você ainda não assistiu a nenhum conteúdo.</p>
        </div>
      )}
    </div>
  );
}
