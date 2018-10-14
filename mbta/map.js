function createMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 42.352271, lng: -71.05524200000001},
        zoom: 14,
        });

    var image = {
    url: "icon.png",
    // This marker is 20 pixels wide by 32 pixels high.
    scaledSize: new google.maps.Size(25, 25), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
  };

    var marker = new google.maps.Marker({
          position: {lat: 42.352271, lng: -71.05524200000001},
          map: map,
          animation: google.maps.Animation.DROP,
          icon: image,
          title: 'South Station'
        });
    marker.addListener('click', toggleBounce);
}

// var beaches = [
//   ['Bondi Beach', -33.890542, 151.274856, 4],
//   ['Coogee Beach', -33.923036, 151.259052, 5],
//   ['Cronulla Beach', -34.028249, 151.157507, 3],
//   ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
//   ['Maroubra Beach', -33.950198, 151.259302, 1]
// ];