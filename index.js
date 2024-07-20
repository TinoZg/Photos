const fs = require('fs');
const path = require('path');
const exifParser = require('exif-parser');

const supportedExtensions = ['.jpg', '.jpeg', '.png'];
const photosDirectory = path.join('E:/');

// Function to get the date from EXIF data
const getPhotoDate = (filePath) => {
  if (path.extname(filePath).toLowerCase() !== '.png') {
    const buffer = fs.readFileSync(filePath);
    const parser = exifParser.create(buffer);
    const result = parser.parse();

    // Check for CreateDate first, then ModifyDate
    const dateTag = result.tags.CreateDate || result.tags.ModifyDate;

    if (dateTag) {
      const date = new Date(dateTag * 1000); // Convert from seconds to milliseconds
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are 0-based
      return `${year}-${month}`;
    }
  }

  // Fallback to file system dates if no EXIF date is not found
  const stats = fs.statSync(filePath);
  const systemDate = new Date(stats.mtime) || new Date(stats.birthtime);

  if (systemDate) {
    const systemYear = systemDate.getFullYear();
    const systemMonth = ('0' + (systemDate.getMonth() + 1)).slice(-2);
    return `${systemYear}-${systemMonth}`;
  }
  throw new Error('No date found for the picture!!!');
};

// Function to move a file to a new directory
const moveFile = (filePath, targetDir) => {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const fileName = path.basename(filePath);
  const targetPath = path.join(targetDir, fileName);
  fs.renameSync(filePath, targetPath);
};

// Function to process the files in the photos directory
const processFiles = (dir) => {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    if (supportedExtensions.includes(path.extname(file).toLowerCase())) {
      const photoDate = getPhotoDate(filePath);
      if (photoDate) {
        const targetDir = path.join(dir, photoDate);
        moveFile(filePath, targetDir);
      }
    }
  });
};

processFiles(photosDirectory);
