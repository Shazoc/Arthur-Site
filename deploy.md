# Déploiement sur VPS OVH

## Sur le VPS (SSH):

### 1. Installer Node.js et npm
```bash
curl -fsSL [https://deb.nodesource.com/setup_20.x](https://deb.nodesource.com/setup_20.x) | sudo -E bash -
sudo apt-get install -y nodejs
node --version
npm --version