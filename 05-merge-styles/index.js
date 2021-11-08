const fs = require('fs');
const path = require('path');

const folder = path.join(__dirname, 'styles');
const css = path.join(__dirname, 'project-dist/bundle.css');

fs.readdir(folder, {withFileTypes: true}, ((err, files) => {
  if (err) throw err;
  for (let file of files) {
    if (path.extname(file.name) === '.css') {
      fs.readFile(`${folder}/${file.name}`, ((err, data) => {
        if (err) throw err;
        else {
          fs.appendFile(css, data, err => {
            if (err) throw err;
          });
        }
      }));
    }
  }
}));