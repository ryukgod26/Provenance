import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const datasets = await prisma.dataset.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  })

  const reports = await prisma.report.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Provenance Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{session.user.email}</span>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Your Datasets</h2>
            {datasets.length === 0 ? (
              <p className="text-gray-500">No datasets uploaded yet.</p>
            ) : (
              <ul className="space-y-2">
                {datasets.map((dataset) => (
                  <li key={dataset.id} className="text-gray-700">
                    {dataset.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Your Reports</h2>
            {reports.length === 0 ? (
              <p className="text-gray-500">No reports created yet.</p>
            ) : (
              <ul className="space-y-2">
                {reports.map((report) => (
                  <li key={report.id} className="text-gray-700">
                    {report.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
