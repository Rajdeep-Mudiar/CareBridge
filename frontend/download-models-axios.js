import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelsDir = path.join(__dirname, 'public', 'models');

if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

const downloadFile = async (url, dest) => {
  const writer = fs.createWriteStream(dest);

  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Failed to download ${url}:`, error.message);
    throw error;
  }
};

const main = async () => {
  try {
    console.log('Downloading male model...');
    await downloadFile('https://models.readyplayer.me/64b54e3d360f9e1e3b3b4f5a.glb', path.join(modelsDir, 'male.glb'));
    
    console.log('Downloading female model...');
    await downloadFile('https://models.readyplayer.me/64b54f2f360f9e1e3b3b4f62.glb', path.join(modelsDir, 'female.glb'));
    
    console.log('Downloads completed successfully.');
  } catch (err) {
    console.error('Download failed:', err);
    process.exit(1);
  }
};

main();
