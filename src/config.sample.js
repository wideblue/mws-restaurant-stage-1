(function () {
    var config = {
        GOOGLE_MAPS_API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY'
    }

    var script = document.createElement('script');
    var x = document.getElementsByTagName('script')[0];
    script.src = 'https://maps.googleapis.com/maps/api/js?key=' + config.GOOGLE_MAPS_API_KEY + '&libraries=places&callback=initMap'
    script.async = true;
    script.defer = true;
    x.parentNode.appendChild(script);
}());