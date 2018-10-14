function createMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 42.352271, lng: -71.05524200000001},
        zoom: 14,
        });

    var marker = new google.maps.Marker({
          position: {lat: 42.352271, lng: -71.05524200000001},
          map: map,
          title: 'South Station'
        });
}
