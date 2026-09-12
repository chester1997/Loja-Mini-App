import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";

export default async function AdminContents() {
  const contents = await prisma.content.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      categories: { include: { category: true } }
    }
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Conteúdos</h1>
        <Link href="/admin/conteudos/novo">
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center hover:bg-red-700 transition">
            <Plus size={20} className="mr-2" /> Novo Conteúdo
          </button>
        </Link>
      </div>

      <div className="bg-black border border-neutral-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-neutral-900 border-b border-neutral-800">
            <tr>
              <th className="p-4 text-gray-400 font-medium">Título</th>
              <th className="p-4 text-gray-400 font-medium">Preço</th>
              <th className="p-4 text-gray-400 font-medium">Categorias</th>
              <th className="p-4 text-gray-400 font-medium">Status</th>
              <th className="p-4 text-gray-400 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {contents.map(content => (
              <tr key={content.id} className="border-b border-neutral-800 hover:bg-neutral-900/50">
                <td className="p-4 font-medium">{content.title}</td>
                <td className="p-4 text-green-400">
                  {content.price ? `R$ ${Number(content.price).toFixed(2)}` : "Grátis"}
                </td>
                <td className="p-4 text-sm text-gray-400">
                  {content.categories.map(c => c.category.name).join(", ")}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${content.active ? 'bg-green-900/30 text-green-500' : 'bg-red-900/30 text-red-500'}`}>
                    {content.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Link href={`/admin/conteudos/${content.id}`}>
                    <button className="text-gray-400 hover:text-white">
                      <Edit size={18} />
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {contents.length === 0 && (
          <div className="p-8 text-center text-gray-500">Nenhum conteúdo cadastrado.</div>
        )}
      </div>
    </div>
  );
}
