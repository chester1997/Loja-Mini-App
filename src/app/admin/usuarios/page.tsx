import { prisma } from "@/lib/prisma";

export default async function AdminUsers() {
  const users = await prisma.user.findMany({
    orderBy: { email: "asc" },
    include: {
      _count: {
        select: { purchases: { where: { status: "paid" } } }
      }
    }
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Usuários Cadastrados</h1>

      <div className="bg-black border border-neutral-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-neutral-900 border-b border-neutral-800">
            <tr>
              <th className="p-4 text-gray-400 font-medium">Nome</th>
              <th className="p-4 text-gray-400 font-medium">E-mail</th>
              <th className="p-4 text-gray-400 font-medium">Role</th>
              <th className="p-4 text-gray-400 font-medium text-center">Conteúdos Comprados</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-neutral-800 hover:bg-neutral-900/50">
                <td className="p-4 font-medium">{u.name || "N/A"}</td>
                <td className="p-4 text-gray-300">{u.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${u.role === 'ADMIN' ? 'bg-red-900/30 text-red-500' : 'bg-neutral-800 text-gray-400'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-center font-bold">{u._count.purchases}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
