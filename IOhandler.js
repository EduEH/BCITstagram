/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author: Eduardo Eriyo Hirai
 *
 */

const { pipeline } = require("stream/promises");
const yauzl = require("yauzl-promise"),
  fs = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = async (pathIn, pathOut) => {
  const zip = await yauzl.open(pathIn);
  try {
    for await (const entry of zip) {
      if (entry.filename.endsWith('/')) {
        await fs.promises.mkdir(`${pathOut}/${entry.filename}`);
      } else {
        const readStream = await entry.openReadStream();
        const writeStream = fs.createWriteStream(
          `${pathOut}/${entry.filename}`
        );
        await pipeline(readStream, writeStream);
      }
    }
    console.log("Extraction operation complete");
  } finally {
    await zip.close();
  }
}; 

/**
 * Description: read all the png files (ONLY PNG) from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  return new Promise((resolve, reject)=>{
    fs.readdir(dir, (err, images) => {
      if (err) {
        reject(err)
      } else {
        let imagesList = []
        for(const file of images){
          if(path.extname(file) == ".png"){  
            imagesList.push(`${__dirname}/unzipped/${file}`)
          }
        }
        resolve(imagesList)
      }
    })
  })
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  for (const file of pathIn){
    fs.createReadStream(file)
  .pipe(
    new PNG({
      filterType: 4,
    })
  )
  .on("parsed", function () {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const segment = (y * 4) * this.width + x * 4;
        const avg = (this.data[segment] + this.data[segment + 1] + this.data[segment + 2]) / 3;
        this.data[segment] = avg;
        this.data[segment + 1] = avg;
        this.data[segment + 2] = avg;
      }
    }
    const filePath = file.split("/");
    this.pack().pipe(fs.createWriteStream(`${pathOut}/${filePath.slice(-1).pop()}`));
  });
  }
};

const sepia = (pathIn, pathOut) => {
  for (const file of pathIn){
    fs.createReadStream(file)
  .pipe(
    new PNG({
      filterType: 4,
    })
  )
  .on("parsed", function () {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const idx = (this.width * y + x) << 2;
        const r = this.data[idx];
        const g = this.data[idx + 1];
        const b = this.data[idx + 2];
        this.data[idx] = Math.min(255, (0.393 * r + 0.769 * g + 0.189 * b));
        this.data[idx + 1] = Math.min(255, (0.349 * r + 0.686 * g + 0.168 * b));
        this.data[idx + 2] = Math.min(255, (0.272 * r + 0.534 * g + 0.131 * b));
      }
    }
    const filePath = file.split("/");
    this.pack().pipe(fs.createWriteStream(`${pathOut}/${filePath.slice(-1).pop()}`));
  });
  }
};
module.exports = {
  unzip,
  readDir,
  grayScale,
  sepia,
};
