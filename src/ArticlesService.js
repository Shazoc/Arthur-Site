const API_BASE_URL = 'http://51.77.221.168/api'

export const getArticles = async () => {
  const res = await fetch(`${API_BASE_URL}/articles`)
  if (!res.ok) {
    throw new Error('Erreur lors du chargement des articles')
  }
  return await res.json()
}

export const getArticleBySlug = async (slug) => {
  const res = await fetch(`${API_BASE_URL}/articles/${slug}`)
  if (!res.ok) {
    throw new Error('Article non trouvé')
  }
  return await res.json()
}

export const addArticle = async (article) => {
  const token = localStorage.getItem('authToken')
  if (!token) {
    throw new Error('Non authentifié')
  }

  const res = await fetch(`${API_BASE_URL}/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(article)
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Erreur création article: ${res.status} ${text}`)
  }

  const data = await res.json()
  return data.article || data
}

// Admin: liste complète des articles
export const getAdminArticles = async () => {
  const token = localStorage.getItem('authToken')
  if (!token) throw new Error('Non authentifié')

  const res = await fetch(`${API_BASE_URL}/admin/articles`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Erreur chargement admin articles: ${res.status} ${text}`)
  }

  return await res.json()
}

// Admin: suppression d’un article
export const deleteArticleById = async (id) => {
  const token = localStorage.getItem('authToken')
  if (!token) throw new Error('Non authentifié')

  const res = await fetch(`${API_BASE_URL}/articles/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Erreur suppression article: ${res.status} ${text}`)
  }

  return await res.json()
}