# Mobile Web Specialist Certification Course
---
#### _Three Stage Course Material Project - Restaurant Reviews_

## Project Overview:

This is  **Restaurant Reviews** projects that is being incrementally converted from a static webpage to a mobile-ready web application during my Udacity's Mobile Web Specialist course training.

## Installation

Clone this repository and run
```
  npm install
```

### Google Maps API key

Obtain Google Maps API key from Google's cloud developer portal and copy it into `src/config.sample.js` file and rename the file to `config.js`.

### Backend server

Application gets the data from [server](https://github.com/udacity/mws-restaurant-stage-2) that listens to requests on `http://localhost:1337`. If you are not runing the backend server on `localhost` you can change setting in `src/js/dbhelper.js`

### Development server

 During development start development server with
 ```
   npm run start
  ```


### Production build

Make production build of the aplication by running

 ```
 npm run build
 ```

 The output of the build is in the `dist` folder.

## TODO Stages

- [x] Stage 1
- [ ] Stage 2
- [ ] Stage 3


### Note about ES6

Most of the code in this project has been written to the ES6 JavaScript specification for compatibility with modern web browsers and future proofing JavaScript code. As much as possible, try to maintain use of ES6 in any additional JavaScript you write.



