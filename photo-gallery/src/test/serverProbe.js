import http from 'http';
import { preview } from 'vite';

async function testServer() {
  console.log('Starting Vite preview server programmatically...');
  const previewServer = await preview({
    root: 'C:/Users/naras/.gemini/antigravity/scratch/exactspace-react-assignment/react-assignments-main/photo-gallery',
    preview: { port: 3005 },
  });

  const url = 'http://localhost:3005';
  console.log(`Server started at ${url}. Probing...`);

  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          console.log(`HTTP Status: ${res.statusCode}`);
          console.log(`Includes <title>Photo Gallery</title>: ${data.includes('<title>Photo Gallery</title>')}`);
          console.log(`Includes <div id="root">: ${data.includes('id="root"')}`);

          previewServer.httpServer.close(() => {
            console.log('Server stopped successfully.');
            if (res.statusCode === 200 && data.includes('Photo Gallery')) {
              resolve(true);
            } else {
              reject(new Error('Probe failed'));
            }
          });
        });
      })
      .on('error', (err) => {
        previewServer.httpServer.close();
        reject(err);
      });
  });
}

testServer()
  .then(() => {
    console.log('Server probe test PASSED!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Server probe test FAILED:', err);
    process.exit(1);
  });
