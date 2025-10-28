import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../useAuth'
import { addProject } from '../ProjectsService'

const AddProject = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Radio'
  })
  const [previews, setPreviews] = useState([])
  const [success, setSuccess] = useState(false)

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Accès refusé</h1>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour ajouter des projets</p>
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

  const handleSubmit = (e) => {
    e.preventDefault()

    addProject({
      title: formData.title,
      description: formData.description,
      category: formData.category
    }, previews)

    setSuccess(true)
    setTimeout(() => {
      setFormData({
        title: '',
        description: '',
        category: 'Radio'
      })
      setPreviews([])
      setSuccess(false)
      navigate('/projects')
    }, 2000)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Ajouter un projet</h1>
        <p className="text-xl text-gray-600">Bienvenue, {user?.name}! Créez un nouveau projet avec des fichiers audio.</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg">
          ✓ Projet ajouté avec succès! Redirection...
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-8 space-y-8">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
            Titre du projet
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Titre de votre projet"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
            Description du projet
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="6"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Décrivez votre projet en détail..."
          ></textarea>
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
            <option>Radio</option>
            <option>Podcast</option>
            <option>Documentaire</option>
            <option>Enquête</option>
            <option>Autre</option>
          </select>
        </div>

        <div>
          <label htmlFor="audio" className="block text-sm font-semibold text-gray-900 mb-2">
            Télécharger des fichiers audio (plusieurs fichiers acceptés)
          </label>
          <input
            type="file"
            id="audio"
            onChange={handleFileChange}
            accept="audio/*"
            multiple
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <p className="text-sm text-gray-500 mt-2">Vous pouvez sélectionner plusieurs fichiers audio à la fois</p>
        </div>

        {previews && previews.length > 0 && (
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 bg-blue-50">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-semibold text-gray-900">Fichiers audio ({previews.length} fichier{previews.length > 1 ? 's' : ''}):</p>
              <button
                type="button"
                onClick={() => document.getElementById('audio').click()}
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
              >
                + Ajouter
              </button>
            </div>
            <div className="space-y-2">
              {previews.map((preview, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 group">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎙</span>
                    <span className="text-sm text-gray-600">Fichier audio {index + 1}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-600 hover:text-red-700 font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Publier le projet
        </button>
      </form>
    </div>
  )
}

export default AddProject
