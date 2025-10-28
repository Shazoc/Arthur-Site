import { useState, useEffect } from 'react'
import { getProjects, deleteProject } from '../ProjectsService'
import { useAuth } from '../useAuth'
import { Link, useNavigate } from 'react-router-dom'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    setProjects(getProjects())
  }, [])

  const handleDelete = (id) => {
    deleteProject(id)
    setProjects(getProjects())
  }

  const handleReadMore = (id) => {
    navigate(`/radio/${id}`)
  }

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Mes projets audio</h1>
          <p className="text-xl text-gray-600">
            Découvrez mes productions audio, podcasts et reportages sonores.
          </p>
        </div>
        {isAuthenticated && (
          <Link
            to="/add-project"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            + Ajouter un projet
          </Link>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Aucun projet pour le moment.</p>
          {isAuthenticated && (
            <Link to="/add-project" className="text-blue-600 font-semibold hover:text-blue-700">
              Créer le premier projet
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((project) => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🎙</span>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {project.category}
                    </span>
                    <span className="text-sm text-gray-500">{project.date}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </div>

              {project.audios && project.audios.length > 0 && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">
                    {project.audios.length} fichier{project.audios.length > 1 ? 's' : ''} audio
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleReadMore(project.id)}
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  Écouter →
                </button>
                {isAuthenticated && (
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-semibold"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Projects