
This might come usefull

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