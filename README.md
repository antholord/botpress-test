# botpress-test

## Details
This project is a File explorer tool made for Botpress.
I decided to use electron because I have experience with it and I think it suits the task perfectly. I also used a starter boilerplate that might look daunting but I used it because I am familiar with it and it saved me time.

For the backend part, all of my code is in ``` directoryService.ts ``` . All of the rest is auto-generated boilerplate.



I used ``` chokidar ``` to track file changes in the directories. However, the format it gave me was not useful to generate a tree. I decided to use a library that transformed it into the perfect format, ``` directory-tree ```

I could have formatted the tree myself by going through the list of files recursively and creating arrays of children, but I opted for a library.

The downside of my approach is that when a file is modified, I have to re-compute the full directory tree. I am aware that it is not ideal but after testing, it was quite fast and sufficient. If I built the directory tree structure myself, I could have sent only the updated path when a change occurs.

## Project setup
```
npm i
```

## Run with electron
```
npm run electron:serve ./testDirectory
```
You can put multiple directories back to back as arguments. I added a simple testDirectory in the project for demonstration.

