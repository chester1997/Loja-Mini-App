import { prisma } from "@/lib/prisma";
import { Search as SearchIcon } from "lucide-react";
import ContentCard from "@/components/content/ContentCard";

export const revalidate = 0; // dynamic search

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";

  let results: any[] = [];

  if (query.trim()) {
    results = await prisma.content.findMany({
      where: {
        active: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } }
        ]
      }
    });
  }

  return (
    <div className="flex flex-col w-full min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-4xl font-bold mb-6">Busca</h1>

      <form className="relative w-full mb-10" method="GET" action="/buscar">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Títulos, descrições..."
          className="w-full bg-neutral-900 border border-neutral-700 text-white px-5 py-4 rounded-xl pr-12 focus:outline-none focus:border-red-600 transition"
        />
        <button type="submit" className="absolute right-4 top-4 text-gray-400 hover:text-white">
          <SearchIcon size={24} />
        </button>
      </form>

      {query && (
        <div className="mb-6 text-gray-400">
          Resultados para: <span className="text-white font-semibold">"{query}"</span>
        </div>
      )}

      {results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {results.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      ) : (
        query && (
          <div className="text-center text-gray-500 mt-12">
            Nenhum conteúdo encontrado para esta busca.
          </div>
        )
      )}
    </div>
  );
}
