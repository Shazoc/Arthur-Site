import { useParams, useNavigate } from 'react-router-dom'
import { getArticles } from '../ArticlesService'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel'


const ArticleDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const articles = getArticles()
  const article = articles.find(a => a.id === parseInt(id))

  if (!article) {
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
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full border border-blue-200">
              {article.category}
            </span>
            <span className="text-sm text-gray-500">{article.date}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
            {article.excerpt}
          </p>
        </header>

        {article.medias && article.medias.length > 0 && (
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {article.medias && article.medias.length > 0 && article.mediaType === 'photo' && (
                <div className="mb-12 w-full">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {article.medias.map((media, index) => (
                        <CarouselItem key={index}>
                          <div className="flex justify-center items-center bg-gray-50 rounded-lg overflow-hidden min-h-96">
                            <img
                              src={media}
                              alt={`${article.title} - ${index + 1}`}
                              className="max-w-full max-h-96 object-contain"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {article.medias.length > 1 && (
                      <>
                        <CarouselPrevious className="left-4" />
                        <CarouselNext className="right-4" />
                      </>
                    )}
                  </Carousel>
                  {article.medias.length > 1 && (
                    <div className="text-center mt-4 text-sm text-gray-600">
                      Galerie ({article.medias.length} images)
                    </div>
                  )}
                </div>
              )}

              {article.mediaType === 'audio' && article.medias && article.medias.length > 0 && (
                <div className="mb-12 rounded-lg overflow-hidden bg-gray-100">
                  <div className="w-full flex flex-col items-center justify-center py-16">
                    <div className="text-7xl mb-8">🎙</div>
                    <div className="w-4/5 space-y-4">
                      {article.medias.map((media, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">Piste {index + 1}</span>
                          <audio src={media} controls className="flex-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <main className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
          <div className="text-gray-700 leading-relaxed space-y-4 break-words">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-base sm:text-lg leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

export default ArticleDetail