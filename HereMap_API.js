//reading api key from file
const reader = new FileReader();
var apikey = reader.readAsText('api_key.txt');

// Create a Platform object (one per application):
var platform = new H.service.Platform({
  'apikey': 'q_v_vWPuLzhzziK79gx-Pv_IG5LNbyW0zXVsGyGcjPs'
});

// Get an object containing the default map layers:
var defaultLayers = platform.createDefaultLayers();

// Instantiate the map using the vecor map with the
// default style as the base layer:
var map = new H.Map(document.getElementById('mapContainer'),
  defaultLayers.vector.normal.map,
  {
    zoom: 10,
    center: { lat: 52.5, lng: 13.4 }
  });

// Enable the event system on the map instance:
var mapEvents = new H.mapevents.MapEvents(map);

// Instantiate the default behavior, providing the mapEvents object:
var behavior = new H.mapevents.Behavior(mapEvents);

map.addEventListener('tap', (event) => {
  // Getting the position of the click
  const clickedCoords = map.screenToGeo(event.currentPointer.viewportX, event.currentPointer.viewportY);
  // Getting the address of the clicked position
  fetch('https://revgeocode.search.hereapi.com/v1/revgeocode?at=' + clickedCoords.lat + ',' + clickedCoords.lng + '&apiKey=q_v_vWPuLzhzziK79gx-Pv_IG5LNbyW0zXVsGyGcjPs')
    .then(response => response.json())
    .then(data => {
      // Getting the address
      var address = data['items'][0]['address'];
      // Setting the address in the text box
      document.getElementById('clickedLocation').innerText = address['label'];
    })
});


var search_btn = document.getElementById('searchButton');

search_btn.addEventListener('click', function () {
  var sQuery = document.getElementById('searchText').value;
  fetch('https://geocode.search.hereapi.com/v1/geocode?q=' + sQuery + '&apiKey=q_v_vWPuLzhzziK79gx-Pv_IG5LNbyW0zXVsGyGcjPs')
  .then(response => response.json())
  .then(data => {
    var coord = data['items'][0]['position'];
    map.addObject(new H.map.Marker(coord, {icon: createCustomIcon()}));
    map.setCenter({lat: coord['lat'], lng: coord['lng']});
  })
  .catch(error => console.log(error));
});


function createCustomIcon() {
  var svg = '<svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' +
    'width="24px" height="24px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">' +
    '<g><path fill="#F76D57" d="M32,52.789l-12-18C18.5,32,16,28.031,16,24c0-8.836,7.164-16,16-16s16,7.164,16,16 c0,4.031-2.055,8-4,10.789L32,52.789z"/><g>' +
    '<path fill="#394240" d="M32,0C18.746,0,8,10.746,8,24c0,5.219,1.711,10.008,4.555,13.93c0.051,0.094,0.059,0.199,0.117,0.289' +
    'l16,24C29.414,63.332,30.664,64,32,64s2.586-0.668,3.328-1.781l16-24c0.059-0.09,0.066-0.195,0.117-0.289' +
    'C54.289,34.008,56,29.219,56,24C56,10.746,45.254,0,32,0z M44,34.789l-12,18l-12-18C18.5,32,16,28.031,16,24' +
    'c0-8.836,7.164-16,16-16s16,7.164,16,16C48,28.031,45.945,32,44,34.789z"/>' +
    '<circle fill="#394240" cx="32" cy="24" r="8"/></g></g></svg>';
  return new H.map.Icon(svg);
}
