# botpress-test

## Details
This project is a File explorer tool made for Botpress.
I decided to use electron because I have experience with it and I think it suits the task perfectly. I also used a starter boilerplate that might look daunting but I used it because I am familiar with it and it saved me time.

For the backend part, all of my code is in ``` directoryService.ts ``` . All of the rest is auto-generated boilerplate.



I used ``` chokidar ``` to track file changes in the directories. I used  ``` directory-tree ``` to transform the directory info into a readable directory format.

For folders containing more than 10 000 files, the update took about 1 second.


## Project setup
```
npm i
```

## Run with electron
```
npm run serve ./testDirectory
```
You can put multiple directories back to back as arguments. I added a simple testDirectory in the project for demonstration.

## Run as a stand-alone application
```
npm run build
launch ./dist_electron/botpress-test.exe
or install it by launching ./dist_electron/botpress-test Setup 0.1.0.exe
```

