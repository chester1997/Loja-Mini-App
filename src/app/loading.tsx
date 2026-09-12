import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 space-y-4">
      <Loader2 className="animate-spin text-red-600" size={48} />
      <p className="font-medium animate-pulse">Carregando conteúdos...</p>
    </div>
  );
}
