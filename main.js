const path = require("path");
const readline = require("readline");
const { EOL } = require('os');
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author: Eduardo Eriyo Hirai
 *
 */

const IOhandler = require("./IOhandler"); //All logic goes here
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathGrayscale = path.join(__dirname, "grayscaled");
const pathSepia = path.join(__dirname, "sepia");

async function main() {
    try{
        await IOhandler.unzip(zipFilePath, pathUnzipped);
        const files = await IOhandler.readDir(pathUnzipped);
        const user = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        user.question(`Which filter do you want to apply?${EOL}1-Grayscale${EOL}2-Sepia${EOL}`, function(answer) {
            if (answer == 1) {
                IOhandler.grayScale(files, pathGrayscale);
                user.close();
            } else if (answer == 2) {
                IOhandler.sepia(files, pathSepia);
                user.close();
            } else {
                console.log("Invalid option.")
                user.close();
            }
        });
    } catch(err) {
        console.log(err);
    }
}

main();
