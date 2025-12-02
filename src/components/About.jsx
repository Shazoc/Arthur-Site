import arthurPhoto from '../photo/arthur.jpg'

const About = () => {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">À propos de moi
        </h1>
        <p className="text-xl text-gray-600">
          Journaliste passionné par la vérité et l'impact social.
        </p>
      </div>

      {/* Bio Section */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div>
           <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-12 h-[28rem] flex items-center justify-center">
                      <div className="text-center">
                        <img
                          src={arthurPhoto}
                          alt="Photo de profil d'Arthur"
                          className="w-64 h-64 rounded-full object-cover mx-auto mb-6 shadow-lg"
                        />
                      </div>
                    </div>
        </div>
        <div className="space-y-6">
          <p className="text-lg text-gray-600 leading-relaxed space-y-4">
  <span className="block">
    Je m’appelle Arthur CAMUS, journaliste indépendant. Je suis passionné de culture (rap, mode, cinéma) et j’ai envie d’en parler autant que possible.
  </span>
  <span className="block">
    Il y a quelques années, j’ai compris qu’être journaliste spécialisé, c’était simplement raconter ce qu’on aime. Peu importe mes passions d’aujourd’hui ou celles de demain : avec le journalisme, je peux toujours les explorer, les comprendre et les partager.
  </span>
  <span className="block">
    Articles, photos, vidéos, streams Twitch… j’expérimente tous les formats pour parler de ce qui me fait vibrer, sans filtres et sans limites, tout seul ou avec d’autres personnes.
  </span>
</p>
        </div>
      </section>

      {/* Credentials */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900">Qualifications & Expérience</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Formation</h3>
            <ul className="space-y-4">
              <li>
                <p className="font-semibold text-gray-900">Centre nantais du journalisme</p>
                <p className="text-gray-600">CNJ | 2023 - 2026</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900">Compétences</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Ecriture', items: ['Recherche approfondie', 'Analyse', 'Interview'] },
            { title: 'Reportage', items: ['Terrain', 'Photojournalisme', 'Tournage de vidéo'] },
            { title: 'Réseaux Sociaux :', items: ['Twitch/YouTube', 'TikTok/Instagram'] },
            { title: ' Podcast :', items: ['Débat', 'Discussion'] },
          ].map((skill) => (
            <div key={skill.title} className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{skill.title}</h3>
              <ul className="space-y-2">
                {skill.items.map((item) => (
                  <li key={item} className="text-gray-600 flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 rounded-2xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Mes valeurs</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Vérité</h3>
            <p className="text-gray-600">
              La vérité est le fondement de tout bon journalisme. Je m'engage à rapporter les faits avec précision et intégrité.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Impact</h3>
            <p className="text-gray-600">
              Je crois que le journalisme doit créer un impact positif et contribuer au changement social.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Indépendance</h3>
            <p className="text-gray-600">
              L'indépendance éditoriale est cruciale. Je rapporte sans crainte ni faveur.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Responsabilité</h3>
            <p className="text-gray-600">
              Je suis responsable envers mes lecteurs et envers les sujets de mes reportages.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About