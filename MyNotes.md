## Corriculum
### Stage 1

* Why Responsive?
* Starting Small
* Building Up
* Common Responsive Patterns
* Optimizations
* Getting Up and Running
* Units, Formats, Environments
* Images with Markup
* Full Responsiveness
* Accessibility Over 
* Focus
* Semantics Basics
* Navigating Content
* ARIA
* Style
* The Benefits of Offline First
* Introducing the Service Worker
* project

 ### Stage 2 

* Ajax with XHR
* Ajax with jQuery
* Ajax with Fetch
* Syntax
* Functions
* Built-ins
* Professional Developer-fu
* IndexedDB and Caching
* Introducing Web Tooling and Automation
* Productive Editing
* Powerful Builds
* Expressive Live Editing
* How to Prevent Disasters
* Awesome Optimizations
* Web Tooling and Automation Conclusion
* Restaurant Reiews App—Stage 2

 ### Stage 3

*  HTTP's Request/Response Cycle
*  HTTP/1
*  HTTPS
*  HTTP/2
*  Security
*  Requests & Responses
*  The Web from Python
*  HTTP in the Real World
*  The Critical Rendering Path
*  App Lifecycles
*  Weapons of Jank Destruction
*  JavaScript
*  Styles and Layout
*  Compositing and Painting
*  Restaurant Reviews App—Stage 3


## This might come usefull

Note that styles.css is bundled only through index.js and not throughe restaurant_info.js because we use the same css file for both. Because of that styles.css is linked in restaurant.html templete file.


[Completely CSS: Custom checkboxes, radio buttons and select boxes](https://kyusuf.com/post/completely-css-custom-checkbox-radio-buttons-and-select-boxes)

[Configure Prettier and ESLint in Visual Studio Code](https://www.39digits.com/configure-prettier-and-eslint-in-visual-studio-code/)

Webpack

https://hackernoon.com/a-tale-of-webpack-4-and-how-to-finally-configure-it-in-the-right-way-4e94c8e7e5c1

Critical css

this plugin didn't work https://vuejsdevelopers.com/2017/07/24/critical-css-webpack/#disqus
this plugin did work but broke the dev server https://medium.com/wizardnet972/https-medium-com-wizardnet972-make-your-page-rendering-faster-e14a95747c7a


Performance
https://blog.prototypr.io/getting-up-to-speed-with-high-performance-web-58b740042892

Responsive images
https://medium.freecodecamp.org/learn-webpack-by-example-blurred-placeholder-images-4ad8b1751709

imagemin-mozjpeg ni delal dokler nisem inštaliral
```sudo apt-get install libpng16-dev```
glej [issue](https://github.com/imagemin/imagemin-mozjpeg/issues/28#issuecomment-377131250)

Intersection observer
This implementation has problems with promises witch don't play well with filter restaurants feature. Also it does not unobserve image
when the image get's loaded.
https://scotch.io/tutorials/lazy-loading-images-for-performance-using-intersection-observer#comments-section

I used this implementation
https://www.smashingmagazine.com/2018/01/deferring-lazy-loading-intersection-observer-api/
