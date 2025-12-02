import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import arthurPhoto from '../photo/arthur.jpg'
import { getArticles } from '../ArticlesService'

const Home = () => {
  const [latestArticles, setLatestArticles] = useState([])
  const [articlesError, setArticlesError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setArticlesError('')
        const data = await getArticles()
        setLatestArticles(data.slice(0, 3))
      } catch (e) {
        console.error(e)
        setArticlesError('Impossible de charger les derniers articles.')
      }
    }

    load()
  }, [])

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-lg text-blue-600 font-semibold">Bienvenue</p>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
                Arthur
              </h1>
              <p className="text-2xl text-gray-600">
                Journaliste & Storyteller
              </p>
            </div>

            <p className="text-xl text-gray-600 mt-4 space-y-3">
              <span className="block">
                Journaliste indépendant basé à Nantes, je raconte la culture telle qu’elle se vit : au plus près du
                terrain. Rap, mode, cinéma, univers urbains.
              </span>
              <span className="block">
                Je rencontre celles et ceux qui ont envie de partager leur vécu, et je mets leurs histoires en valeur.
              </span>
              <span className="block">
                Curieux et passionné, j’enquête et je raconte. Mon objectif : mettre en avant celles et ceux qu’on
                entend moins, ainsi que les cultures qui les façonnent.
              </span>
            </p>

            <div className="flex gap-4 pt-4">
              <Link
                to="/articles"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Lire mes articles
              </Link>
              <Link
                to="/contact"
                className="px-8 py-3 border-2 border-gray-300 text-gray-900 rounded-lg font-semibold hover:border-gray-400 transition-colors"
              >
                Me contacter
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-12 h-[28rem] flex items-center justify-center">
            <div className="text-center">
              <img
                src={arthurPhoto}
                alt="Photo de profil d'Arthur"
                className="w-64 h-64 rounded-full object-cover mx-auto mb-6 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles Preview */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Articles récents</h2>

        {articlesError && (
          <p className="text-sm text-red-600 mb-4">{articlesError}</p>
        )}

        {!articlesError && latestArticles.length === 0 && (
          <p className="text-gray-600 text-sm mb-4">
            Aucun article publié pour le moment.
          </p>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {latestArticles.map((article) => (
            <article
              key={article._id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
            >
              <div className="bg-gray-200 h-48">
                {article.thumbnailUrl && (
                  <img
                    src={article.thumbnailUrl}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-6">
                <p className="text-sm text-blue-600 font-semibold mb-2">
                  {article.tags && article.tags.length > 0
                    ? article.tags.join(', ')
                    : 'Article'}
                </p>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <Link
                  to={`/articles/${article.slug}`}
                  className="text-blue-600 font-semibold hover:text-blue-700"
                >
                  Lire la suite →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 rounded-2xl text-white text-center">
        <h2 className="text-4xl font-bold mb-4">Vous avez une histoire à couvrir?</h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Je suis toujours à la recherche de nouvelles histoires intéressantes et de collaborations.
        </p>
        <Link
          to="/contact"
          className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Prenons contact
        </Link>
      </section>
    </div>
  )
}

export default Home