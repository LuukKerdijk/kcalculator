import { src, dest, watch } from 'gulp';
import replace from 'gulp-replace';
import rename from 'gulp-rename';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// initialize path variables for ESM
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

export function buildWebComponents(cb) {
  // pathnames
  const wcParentDir = path.join(__dirname, "/src/web-components/");
  const wcDirs = fs.readdirSync(wcParentDir, {withFileType: true})
    .filter((fsItem) => {
      return fs.statSync(path.join(wcParentDir, fsItem)).isDirectory(); // filter dirs from files
    }).map((wcDir) => {
      return path.join(wcParentDir, wcDir); // map absolute path from dir name
    })

  console.log(wcDirs);

  wcDirs.forEach((wcDir) => {
    const wcName = path.basename(wcDir);
    console.log(`CHECKING WC: ${wcName}...`);

    // check if wcDirs contains html,css,js
    const wcFiles = fs.readdirSync(wcDir, {withFileType: true})
    console.log(wcFiles);

    if (
      wcFiles.find((wcFile) => wcFile == `${wcName}.css`) &&
      wcFiles.find((wcFile) => wcFile == `${wcName}.html`) &&
      wcFiles.find((wcFile) => wcFile == `${wcName}.js`) 
    ) {
      console.log("WC HAS HTML,CSS,JS, PROCEEDING...\n");

      // init file names
      const markupPath = path.join(wcDir, `${wcName}.html`);
      const stylesPath = path.join(wcDir, `${wcName}.css`);
      const scriptPath = path.join(wcDir, `${wcName}.js`);
    
      // build single, injectable script from html,css,js
      src(scriptPath)
        .pipe(replace(/{{gulp-style}}/, fs.readFileSync(stylesPath)))
        .pipe(replace(/{{gulp-markup}}/, fs.readFileSync(markupPath)))
        .pipe(rename("script.js"))
        .pipe(dest(wcDir));
          
    } else {
      console.error("ERROR: WC DOESN'T HAVE HTML,CSS,JS\n");
    }
  });
  
  cb();
}

export default function () {
  watch(["src/web-components/**/*", "!src/web-components/**/script.js"], { delay: 1000, events: "change" }, buildWebComponents);

}