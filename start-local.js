#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Configuration du projet pour fonctionnement local...\n');

// Fonction pour exécuter une commande
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}

async function setupLocal() {
  try {
    // 1. Vérifier si les fichiers locaux existent
    console.log('📁 Vérification des fichiers...');
    
    if (!fs.existsSync('index-local.html')) {
      console.error('❌ Fichier index-local.html manquant');
      return;
    }

    if (!fs.existsSync('package-local.json')) {
      console.error('❌ Fichier package-local.json manquant');
      return;
    }

    // 2. Sauvegarder les fichiers originaux
    console.log('💾 Sauvegarde des fichiers originaux...');
    if (fs.existsSync('index.html')) {
      fs.copyFileSync('index.html', 'index-blink.html');
    }
    if (fs.existsSync('package.json')) {
      fs.copyFileSync('package.json', 'package-blink.json');
    }

    // 3. Remplacer par les versions locales
    console.log('🔄 Configuration pour fonctionnement local...');
    fs.copyFileSync('index-local.html', 'index.html');
    fs.copyFileSync('package-local.json', 'package.json');

    // 4. Modifier le client Blink
    const clientPath = 'src/blink/client.ts';
    if (fs.existsSync(clientPath)) {
      fs.copyFileSync(clientPath, 'src/blink/client-blink.ts');
      fs.copyFileSync('src/blink/client-local.ts', clientPath);
    }

    // 5. Installer les dépendances
    console.log('📦 Installation des dépendances frontend...');
    await runCommand('npm', ['install']);

    console.log('📦 Installation des dépendances backend...');
    await runCommand('npm', ['install'], { cwd: 'backend' });

    // 6. Créer le fichier .env.local
    console.log('⚙️ Configuration des variables d\'environnement...');
    const envContent = `# Configuration locale
VITE_API_URL=http://localhost:3001
VITE_APP_MODE=local
`;
    fs.writeFileSync('.env.local', envContent);

    // 7. Lancer les serveurs
    console.log('\n🎉 Configuration terminée !');
    console.log('🚀 Lancement des serveurs...\n');

    // Lancer le backend
    console.log('🔧 Démarrage du backend...');
    const backend = spawn('npm', ['run', 'dev'], {
      cwd: 'backend',
      stdio: 'inherit',
      shell: true
    });

    // Attendre un peu puis lancer le frontend
    setTimeout(() => {
      console.log('🎨 Démarrage du frontend...');
      const frontend = spawn('npm', ['run', 'dev'], {
        stdio: 'inherit',
        shell: true
      });

      // Gérer l'arrêt propre
      process.on('SIGINT', () => {
        console.log('\n🛑 Arrêt des serveurs...');
        backend.kill();
        frontend.kill();
        process.exit(0);
      });
    }, 3000);

    console.log('\n📍 URLs d\'accès :');
    console.log('   Frontend: http://localhost:5173');
    console.log('   Backend:  http://localhost:3001');
    console.log('\n💡 Appuie sur Ctrl+C pour arrêter les serveurs');

  } catch (error) {
    console.error('❌ Erreur lors de la configuration :', error.message);
    process.exit(1);
  }
}

// Fonction pour restaurer la configuration Blink
function restoreBlink() {
  console.log('🔄 Restauration de la configuration Blink...');
  
  if (fs.existsSync('index-blink.html')) {
    fs.copyFileSync('index-blink.html', 'index.html');
  }
  
  if (fs.existsSync('package-blink.json')) {
    fs.copyFileSync('package-blink.json', 'package.json');
  }
  
  if (fs.existsSync('src/blink/client-blink.ts')) {
    fs.copyFileSync('src/blink/client-blink.ts', 'src/blink/client.ts');
  }
  
  console.log('✅ Configuration Blink restaurée');
}

// Vérifier les arguments de ligne de commande
const args = process.argv.slice(2);
if (args.includes('--restore-blink')) {
  restoreBlink();
} else {
  setupLocal();
}