const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, data) => {
  if (err) throw err;
  const files = data.filter((item) => item.isFile());
  displayFilesInfo(files);
});

function displayFilesInfo(files) {
  files.forEach((file) => {
    const filePath = path.join(folderPath, file.name);
    const filePathObject = path.parse(filePath);
    fs.stat(filePath, (err, stats) => {
      if (err) throw err;
      const fileSize = stats.size;
      console.log(
        `${filePathObject.name} - ${filePathObject.ext.slice(1)} - ${(
          fileSize / 1024
        ).toFixed(3)}kb`
      );
    });
  });
}