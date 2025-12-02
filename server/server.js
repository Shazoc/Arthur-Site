import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// ===== JWT / Auth admin =====

const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'dev-secret';

  // On force une valeur sûre pour éviter tout problème d'environnement
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

const authAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const decoded = jwt.verify(token, secret);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

// ===== Fichiers / uploads =====

// Créer le dossier uploads s'il n'existe pas
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuration multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'audio/mpeg',
      'audio/wav',
      'audio/webm'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Type de fichier non autorisé: ${file.mimetype}`));
    }
  }
});

// ===== Schémas MongoDB =====

// Médias
const mediaSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  mimetype: String,
  size: Number,
  type: {
    type: String,
    enum: ['image', 'video', 'audio'],
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  description: String,
  tags: [String]
})

const Media = mongoose.model('Media', mediaSchema)

// Articles
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, default: '' },
  content: { type: String, default: '' },
  thumbnailUrl: { type: String, default: '' },
  tags: [{ type: String }],
  mediaType: { type: String, enum: ['image', 'audio', 'video'], default: 'image' },
  mediaIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }],
  published: { type: Boolean, default: false },
  publishedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
})

articleSchema.pre('save', function (next) {
  this.updatedAt = new Date()
  if (this.published && !this.publishedAt) {
    this.publishedAt = new Date()
  }
  next()
})

const Article = mongoose.model('Article', articleSchema)

// ===== Routes Articles =====

// Liste publique des articles publiés
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await Article.find({ published: true })
      .sort({ publishedAt: -1, createdAt: -1 })
      .select('title slug excerpt thumbnailUrl tags mediaType mediaIds publishedAt createdAt')

    res.json(articles)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Article par slug (public si publié)
app.get('/api/articles/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
      published: true
    })

    if (!article) {
      return res.status(404).json({ error: 'Article non trouvé' })
    }

    res.json(article)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Création d’un article (admin seulement)
app.post('/api/articles', authAdmin, async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      thumbnailUrl,
      tags,
      mediaType,
      mediaIds,
      published
    } = req.body

    const article = new Article({
      title,
      slug,
      excerpt,
      content,
      thumbnailUrl,
      mediaType: mediaType || 'image',
      mediaIds: Array.isArray(mediaIds) ? mediaIds : [],
      tags: Array.isArray(tags)
        ? tags
        : tags
        ? String(tags)
            .split(',')
            .map((t) => t.trim())
        : [],
      published: !!published
    })

    await article.save()

    res.status(201).json({
      success: true,
      article
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Slug déjà utilisé' })
    }
    res.status(500).json({ error: error.message })
  }
})

// ===== Connexion MongoDB =====

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/arthur-site';
    await mongoose.connect(mongoUri);
    console.log('✓ MongoDB connecté');
  } catch (error) {
    console.error('✗ Erreur MongoDB:', error.message);
    process.exit(1);
  }
};

// ===== Routes =====

// Auth admin (login, retourne un JWT)
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  const adminUser = process.env.ADMIN_USERNAME;
  const adminPass = process.env.ADMIN_PASSWORD;

  if (!adminUser || !adminPass) {
    return res
      .status(500)
      .json({ error: 'Configuration admin manquante' });
  }

  if (username !== adminUser || password !== adminPass) {
    return res.status(401).json({ error: 'Identifiants invalides' });
  }

  const token = generateToken({ role: 'admin', username: adminUser });

  res.json({
    success: true,
    token
  });
});

// Upload de fichier (image / vidéo / audio)
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier uploadé' });
    }

    const fileType = req.file.mimetype.startsWith('image/')
      ? 'image'
      : req.file.mimetype.startsWith('video/')
      ? 'video'
      : req.file.mimetype.startsWith('audio/')
      ? 'audio'
      : 'unknown';

    const media = new Media({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      type: fileType,
      description: req.body.description || '',
      tags: req.body.tags ? req.body.tags.split(',') : []
    });

    await media.save();

    res.json({
      success: true,
      media: {
        id: media._id,
        filename: media.filename,
        originalName: media.originalName,
        type: media.type,
        url: `/api/media/${media._id}`
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer tous les médias
app.get('/api/media', async (req, res) => {
  try {
    const type = req.query.type; // 'image', 'video', 'audio'
    const query = type ? { type } : {};

    const media = await Media.find(query).sort({ uploadedAt: -1 });
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer un média par ID (fichier)
app.get('/api/media/:id', async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ error: 'Média non trouvé' });
    }

    const filePath = path.join(uploadsDir, media.filename);
    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer les infos d'un média (métadonnées)
app.get('/api/media-info/:id', async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ error: 'Média non trouvé' });
    }
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer un média
app.delete('/api/media/:id', authAdmin, async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    if (!media) {
      return res.status(404).json({ error: 'Média non trouvé' });
    }

    const filePath = path.join(uploadsDir, media.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ success: true, message: 'Média supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== Routes Articles =====

// Liste publique des articles publiés
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await Article.find({ published: true })
      .sort({ publishedAt: -1, createdAt: -1 })
      .select('title slug excerpt thumbnailUrl tags publishedAt createdAt');

    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Article par slug (public si publié)
app.get('/api/articles/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
      published: true
    });

    if (!article) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }

    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Création d’un article (admin seulement)
app.post('/api/articles', authAdmin, async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      thumbnailUrl,
      tags,
      published
    } = req.body;

    const article = new Article({
      title,
      slug,
      excerpt,
      content,
      thumbnailUrl,
      tags: Array.isArray(tags)
        ? tags
        : tags
        ? String(tags)
            .split(',')
            .map((t) => t.trim())
        : [],
      published: !!published
    });

    await article.save();

    res.status(201).json({
      success: true,
      article
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Slug déjà utilisé' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Liste complète des articles (admin uniquement)
app.get('/api/admin/articles', authAdmin, async (req, res) => {
  try {
    const articles = await Article.find({})
      .sort({ createdAt: -1 })
    res.json(articles)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Suppression d’un article (admin uniquement)
app.delete('/api/articles/:id', authAdmin, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id)
    if (!article) {
      return res.status(404).json({ error: 'Article non trouvé' })
    }
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ===== Health check =====

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Serveur en ligne' });
});

// Servir les fichiers statiques d’uploads
app.use('/uploads', express.static(uploadsDir));

// ===== Démarrage serveur =====

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✓ Serveur lancé sur http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Erreur au démarrage:', error);
  process.exit(1);
});