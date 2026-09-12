import { prisma } from "@/lib/prisma";
import { Plus, Edit } from "lucide-react";

export default async function AdminCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { position: "asc" }
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Categorias</h1>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center hover:bg-red-700 transition">
          <Plus size={20} className="mr-2" /> Nova Categoria
        </button>
      </div>

      <div className="bg-black border border-neutral-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-neutral-900 border-b border-neutral-800">
            <tr>
              <th className="p-4 text-gray-400 font-medium">Posição</th>
              <th className="p-4 text-gray-400 font-medium">Nome</th>
              <th className="p-4 text-gray-400 font-medium">Slug</th>
              <th className="p-4 text-gray-400 font-medium">Status</th>
              <th className="p-4 text-gray-400 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} className="border-b border-neutral-800 hover:bg-neutral-900/50">
                <td className="p-4 text-gray-500 font-bold">{cat.position}</td>
                <td className="p-4 font-medium">{cat.name}</td>
                <td className="p-4 text-gray-500">{cat.slug}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${cat.active ? 'bg-green-900/30 text-green-500' : 'bg-red-900/30 text-red-500'}`}>
                    {cat.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-gray-400 hover:text-white">
                    <Edit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
