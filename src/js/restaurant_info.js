import DBHelper from './dbhelper';
import config from './../config';

const loadGoogleMapsApi = require('load-google-maps-api');

let restaurantGlobal;
const dataDB = new DBHelper();

const addReviewtButton = document.getElementById('add-review-button');

// register service worker
DBHelper.registerServiceWorker();

/**
 * Create review HTML and add it to the webpage.
 */
const createReviewHTML = review => {
  const li = document.createElement('li');

  const div = document.createElement('div');
  div.className = 'rating-card';
  li.append(div);

  const divHead = document.createElement('div');
  divHead.className = 'rating-card-published';
  div.append(divHead);

  const name = document.createElement('p');
  name.className = 'reviewer';
  name.innerHTML = review.name;
  divHead.appendChild(name);

  const date = document.createElement('p');
  date.className = 'date';
  date.innerHTML = review.updatedAt;
  divHead.appendChild(date);

  const rating = document.createElement('p');
  rating.className = 'rating';
  rating.innerHTML = `Rating: ${review.rating}`;
  div.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  div.appendChild(comments);

  return li;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
const fillBreadcrumb = (restaurant = restaurantGlobal) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  li.setAttribute('aria-current', 'page');
  breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
const fillRestaurantHoursHTML = (operatingHours = restaurantGlobal.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (const key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
const fillReviewsHTML = (reviews = restaurantGlobal.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
};

/**
 * Create restaurant HTML and add it to the webpage
 */
const fillRestaurantHTML = (restaurant = restaurantGlobal) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img';
  image.alt = `${restaurant.name}'s cover photo`;
  // image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.src = DBHelper.imagePlaceholderUrlForRestaurant(restaurant);
  image.dataset.src = DBHelper.imageUrlForRestaurant(restaurant);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
};
/**
 * Initialize Google map, called from HTML.
 */

const initMap = maps => {
  const map = new maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: restaurantGlobal.latlng,
    scrollwheel: false
  });
  DBHelper.mapMarkerForRestaurant(restaurantGlobal, map);
};

/**
 * Intersection observer
 */

const addIntersectionObserverForMap = () => {
  const mapContainer = document.getElementById('map-container');
  const options = {
    rootMargin: '0px 0px 0px 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries, self) => {
    const isIntersecting =
      typeof entries[0].isIntersecting === 'boolean'
        ? entries[0].isIntersecting
        : entries[0].intersectionRatio > 0;
    if (isIntersecting) {
      console.log(entries[0]);
      console.log('is intersecting');
      loadGoogleMapsApi({ key: config.GOOGLE_MAPS_API_KEY })
        .then(googleMaps => {
          initMap(googleMaps);

          /* const loc = {
    lat: 40.722216,
    lng: -73.987501
  };

  self.map = new googleMaps.Map(document.getElementById('map'), {
    center: loc,
    zoom: 12,
    scrollwheel: false
  });

  resetRestaurantsMap(restaurantsGlobal);
  addMarkersToMap(restaurantsGlobal); */
        })
        .catch(error => {
          console.error(error);
        });
      // Stop watching and load the image
      self.unobserve(entries[0].target);
    }
  }, options);

  observer.observe(mapContainer);
};

const addIntersectionObserverForImages = () => {
  const images = document.querySelectorAll('[data-src]');
  const options = {
    rootMargin: '0px 0px 50px 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries, self) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute('data-src');
        console.log(src);
        // console.log(entry);
        if (src) {
          img.src = src;
          // I can add intersection observer for the map only after image has loaded
          // otherwise if there is no image yet the map element is inside observation box
          addIntersectionObserverForMap();
        }
        // Stop watching and load the image
        self.unobserve(entry.target);
      }
    });
  }, options);

  images.forEach(image => {
    observer.observe(image);
  });
};

/**
 * Get current restaurant from page URL.
 */
const fetchRestaurantFromURL = callback => {
  if (restaurantGlobal) {
    // restaurant already fetched!
    callback(null, restaurantGlobal);
    return;
  }
  const id = getParameterByName('id');
  if (!id) {
    // no id found in URL
    const error = 'No restaurant id in URL';
    callback(error, null);
  } else {
    dataDB.fetchRestaurantById(id, (error, restaurant) => {
      restaurantGlobal = restaurant;
      if (!restaurant) {
        // eslint-disable-next-line no-console
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      addIntersectionObserverForImages();
      callback(null, restaurant);
    });
  }
};

const addAndPostReview = e => {
  e.preventDefault();
  const data = {
    restaurant_id: restaurantGlobal.id,
    name: document.getElementById('reviewer_name').value,
    rating: document.getElementById('rating').valueAsNumber,
    comments: document.getElementById('comment_text').value
  };
  // TODO: updateReviewsList([data]);
  // saveReviewToDB([data]);

  const headers = new Headers({ 'Content-Type': 'application/json' });
  const body = JSON.stringify(data);
  console.log(body);
  return fetch('http://localhost:1337/reviews/', {
    method: 'POST',
    headers,
    body
  });
};

addReviewtButton.addEventListener('click', addAndPostReview);

document.addEventListener('DOMContentLoaded', event => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) {
      // Got an error!
      // eslint-disable-next-line no-console
      console.error(error);
    } else {
      restaurantGlobal = restaurant;
      fillBreadcrumb();
    }
  });
});
