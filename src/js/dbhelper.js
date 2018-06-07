/**
 * Common database helper functions.
 */
import idb from 'idb';

class DBHelper {
  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */

  constructor() {
    // Change this to your server port
    const port = 1337;
    this.DATABASE_URL = `http://localhost:${port}/restaurants`;

    function createDB() {
      if (!('indexedDB' in window)) {
        return null;
      }
      return idb.open('restaurant-reviews-db', 1, upgradeDb => {
        if (!upgradeDb.objectStoreNames.contains('RR-restaurants')) {
          upgradeDb.createObjectStore('RR-restaurants', { keyPath: 'id' });
        }
      });
    }

    this.dbPromise = createDB();
  }

  saveRestaurantsData(events) {
    if (!('indexedDB' in window)) {
      return null;
    }
    return this.dbPromise.then(db => {
      const transaction = db.transaction('RR-restaurants', 'readwrite');
      const store = transaction.objectStore('RR-restaurants');
      return Promise.all(events.map(event => store.put(event))).catch(() => {
        transaction.abort();
        throw Error('Restaurants data was not stored in indexedDB');
      });
    });
  }

  getAllRestaurantsFromServer() {
    return fetch(this.DATABASE_URL).then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    });
  }

  /**
   * Fetch all restaurants.
   */
  fetchRestaurants(callback) {
    this.getAllRestaurantsFromServer()
      .then(data => {
        // eslint-disable-next-line no-console
        console.log(data);
        callback(null, data);
        this.saveRestaurantsData(data);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log(`Network has failed. Error: ${error}`);
        if (!('indexedDB' in window)) {
          return null;
        }
        return this.dbPromise
          .then(db => {
            const transaction = db.transaction('RR-restaurants', 'readonly');
            const store = transaction.objectStore('RR-restaurants');
            return store.getAll();
          })
          .then(data => {
            if (!data.length) {
              callback('Offline, no data stored localy', null);
            } else {
              callback(null, data);
            }
          });
      });

    /*  const xhr = new XMLHttpRequest();
    xhr.open('GET', this.DATABASE_URL);
    xhr.onload = () => {
      if (xhr.status === 200) {
        // Got a success response from server!
        const json = JSON.parse(xhr.responseText);
        const restaurants = json;
        callback(null, restaurants);
      } else {
        // Oops!. Got an error from server.
        const error = `Request failed. Returned status of ${xhr.status}`;
        callback(error, null);
      }
    };
    xhr.send(); */
  }

  /**
   * Fetch a restaurant by its ID.
   */
  fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    this.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) {
          // Got the restaurant
          callback(null, restaurant);
        } else {
          // Restaurant does not exist in the database
          callback(`Restaurant with ${id}  does not exist`, null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    this.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type === cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    this.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood === neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    this.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants;
        if (cuisine != 'all') {
          // filter by cuisine
          results = results.filter(r => r.cuisine_type === cuisine);
        }
        if (neighborhood != 'all') {
          // filter by neighborhood
          results = results.filter(r => r.neighborhood === neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  fetchNeighborhoods(callback) {
    // Fetch all restaurants
    this.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) === i);
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  fetchCuisines(callback) {
    // Fetch all restaurants
    this.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) === i);
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return `./restaurant.html?id=${restaurant.id}`;
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    if (!restaurant.photograph) {
      return `/img/PhotoNotAvailable.jpg`;
    }
    return `/img/${restaurant.photograph}.jpg`;
  }

  /**
   * Restaurant image placeholder URL.
   */
  static imagePlaceholderUrlForRestaurant(restaurant) {
    if (!restaurant.photograph) {
      return `/img/placeholders/PhotoNotAvailable.jpg`;
    }
    return `/img/placeholders/${restaurant.photograph}.jpg`;
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map,
      animation: google.maps.Animation.DROP
    });
    return marker;
  }

  /**
   * Register service worker.
   */
  static registerServiceWorker() {
    // register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then(registration => {
            // Registration was successful
            // eslint-disable-next-line no-console
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch(err => {
            // Registration failed :(
            // eslint-disable-next-line no-console
            console.log('ServiceWorker registration failed: ', err);
          });
      });
    }
  }
}

export default DBHelper;
