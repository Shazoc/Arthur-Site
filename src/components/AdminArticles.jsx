import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../useAuth'
import { getAdminArticles, deleteArticleById } from '../ArticlesService'

const AdminArticles = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await getAdminArticles()
        setArticles(data)
      } catch (e) {
        console.error(e)
        setError('Impossible de charger les articles admin.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [isAuthenticated, navigate])

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet article ?')) return
    try {
      await deleteArticleById(id)
      setArticles(prev => prev.filter(a => a._id !== id))
    } catch (e) {
      console.error(e)
      alert('Erreur lors de la suppression : ' + e.message)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return <div className="text-center py-12">Chargement des articles...</div>
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Administration des articles</h1>
        <button
          onClick={() => navigate('/add-article')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          + Nouvel article
        </button>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Aucun article pour le moment.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Titre</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Slug</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Publié</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Créé le</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article._id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{article.title}</td>
                  <td className="px-4 py-3 text-gray-500">{article.slug}</td>
                  <td className="px-4 py-3">
                    {article.published ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700">
                        Publié
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                        Brouillon
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {article.createdAt
                      ? new Date(article.createdAt).toLocaleDateString('fr-FR')
                      : '-'}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {/* bouton éditer plus tard */}
                    <button
                      onClick={() => handleDelete(article._id)}
                      className="px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminArticles