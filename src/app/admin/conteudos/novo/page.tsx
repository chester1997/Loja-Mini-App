"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

export default function NovoConteudo() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Connect to an API endpoint to save the content
    alert("Conteúdo salvo com sucesso (mock)!");
    router.push("/admin/conteudos");
  };

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Novo Conteúdo</h1>

      <form onSubmit={handleSubmit} className="bg-black border border-neutral-800 p-6 rounded-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-400">Título</label>
            <input type="text" required className="bg-neutral-900 border border-neutral-700 rounded p-3 text-white focus:outline-none focus:border-red-600" />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-400">Slug</label>
            <input type="text" required className="bg-neutral-900 border border-neutral-700 rounded p-3 text-white focus:outline-none focus:border-red-600" />
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm text-gray-400">Descrição Curta</label>
          <textarea rows={2} className="bg-neutral-900 border border-neutral-700 rounded p-3 text-white focus:outline-none focus:border-red-600" />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm text-gray-400">Descrição Completa</label>
          <textarea rows={4} className="bg-neutral-900 border border-neutral-700 rounded p-3 text-white focus:outline-none focus:border-red-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-400">URL da Capa (Vertical)</label>
            <input type="url" className="bg-neutral-900 border border-neutral-700 rounded p-3 text-white focus:outline-none focus:border-red-600" />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-400">URL do Banner (Horizontal)</label>
            <input type="url" className="bg-neutral-900 border border-neutral-700 rounded p-3 text-white focus:outline-none focus:border-red-600" />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-400">URL do Trailer</label>
            <input type="url" className="bg-neutral-900 border border-neutral-700 rounded p-3 text-white focus:outline-none focus:border-red-600" />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-400">URL do Vídeo (Bunny Stream)</label>
            <input type="url" required className="bg-neutral-900 border border-neutral-700 rounded p-3 text-white focus:outline-none focus:border-red-600" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-400">Preço (R$)</label>
            <input type="number" step="0.01" required className="bg-neutral-900 border border-neutral-700 rounded p-3 text-white focus:outline-none focus:border-red-600" />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-400">Status</label>
            <select className="bg-neutral-900 border border-neutral-700 rounded p-3 text-white focus:outline-none focus:border-red-600">
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-gray-400">Destaque</label>
            <select className="bg-neutral-900 border border-neutral-700 rounded p-3 text-white focus:outline-none focus:border-red-600">
              <option value="false">Não</option>
              <option value="true">Sim</option>
            </select>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={loading} className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition flex items-center">
            <Save className="mr-2" size={20} />
            Salvar Conteúdo
          </button>
        </div>
      </form>
    </div>
  );
}
