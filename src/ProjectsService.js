export const getProjects = () => {
  const stored = localStorage.getItem('projects')
  return stored ? JSON.parse(stored) : []
}

export const addProject = (project, audioArray = null) => {
  const projects = getProjects()
  const newProject = {
    ...project,
    id: Date.now(),
    date: new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    audios: audioArray || []
  }
  projects.unshift(newProject)
  localStorage.setItem('projects', JSON.stringify(projects))
  return newProject
}

export const deleteProject = (id) => {
  const projects = getProjects()
  const filtered = projects.filter(p => p.id !== id)
  localStorage.setItem('projects', JSON.stringify(filtered))
}