import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getArticleBySlug } from '../ArticlesService'

const ArticleDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await getArticleBySlug(slug)
        setArticle(data)
      } catch (e) {
        console.error(e)
        setError('Article non trouvé')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [slug])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement de l’article...</div>
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Article non trouvé</h1>
          <button
            onClick={() => navigate('/articles')}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            ← Retour aux articles
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate('/articles')}
          className="mb-8 inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
        >
          <span>←</span>
          Retour aux articles
        </button>

        <header className="mb-12 pb-8 border-b border-gray-200">
          {article.publishedAt && (
            <span className="text-sm text-gray-500">
              {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
            {article.excerpt}
          </p>
        </header>

        <main className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
          <div className="text-gray-700 leading-relaxed space-y-4 break-words">
            {article.content
              ? article.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-base sm:text-lg leading-relaxed">
                    {paragraph}
                  </p>
                ))
              : null}
          </div>
        </main>
      </div>
    </div>
  )
}

export default ArticleDetail