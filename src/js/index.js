import DBHelper from './dbhelper';
import './../css/styles.css';
import config from './../config';

const loadGoogleMapsApi = require('load-google-maps-api');

let restaurantsGlobal;
let neighborhoodsGlobal;
let cuisinesGlobal;
let markersGlobal = [];
const dataDB = new DBHelper();

// register service worker
DBHelper.registerServiceWorker();

/**
 * Set neighborhoods HTML.
 */
const fillNeighborhoodsHTML = (neighborhoods = neighborhoodsGlobal) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
};

/**
 * Set cuisines HTML.
 */
const fillCuisinesHTML = (cuisines = cuisinesGlobal) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
};

/**
 * Fetch all neighborhoods and set their HTML.
 */
const fetchNeighborhoods = () => {
  dataDB.fetchNeighborhoods((error, neighborhoods) => {
    if (error) {
      // Got an error
      // eslint-disable-next-line no-console
      console.error(error);
    } else {
      neighborhoodsGlobal = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
};

/**
 * Fetch all cuisines and set their HTML.
 */
const fetchCuisines = () => {
  dataDB.fetchCuisines((error, cuisines) => {
    if (error) {
      // Got an error!
      // eslint-disable-next-line no-console
      console.error(error);
    } else {
      cuisinesGlobal = cuisines;
      fillCuisinesHTML();
    }
  });
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
const resetRestaurantsHTML = () => {
  // Remove all restaurants
  restaurantsGlobal = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';
};

const resetRestaurantsMap = restaurants => {
  // Remove all map markers
  markersGlobal.forEach(m => m.setMap(null));
  markersGlobal = [];
  restaurantsGlobal = restaurants;
};
/**
 * Create restaurant HTML.
 */
const createRestaurantHTML = restaurant => {
  const li = document.createElement('li');

  const div = document.createElement('div');
  div.className = 'restaurant-card';
  li.append(div);

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imagePlaceholderUrlForRestaurant(restaurant);
  image.dataset.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.alt = `${restaurant.name}'s cover photo`;
  div.append(image);

  const name = document.createElement('h2');
  name.innerHTML = restaurant.name;
  div.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  div.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  div.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.setAttribute('aria-label', `View Details on ${restaurant.name}`);
  more.href = DBHelper.urlForRestaurant(restaurant);
  div.append(more);

  return li;
};

/**
 * Add markers for current restaurants to the map.
 */
const addMarkersToMap = (restaurants = restaurantsGlobal, map) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, map);
    marker.addListener(marker, 'click', () => {
      window.location.href = marker.url;
    });
    markersGlobal.push(marker);
  });
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
const fillRestaurantsHTML = (restaurants = restaurantsGlobal) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  restaurantsGlobal = restaurants;
  // addMarkersToMap();
};

/**
 * Initialize Google map, called from HTML.
 */

const initMap = maps => {
  const loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  const map = new maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  // window.updateRestaurants();

  resetRestaurantsMap(restaurantsGlobal);
  addMarkersToMap(restaurantsGlobal, map);
};

/**
 * Intersection observer
 */

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
        if (src) {
          img.src = src;
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

const addIntersectionObserverForMap = () => {
  const mapContainer = document.getElementById('map-container');
  const options = {
    rootMargin: '400px',
    threshold: 0
  };

  const observer3 = new IntersectionObserver((entries, self) => {
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

  observer3.observe(mapContainer);
};

const addIntersectionObserverForBox = () => {
  const box = document.querySelectorAll('.box');
  const options = {
    rootMargin: '400px',
    threshold: 0
  };

  const observer4 = new IntersectionObserver((entries, self) => {
    const isIntersecting =
      typeof entries[0].isIntersecting === 'boolean'
        ? entries[0].isIntersecting
        : entries[0].intersectionRatio > 0;
    if (isIntersecting) {
      console.log(entries[0]);
      console.log('is intersecting box');
      // Stop watching and load the image
      self.unobserve(entries[0].target);
    }
  }, options);

  observer4.observe(box[0]);
};

/**
 * Update page and map for current restaurants.
 */
window.updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  dataDB.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) {
      // Got an error!
      // eslint-disable-next-line no-console
      console.error(error);
    } else {
      resetRestaurantsHTML();
      fillRestaurantsHTML(restaurants);
      addIntersectionObserverForImages();
    }
  });
};

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', event => {
  fetchNeighborhoods(event);
  fetchCuisines(event);
  window.updateRestaurants();

  addIntersectionObserverForMap();
  addIntersectionObserverForBox();
});
