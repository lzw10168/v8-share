const https = require('https');
const fs = require('fs');
const async = require('async');
const path = require('path');

const downloadFile = (url, dest, cb) => {
  const file = fs.createWriteStream(dest);
  https.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close(cb);
    });
  }).on('error', (err) => {
    fs.unlink(dest);
    if (cb) cb(err.message);
  });
};

const downloadAudioLessons = (start, end) => {
  async.eachSeries(Array.from({ length: end - start + 1 }, (_, i) => i + start), (lessonNumber, callback) => {
    const url = `https://i.xiao84.com/en-nce/2mp3-us/II-${lessonNumber}.mp3`;
    const dest = path.resolve(__dirname, `Lesson-${lessonNumber}.mp3`);
    console.log(`Downloading lesson ${lessonNumber}`);
    downloadFile(url, dest, (err) => {
      if (err) {
        console.error(`Error downloading lesson ${lessonNumber}: ${err}`);
      } else {
        console.log(`Lesson ${lessonNumber} downloaded successfully`);
      }
      callback(err);
    });
  }, (err) => {
    if (err) {
      console.error('An error occurred:', err);
    } else {
      console.log('All lessons downloaded successfully');
    }
  });
};

downloadAudioLessons(1, 96);
