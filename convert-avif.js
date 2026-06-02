const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const inputDir = "./assets/images-avif-todo";
const outputDir = "./assets/images-avif-done";

fs.mkdirSync(outputDir, { recursive: true });

const files = fs
  .readdirSync(inputDir)
  .filter((f) => /\.(jpg|jpeg|png)$/i.test(f));

(async () => {
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputName = path.parse(file).name + ".avif";
    const outputPath = path.join(outputDir, outputName);

    await sharp(inputPath).avif({ quality: 80 }).toFile(outputPath);

    console.log(`✓ ${file} → ${outputName}`);
  }
  console.log(`\nDone! ${files.length} images converted.`);
})();
