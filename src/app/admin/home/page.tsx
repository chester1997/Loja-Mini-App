import { prisma } from "@/lib/prisma";
import { LayoutTemplate, Plus } from "lucide-react";

export default async function AdminHome() {
  const banners = await prisma.homeBanner.findMany({ orderBy: { position: "asc" } });
  const sections = await prisma.homeSection.findMany({ orderBy: { position: "asc" } });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Gerenciar Home</h1>

      <div className="space-y-12">
        {/* Banners */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center"><LayoutTemplate className="mr-2" /> Banners de Destaque</h2>
            <button className="text-sm bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded flex items-center transition">
              <Plus size={16} className="mr-1" /> Adicionar
            </button>
          </div>
          
          <div className="bg-black border border-neutral-800 rounded-xl p-4 space-y-3">
            {banners.map(b => (
              <div key={b.id} className="flex items-center justify-between bg-neutral-900 p-4 rounded border border-neutral-800">
                <div>
                  <p className="font-bold">{b.title}</p>
                  <p className="text-xs text-gray-500">Posição: {b.position}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${b.active ? 'text-green-500' : 'text-red-500'}`}>
                  {b.active ? "Ativo" : "Inativo"}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Sections */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center"><LayoutTemplate className="mr-2" /> Trilhos / Seções</h2>
            <button className="text-sm bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded flex items-center transition">
              <Plus size={16} className="mr-1" /> Adicionar
            </button>
          </div>
          
          <div className="bg-black border border-neutral-800 rounded-xl p-4 space-y-3">
            {sections.map(s => (
              <div key={s.id} className="flex items-center justify-between bg-neutral-900 p-4 rounded border border-neutral-800">
                <div>
                  <p className="font-bold">{s.title}</p>
                  <p className="text-xs text-gray-500">Tipo: {s.type} | Posição: {s.position}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${s.active ? 'text-green-500' : 'text-red-500'}`}>
                  {s.active ? "Ativo" : "Inativo"}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
