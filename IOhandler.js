/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */

const yauzl = require("yauzl-promise"), //CHANGE YO YAUZL. Chekc documentation to see how works
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
  } finally {
    await zip.close();
  }
}; //PATHiN IS WHERE FILES ARE, out is where they go

/**
 * Description: read all the png files (ONLY PNG) from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {};
//pngjs
//In this.data, "this" refers to your image, equivalent to self
//var idx = (this.width * y + x) << 2

module.exports = {
  unzip,
  readDir,
  grayScale,
};
