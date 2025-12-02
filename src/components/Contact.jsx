import { useState } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Me contacter</h1>
        <p className="text-xl text-gray-600">
          Vous avez une histoire à partager? Une collaboration en vue? N'hésitez pas à me contacter.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-4xl mb-4">📧</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Email</h3>
          <p className="text-gray-600">arthurcamus44@gmail.com</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-4xl mb-4">📱</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Téléphone</h3>
          <p className="text-gray-600">+33 6 71 26 61 51</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-4xl mb-4">📍</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Localisation</h3>
          <p className="text-gray-600">Paris, France</p>
          <p className="text-gray-600">Nantes, France</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-moi un message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                Nom
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Votre nom"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2">
                Sujet
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Sujet de votre message"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Votre message..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Envoyer
            </button>
          </form>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Réseaux sociaux</h2>
            <div className="space-y-4">
              {[
                { name: 'Instragram', handle: '@ArthurJournalist' },
                { name: 'Tiktok', handle: 'arthur-journalist' },
                { name: 'Youtube', handle: '@arthurreports' },
                { name: 'LinkedIn', handle: '@arthurreports' },
                { name: 'Twitter', handle: 'Arthur Journalist' },
              ].map((social) => (
                <a key={social.name} href="#" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                  <span className="text-2xl mr-4">🔗</span>
                  <div>
                    <p className="font-semibold text-gray-900">{social.name}</p>
                    <p className="text-sm text-gray-600">{social.handle}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact