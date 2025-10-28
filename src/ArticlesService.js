export const getArticles = () => {
  const stored = localStorage.getItem('articles')
  return stored ? JSON.parse(stored) : []
}

export const addArticle = (article, mediaArray = null) => {
  const articles = getArticles()
  const newArticle = {
    ...article,
    id: Date.now(),
    date: new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    medias: mediaArray || [],
    cover: article.cover || null
  }
  articles.unshift(newArticle)
  localStorage.setItem('articles', JSON.stringify(articles))
  return newArticle
}

export const deleteArticle = (id) => {
  const articles = getArticles()
  const filtered = articles.filter(a => a.id !== id)
  localStorage.setItem('articles', JSON.stringify(filtered))
}