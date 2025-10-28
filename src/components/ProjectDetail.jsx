import { useParams, useNavigate } from 'react-router-dom'
import { getProjects } from '../ProjectsService'
import { useAuth } from '../useAuth'

const ProjectDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const projects = getProjects()
  const project = projects.find(p => p.id === parseInt(id))

  if (!project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Projet non trouvé</h1>
        <button
          onClick={() => navigate('/radio')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          Retour aux projets
        </button>
      </div>
    )
  }

  return (
    <article className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/radio')}
        className="mb-8 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
      >
        ← Retour aux projets
      </button>

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-3xl">🎙</span>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {project.category}
          </span>
          <span className="text-sm text-gray-500">{project.date}</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          {project.title}
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          {project.description}
        </p>
      </div>

      {project.audios && project.audios.length > 0 && (
        <div className="mb-12 rounded-lg overflow-hidden bg-gray-100">
          <div className="p-8 bg-white border border-gray-200 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Fichiers audio</h2>
            <div className="space-y-4">
              {project.audios.map((audio, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-3xl">🎙</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 mb-2">
                      Fichier audio {index + 1}
                    </p>
                    <audio src={audio} controls className="w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 pt-8 flex justify-between items-center">
        <button
          onClick={() => navigate('/radio')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Retour aux projets
        </button>
        {isAuthenticated && (
          <span className="text-sm text-gray-500">
            ID: {project.id}
          </span>
        )}
      </div>
    </article>
  )
}

export default ProjectDetail