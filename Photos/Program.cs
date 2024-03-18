using MetadataExtractor;
using System.Drawing;
using System.IO;
using Directory = System.IO.Directory;

namespace Photos
{
    internal class Program
    {
        static void Main(string[] args)
        {
            string photosFolderPath = @"C:\Users\Kristijan\Desktop\Photos";


            try
            {

                // Get a list of all photo files in the specified folder
                string[] photoFiles = Directory.GetFiles(photosFolderPath, "*.jpg");


                foreach (string photoFile in photoFiles)
                {
                    // Extract metadata from the photo
                    var directories = ImageMetadataReader.ReadMetadata(photoFile);


                    foreach (var directory in directories)
                    {
                        if (directory.Name != "Exif IFD0")
                        {
                            continue;
                        }
                        foreach (var tag in directory.Tags)
                        {
                            if (tag.Name != "Date/Time")
                            {
                                continue;
                            }

                            string yearFolder = tag.Description.Substring(0, 4);

                            string folderPath = Path.Combine(photosFolderPath, yearFolder);

                            if (!Directory.Exists(folderPath))
                            {
                                Directory.CreateDirectory(folderPath);

                            }
                            string monthFolder = tag.Description.Substring(5, 2);
                            folderPath = Path.Combine(folderPath, monthFolder);
                            string destinationFilePath = Path.Combine(folderPath, Path.GetFileName(photoFile));
                            if (!Directory.Exists(folderPath))
                            {
                                Directory.CreateDirectory(folderPath);
                            }
                            File.Move(photoFile, destinationFilePath);
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
        }

    }
}
