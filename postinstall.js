const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

const platform = os.platform();
const arch = os.arch();

let filename;
if (platform === 'linux' && arch === 'x64') {
  filename = 'yt-dlp';
} else if (platform === 'win32') {
  filename = 'yt-dlp.exe';
} else if (platform === 'darwin') {
    filename = 'yt-dlp_macos';
} else {
  console.error('Unsupported platform:', platform, arch);
  process.exit(1);
}

const url = `https://github.com/yt-dlp/yt-dlp/releases/latest/download/${filename}`;
const binDir = path.join(__dirname, 'bin');
const dest = path.join(binDir, 'yt-dlp' + (platform === 'win32' ? '.exe' : ''));

if (!fs.existsSync(binDir)) {
  fs.mkdirSync(binDir);
}

const file = fs.createWriteStream(dest);

console.log(`Downloading ${url} to ${dest}`);

https.get(url, (response) => {
  if (response.statusCode === 302) {
    https.get(response.headers.location, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log('Download completed.');
          if (platform !== 'win32') {
            fs.chmodSync(dest, '755');
            console.log('Made yt-dlp executable.');
          }
        });
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      console.error('Error downloading file:', err.message);
      process.exit(1);
    });
  } else {
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log('Download completed.');
          if (platform !== 'win32') {
            fs.chmodSync(dest, '755');
            console.log('Made yt-dlp executable.');
          }
        });
      });
  }
}).on('error', (err) => {
  fs.unlink(dest, () => {});
  console.error('Error downloading file:', err.message);
  process.exit(1);
});