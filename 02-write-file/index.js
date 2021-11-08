const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const process = require('process');
const rl = readline.createInterface({ input, output });
const filePath = path.join(__dirname, 'text.txt');
fs.writeFile(filePath, '', error => {
  if (error) {
    throw error;
  }
});
console.log('Enter text');
process.on('exit', () => {
  console.log('bye!');
});
function a() {
  rl.question('', answer => {
    if (answer === 'exit') {
      process.exit();
    } else {
      fs.appendFile(filePath, `${answer}\n`, err => {
        if (err) {
          throw err;
        }
      });
      a();
    }
  });
}
a();