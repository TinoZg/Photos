# Photos

Node.js application that creates folder structure from photos/videos and moves them in corresponding folder according to time a photo was taken, e.g 2025-01.

## Getting started

1. Put all unsorted images and videos in some directory. The code doesn't work recursively i.e. all photos must be in the specified path and there should be no subfolders
2. Make sure you have [node.js](https://nodejs.org/en/download/package-manager) installed. Code is tested with v20.15.0
3. `cd` to working directory and run `npm install`
4. Run the code with the following command where `inputDir` is the folder with unsorted photos/videos and `outputDir` is the destination folder

```bash
node index.js inputDir outputDir
```
