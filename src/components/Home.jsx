import { Link } from 'react-router-dom'

const Home = () => {
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
            
            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
              Je couvre les histoires qui comptent. Avec plus de 10 ans d'expérience en journalisme d'investigation, je me spécialise dans les reportages approfondis et les enquêtes qui révèlent la vérité.
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

          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-12 h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="w-40 h-40 bg-blue-300 rounded-full mx-auto mb-6"></div>
              <p className="text-gray-600">Photo de profil</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles Preview */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Articles récents</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <article key={i} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-gray-200 h-48"></div>
              <div className="p-6">
                <p className="text-sm text-blue-600 font-semibold mb-2">Catégorie</p>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Titre de l'article {i}
                </h3>
                <p className="text-gray-600 mb-4">
                  Un aperçu court de l'article avec les points clés...
                </p>
                <Link to="/articles" className="text-blue-600 font-semibold hover:text-blue-700">
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