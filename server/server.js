import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

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
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
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

// Schéma MongoDB
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
});

const Media = mongoose.model('Media', mediaSchema);

// Connexion MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://user:password@cluster.mongodb.net/arthur-site';
    await mongoose.connect(mongoUri);
    console.log('✓ MongoDB connecté');
  } catch (error) {
    console.error('✗ Erreur MongoDB:', error.message);
    process.exit(1);
  }
};

// Routes

// Upload de fichier
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier uploadé' });
    }

    const fileType = req.file.mimetype.startsWith('image/') ? 'image' :
                     req.file.mimetype.startsWith('video/') ? 'video' :
                     req.file.mimetype.startsWith('audio/') ? 'audio' : 'unknown';

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

// Récupérer un média par ID
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

// Récupérer les infos d'un média
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
app.delete('/api/media/:id', async (req, res) => {
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Serveur en ligne' });
});

// Servir les fichiers statiques
app.use('/uploads', express.static(uploadsDir));

// Démarrer le serveur
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✓ Serveur lancé sur http://localhost:${PORT}`);
  });
};

startServer().catch(error => {
  console.error('Erreur au démarrage:', error);
  process.exit(1);
});