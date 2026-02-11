import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelsDir = path.join(__dirname, 'public', 'models');

if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
  console.log('Created directory:', modelsDir);
}

const downloadFile = (url, dest) => {
  const file = fs.createWriteStream(dest);
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download '${url}' (${response.statusCode})`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`Downloaded: ${dest}`);
          resolve();
        });
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {}); // Delete the file async. (But we don't check the result)
      reject(err);
    });
  });
};

const main = async () => {
  try {
    console.log('Starting downloads...');
    await downloadFile('https://models.readyplayer.me/64b54e3d360f9e1e3b3b4f5a.glb', path.join(modelsDir, 'male.glb'));
    await downloadFile('https://models.readyplayer.me/64b54f2f360f9e1e3b3b4f62.glb', path.join(modelsDir, 'female.glb'));
    console.log('All downloads complete!');
  } catch (err) {
    console.error('Error downloading files:', err);
    process.exit(1);
  }
};

main();
