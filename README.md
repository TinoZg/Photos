# Photos

Node.js application that creates folder structure from photos and moves them in corresponding folder according to time a photo was taken. Only works for jpg and jpeg.

## Getting started

1. Put all unsorted images in the directory specified by the variable `photosDirectory` inside `index.js`. The code doesn't work recursively i.e. all photos must be in the specified path. Example for specifying the path

```js
const photosDirectory = path.join('E:/', 'SomeDirectory', 'file.jpg');
// Outputs: E:\SomeDirectory\file.jpg on Windows
console.log(photosDirectory);
```

2. Make sure you have [node.js](https://nodejs.org/en/download/package-manager) installed. Code is tested with v20.15.0
3. `cd` to working directory and run `npm install`
4. Run the code with `node index.js`
