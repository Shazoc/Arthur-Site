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
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-12 h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="w-40 h-40 bg-blue-300 rounded-full mx-auto mb-6"></div>
              <p className="text-gray-600">Photo de profil</p>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <p className="text-lg text-gray-600 leading-relaxed">
            Je suis Arthur, journaliste d'investigation avec plus de 10 ans d'expérience dans le domaine du journalisme d'enquête et du reportage. Ma passion pour la vérité et la justice m'a mené à couvrir certaines des histoires les plus importantes de notre époque.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Spécialisé dans les investigations approfondies, les reportages de terrain et les analyses critiques, j'ai contribué à dévoiler des schémas de corruption, à mettre en lumière les injustices sociales et à amplifier les voix des communautés oubliées.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Mon travail a été récompensé par plusieurs prix prestigieux et a conduit à des changements politiques concrets. Je crois fermement que le journalisme est un outil puissant pour le changement social.
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
                <p className="font-semibold text-gray-900">Master en Journalisme d'Investigation</p>
                <p className="text-gray-600">Université de Paris | 2012</p>
              </li>
              <li>
                <p className="font-semibold text-gray-900">Licence en Sciences Politiques</p>
                <p className="text-gray-600">Université de Lyon | 2010</p>
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
            { title: 'Investigation', items: ['Recherche approfondie', 'Analyse de données', 'Entrevues'] },
            { title: 'Reportage', items: ['Reportage de terrain', 'Photojournalisme', 'Vidéo'] },
            { title: 'Communication', items: ['Rédaction', 'Podcast', 'Réseaux sociaux'] },
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