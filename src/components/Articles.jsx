import { useState, useEffect } from 'react'
import { getArticles, deleteArticle } from '../ArticlesService'
import { useAuth } from '../useAuth'
import { Link, useNavigate } from 'react-router-dom'

const Articles = () => {
  const [articles, setArticles] = useState([])
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    setArticles(getArticles())
  }, [])

  const handleDelete = (id) => {
    deleteArticle(id)
    setArticles(getArticles())
  }

  const handleReadMore = (id) => {
    navigate(`/articles/${id}`)
  }

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Mes articles</h1>
          <p className="text-xl text-gray-600">
            Découvrez mes investigations, reportages et analyses sur les sujets qui comptent.
          </p>
        </div>
        {isAuthenticated && (
          <Link
            to="/add-article"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            + Ajouter un article
          </Link>
        )}
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Aucun article pour le moment.</p>
          {isAuthenticated && (
            <Link to="/add-article" className="text-blue-600 font-semibold hover:text-blue-700">
              Créer le premier article
            </Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {articles.map((article) => (
            <article key={article.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow bg-white">
              <div className="bg-gray-200 h-64 overflow-hidden flex items-center justify-center">
                {article.cover ? (
                  <img src={`data:image/jpeg;base64,${article.cover}`} alt={article.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-400 text-center">
                    <p className="text-lg">Pas de couverture</p>
                  </div>
                )}
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {article.category}
                  </span>
                  <span className="text-sm text-gray-500">{article.date}</span>
                </div>
                {article.mediaType && (
                  <p className="text-xs text-gray-500 mb-3">
                    {article.mediaType === 'photo' ? '📷 Photo' : article.mediaType === 'video' ? '🎞 Vidéo' : '🎙 Audio'}
                  </p>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleReadMore(article.id)}
                    className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                  >
                    Lire la suite →
                  </button>
                  {isAuthenticated && (
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-semibold"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default Articles