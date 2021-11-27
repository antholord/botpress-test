# botpress-test

## Details
This project is a File explorer tool made for Botpress.
I decided to use electron because I have experience with it and I think it suits the task perfectly. I also used a starter boilerplate that might look daunting but I used it because I am familiar with it and it saved me time.

For the backend part, all of my code is in ``` directoryService.ts ```.


I used ``` chokidar ``` to track file changes in the directories.
The tool only watches for file changes in the directories currently open, so performance is great even for very large directories.

I added a feature to add one or more folders with a button.

## Project setup
```
npm i
```

## Run the development version
```
npm run serve ./testDirectory
```
You can put multiple directories back to back as arguments. I added a simple testDirectory in the project for demonstration. You can also pass no directories at all. 

If the directory has spaces in it, add '' between. ex: (npm run serve 'C:/s p a c e/')

## Run as a stand-alone application
```
npm run build
launch ./dist_electron/botpress-test.exe
or install it by launching ./dist_electron/botpress-test Setup 0.1.0.exe
```

