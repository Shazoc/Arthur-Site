import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../useAuth'
import { addArticle } from '../ArticlesService'

const AddArticle = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    category: 'Investigation',
    excerpt: '',
    content: '',
    media: null,
    mediaType: 'photo'
  })
  const [previews, setPreviews] = useState([])
  const [coverImage, setCoverImage] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [success, setSuccess] = useState(false)

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Accès refusé</h1>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour ajouter des articles</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Se connecter
          </button>
        </div>
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newPreviews = []
      let loaded = 0
      
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader()
        reader.onloadend = () => {
          newPreviews.push(reader.result)
          loaded++
          if (loaded === files.length) {
            setPreviews(prev => [...prev, ...newPreviews])
          }
        }
        reader.readAsDataURL(files[i])
      }
    }
  }

  const handleRemoveFile = (index) => {
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1]
        setCoverImage(base64)
        setCoverPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleMediaTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      mediaType: type
    }))
    setPreviews([])
    setFormData(prev => ({
      ...prev,
      media: null
    }))
  }

  const uploadMedias = async () => {
    const filesInput = document.getElementById('media')
    const files = filesInput?.files

    if (!files || files.length === 0) {
      return []
    }

    const uploadedIds = []

    for (let i = 0; i < files.length; i++) {
      const fd = new FormData()
      fd.append('file', files[i])
      fd.append('description', formData.title || '')
      fd.append('tags', formData.category || '')

      const res = await fetch('http://51.77.221.168/api/upload', {
        method: 'POST',
        body: fd
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Erreur upload media: ${res.status} ${text}`)
      }

      const data = await res.json()
      if (data.media && data.media.id) {
        uploadedIds.push(data.media.id)
      }
    }

    return uploadedIds
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    let mediaIds = []
    try {
      mediaIds = await uploadMedias()
    } catch (err) {
      console.error(err)
      alert('Erreur lors de l’upload des médias : ' + err.message)
      return
    }

    const slug = formData.title
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    const payload = {
      title: formData.title,
      slug,
      excerpt: formData.excerpt,
      content: formData.content,
      tags: [formData.category],
      thumbnailUrl: coverPreview || '',
      mediaType: formData.mediaType === 'audio' ? 'audio' : 'image',
      mediaIds,
      published: true
    }

    try {
      await addArticle(payload)

      setSuccess(true)
      setTimeout(() => {
        setFormData({
          title: '',
          category: 'Investigation',
          excerpt: '',
          content: '',
          media: null,
          mediaType: 'photo'
        })
        setPreviews([])
        setCoverImage(null)
        setCoverPreview(null)
        setSuccess(false)
        navigate('/articles')
      }, 2000)
    } catch (err) {
      console.error(err)
      alert('Erreur lors de la création de l’article : ' + err.message)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Ajouter un article</h1>
        <p className="text-xl text-gray-600">Bienvenue, {user?.name}! Créez un nouvel article avec des médias.</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg">
          ✓ Article ajouté avec succès! Redirection...
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-8 space-y-8">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
            Titre de l'article
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Titre de votre article"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
            Catégorie
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option>Investigation</option>
            <option>Reportage</option>
            <option>Portrait</option>
            <option>Analyse</option>
            <option>Technologie</option>
          </select>
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-semibold text-gray-900 mb-2">
            Résumé (Excerpt)
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            required
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Un court résumé de votre article..."
          ></textarea>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-semibold text-gray-900 mb-2">
            Contenu de l'article
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="8"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Contenu complet de votre article..."
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-4">Type de média</label>
          <div className="grid grid-cols-2 gap-4">
            {[
              { type: 'photo', label: '📷 Photo' },
              { type: 'audio', label: '🎙 Audio' }
            ].map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => handleMediaTypeChange(item.type)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  formData.mediaType === item.type
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-semibold text-gray-900">{item.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="media" className="block text-sm font-semibold text-gray-900 mb-2">
            Télécharger des fichiers {formData.mediaType === 'photo' ? 'images' : 'fichiers audio'} (plusieurs fichiers acceptés)
          </label>
          <input
            type="file"
            id="media"
            onChange={handleFileChange}
            accept={formData.mediaType === 'photo' ? 'image/*' : 'audio/*'}
            multiple
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <p className="text-sm text-gray-500 mt-2">Vous pouvez sélectionner plusieurs fichiers à la fois</p>
        </div>

        {previews && previews.length > 0 && (
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 bg-blue-50">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-semibold text-gray-900">
                Aperçu des médias ({previews.length} fichier{previews.length > 1 ? 's' : ''}):
              </p>
              <button
                type="button"
                onClick={() => document.getElementById('media').click()}
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
              >
                + Ajouter
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {previews.map((preview, index) => (
                <div
                  key={index}
                  className="rounded-lg overflow-hidden bg-white border border-gray-200 relative group"
                >
                  {formData.mediaType === 'photo' && (
                    <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover" />
                  )}
                  {formData.mediaType === 'audio' && (
                    <div className="w-full h-32 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                      <span className="text-2xl">🎙</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label htmlFor="cover" className="block text-sm font-semibold text-gray-900 mb-2">
            Photo de couverture (comme une couverture de livre)
          </label>
          <input
            type="file"
            id="cover"
            onChange={handleCoverChange}
            accept="image/*"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          {coverPreview && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">Aperçu de la couverture:</p>
              <img src={coverPreview} alt="Cover preview" className="w-32 h-48 object-cover rounded-lg" />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Publier l'article
        </button>
      </form>
    </div>
  )
}

export default AddArticle