function createMap() {
    var mapOptions = {
        center: new google.maps.LatLng(42.352271, -71.05524200000001),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.HYBRID
    }
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
}
