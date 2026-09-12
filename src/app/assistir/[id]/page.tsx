import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound, redirect } from "next/navigation";
import VideoPlayer from "@/components/player/VideoPlayer";

export default async function WatchPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) redirect("/api/auth/signin");

  // Fetch content
  const content = await prisma.content.findUnique({
    where: { id: params.id }
  });

  if (!content) notFound();

  // Validate Purchase
  const purchase = await prisma.purchase.findFirst({
    where: {
      userId: user.id,
      contentId: content.id,
      status: "paid"
    }
  });

  if (!purchase) {
    // Content is not purchased, deny access
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-center p-6">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Acesso Negado</h1>
        <p className="text-gray-400 mb-6">Você precisa comprar este conteúdo para assisti-lo.</p>
        <a href={`/conteudo/${content.slug}`} className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200">
          Voltar para a página do conteúdo
        </a>
      </div>
    );
  }

  // Fetch previous progress
  const progress = await prisma.watchProgress.findUnique({
    where: {
      userId_contentId: {
        userId: user.id,
        contentId: content.id
      }
    }
  });

  const videoUrl = content.videoUrl || "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"; // fallback for testing

  return (
    <VideoPlayer 
      contentId={content.id}
      title={content.title}
      videoUrl={videoUrl}
      initialPosition={progress && !progress.completed ? progress.positionSeconds : 0}
    />
  );
}
