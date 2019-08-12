# Colormap-To-Image
Converts RGB array colormaps into PNG images.

# Usage
---------
* Install node and npm.
* Clone repo.
* Run `npm ci` to install dependencies.
* Copy your colormap to colormap.txt.
* Run `node arrayToColormap.js --help` to see available options.

---------
```bash
$ node arrayToColormap.js --help
Options:
  --version   Show version number                                      [boolean]
  --colormap  Path to the colormap array.
                           [string] [required] [default: "colormap_example.txt"]
  --width     Width of output image.         [number] [required] [default: 1024]
  --height    Height of output image.         [number] [required] [default: 512]
  --output    Output path.           [string] [required] [default: "output.png"]
  --help      Show help                                                [boolean]
```


## TODO
-----
* Add additional interpolation variations
* Support additional colorspaces
* Convert png to colormap array
* Support rotated image with autodetection for image input
* Support jpg, svg (using linearGradient), ...
