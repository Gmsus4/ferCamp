mapboxgl.accessToken = 'pk.eyJ1IjoiZ21zdXM0IiwiYSI6ImNsaWdibDg0bzBreWwzY21zdXQwenBxd3EifQ.m8lBMPzyuXxNs9NULEZUmQ';
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v12', // style URL
center: campground.geometry.coordinates, // starting position [lng, lat]
zoom: 8, // starting zoom
});

new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.addTo(map);