import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Play, ShoppingBag } from "lucide-react";

export default async function PurchasesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) redirect("/api/auth/signin");

  const purchases = await prisma.purchase.findMany({
    where: { 
      userId: user.id,
      status: "paid" // only show paid purchases
    },
    include: {
      content: true
    },
    orderBy: { purchasedAt: "desc" }
  });

  return (
    <div className="flex flex-col w-full min-h-screen p-6 md:p-12 max-w-5xl mx-auto">
      <h1 className="text-2xl md:text-4xl font-bold mb-8">Minhas Compras</h1>

      {purchases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col">
              <div className="aspect-video relative w-full bg-black">
                {(purchase.content.bannerUrl || purchase.content.coverUrl) && (
                  <img
                    src={(purchase.content.bannerUrl || purchase.content.coverUrl) as string}
                    alt={purchase.content.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-1">{purchase.content.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Comprado em: {purchase.purchasedAt ? new Date(purchase.purchasedAt).toLocaleDateString("pt-BR") : "N/A"}
                  </p>
                </div>
                <Link href={`/conteudo/${purchase.content.slug}`}>
                  <button className="w-full bg-white text-black py-2.5 rounded font-semibold flex items-center justify-center hover:bg-gray-200 transition">
                    <Play className="mr-2" size={18} fill="currentColor" />
                    Assistir
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center mt-20 text-gray-500">
          <ShoppingBag size={64} className="mb-4 opacity-50" />
          <p className="text-lg">Você ainda não possui conteúdos comprados.</p>
        </div>
      )}
    </div>
  );
}
