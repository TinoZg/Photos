const fs = require('fs');
const path = require('path');
const exifParser = require('exif-parser');

const supportedExtensions = ['.jpg', '.jpeg', '.png', '.mp4', '.mov'];
const photosDirectory = process.argv[2];

const targetDirectory = process.argv[3];

// Function to get the date from EXIF data
const getPhotoDate = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();

  // Only jpg and jpeg files are processed for EXIF data
  // Other formats will use the file system date
  if (ext === '.jpg' || ext === '.jpeg') {
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
  throw new Error('No date found for the picture or video!!!');
};

// Function to move a file to a new directory
const moveFile = (filePath, targetDir) => {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const fileName = path.basename(filePath);
  const targetPath = path.join(targetDir, fileName);

  // ✅ Skip if the file already exists in the target folder
  if (fs.existsSync(targetPath)) {
    console.log(`Skipping (already exists): ${fileName}`);
    return;
  }

  fs.renameSync(filePath, targetPath);
};

// Function to process the files in the source directory and move them to the specified target directory
const processFiles = (sourceDir, targetDir) => {
  fs.readdirSync(sourceDir).forEach((file) => {
    const filePath = path.join(sourceDir, file);
    if (supportedExtensions.includes(path.extname(file).toLowerCase())) {
      const photoDate = getPhotoDate(filePath);
      if (photoDate) {
        // Create subfolders under the target directory based on the photo date
        const destinationDir = path.join(targetDir, photoDate);
        moveFile(filePath, destinationDir);
      }
    }
  });
};

processFiles(photosDirectory, targetDirectory);
