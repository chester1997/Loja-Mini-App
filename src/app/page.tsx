export default function Home() {
  return (
    <div className="flex flex-col w-full h-full">
      {/* Fake Hero Banner */}
      <section className="relative w-full h-[60vh] md:h-[80vh] bg-neutral-900">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 md:w-2/3 lg:w-1/2 flex flex-col justify-end">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">O Amor Depois do Adeus</h1>
          <p className="text-gray-300 text-sm md:text-base mb-6 line-clamp-3">
            Uma história envolvente sobre recomeços, destino e a força inabalável 
            do amor. Prepare-se para se emocionar nesta produção original exclusiva.
          </p>
          <div className="flex space-x-4">
            <button className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200 transition">
              Assistir
            </button>
            <button className="bg-white/20 text-white px-6 py-2 rounded font-semibold hover:bg-white/30 backdrop-blur-sm transition">
              Mais Detalhes
            </button>
          </div>
        </div>
      </section>

      {/* Continue Watching Mock */}
      <section className="w-full px-6 py-8">
        <h2 className="text-lg font-semibold mb-4 text-white">Continue Assistindo</h2>
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          <div className="min-w-[160px] md:min-w-[240px] aspect-video bg-neutral-800 rounded relative overflow-hidden group cursor-pointer">
             <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition duration-300" />
             <div className="absolute bottom-0 w-full h-1 bg-gray-600">
               <div className="h-full bg-red-600 w-[63%]" />
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
