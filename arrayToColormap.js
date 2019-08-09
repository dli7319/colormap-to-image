const yargs = require('yargs');
const fs = require('fs');
const readline = require('readline');
const PNG = require('pngjs').PNG;


const argv = require('yargs')
  .option({
    'colormap': {
      default: 'colormap_example.txt',
      demandOption: true,
      describe: 'Path to the colormap array.',
      type: 'string'
    },
    'width': {
      default: 1024,
      demandOption: true,
      describe: 'Width of output image.',
      type: 'number'
    },
    'height': {
      default: 512,
      demandOption: true,
      describe: 'Height of output image.',
      type: 'number'
    },
    'output': {
      default: 'output.png',
      demandOption: true,
      describe: "Output path.",
      type: 'string'
    }
  })
  .help()
  .argv;

main();

function main() {
  let colormapPath = argv.colormap;
  let colormapArr = parseColormap(colormapPath);
  let image = new PNG({
    width: argv.width,
    height: argv.height,
    filterType: -1
  });
  for (let i = 0; i < image.height; i++) {
    for (let j = 0; j < image.width; j++) {
      const position = j / image.width;
      const colormapIndex = position * (colormapArr.length - 1);
      const lowerIndex = Math.floor(colormapIndex);
      const higherIndex = Math.ceil(colormapIndex);
      const lerpRatio = colormapIndex - lowerIndex;

      const lowerRGB = colormapArr[lowerIndex];
      const higherRGB = colormapArr[higherIndex];

      const outputIndex = (i * image.width + j) << 2;
      image.data[outputIndex] = clamp(256 * lerp(lowerRGB[0], higherRGB[0], lerpRatio), 0, 255);
      image.data[outputIndex + 1] = clamp(256 * lerp(lowerRGB[1], higherRGB[1], lerpRatio), 0, 255);
      image.data[outputIndex + 2] = clamp(256 * lerp(lowerRGB[2], higherRGB[2], lerpRatio), 0, 255);
      image.data[outputIndex + 3] = 255;
    }
  }
  image.pack().pipe(fs.createWriteStream(argv.output));
  console.log(`Output colormap to ${argv.output}`);
}

function parseColormap(colormapPath) {
  if (!fs.existsSync(colormapPath)) {
    console.log("File does not exist");
    process.exit(-1);
  }
  const colormapArr = [];
  const matchLineRegex = /^\s*([\.\d]+)\s*([\.\d]+)\s*([\.\d]+)\d*[\n\r]+$/;
  const file = fs.readFileSync(colormapPath, 'utf-8').split('\n').filter(Boolean);
  for (let line of file) {
    match = line.match(matchLineRegex);
    if (match && match.length == 4) {
      colormapArr.push(match.slice(1, 4).map(parseFloat));
    }
  }
  return colormapArr;
}

function lerp(a, b, x) {
  return a * (1 - x) + b * x;
}

function clamp(x, a, b) {
  return Math.min(Math.max(x, a), b);
}
