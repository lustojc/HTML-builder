const fs = require("fs");
const {
  mkdir,
  rm,
  readdir,
  writeFile,
  copyFile,
  stat,
} = require("fs/promises");
const path = require("path");

const dist = {
  path: path.join(__dirname, "project-dist"),
  html: path.join(__dirname, "project-dist", "index.html"),
  css: path.join(__dirname, "project-dist", "style.css"),
  assets: path.join(__dirname, "project-dist", "assets"),
};

const src = {
  html: path.join(__dirname, "template.html"),
  css: path.join(__dirname, "styles"),
  assets: path.join(__dirname, "assets"),
  components: path.join(__dirname, "components"),
};

build(src, dist);

async function build(src, dist) {
  await rm(dist.path, { force: true, recursive: true });
  await mkdir(dist.path, { recursive: true });

  const template = await getDataFromFile(src.html);
  const html = await getHTML(template, src.components);

  writeToFile(html, dist.html);
  copyDir(src.assets, dist.assets);
  toBundle(src.css, dist.css);
}

function writeToFile(data, dir) {
  const stream = new fs.WriteStream(dir, { encoding: "utf-8" });
  stream.write(data);
}

async function getDataFromFile(dir) {
  const stream = new fs.ReadStream(dir, { encoding: "utf-8" });

  return new Promise(function (resolve, reject) {
    stream.on("readable", () => {
      const data = stream.read();
      if (data) {
        return resolve(data);
      }
    });
  });
}

async function getHTML(template, src) {
  const components = await getComponentsNames(src);
  let result = template;

  for (const component of components) {
    const htmlSrc = path.join(src, `${component}.html`);
    const data = await getDataFromFile(htmlSrc);
    result = result.replace(`{{${component}}}`, data);
  }
  return result;
}

async function toBundle(src, dist, ext = ".css") {
  await writeFile(dist, "");
  const files = await readdir(src);
  for (const file of files) {
    const srcFile = path.join(src, file);
    const status = await stat(srcFile);
    if (status.isFile() && path.extname(srcFile) === ext) {
      const data = await getDataFromFile(srcFile);
      fs.appendFile(dist, data, (err) => {
        if (err) throw err;
      });
    }
  }
}

async function copyDir(dir, dirCopy) {
  await mkdir(dirCopy, { recursive: true });
  const files = await readdir(dir, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    const copyFilePath = path.join(dirCopy, file.name);

    if (file.isFile()) {
      await copyFile(filePath, copyFilePath);
    }
    if (file.isDirectory()) {
      copyDir(filePath, copyFilePath);
    }
  }
}

async function getComponentsNames(dir) {
  const result = [];
  const files = await readdir(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const status = await stat(filePath);
    if (status.isFile()) {
      const { name } = path.parse(filePath);
      result.push(name);
    }
  }
  return result;
}
