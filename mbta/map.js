var map = null;
var markers = [];
var curloc = null;

var stops = [
    ['Alewife', 42.395428, -71.142483, 'place-alfcl'],
    ['Davis', 42.39674, -71.121815, 'place-davis'],
    ['Porter Square', 42.3884, -71.11914899999999, 'place-portr'],
    ['Harvard Square', 42.373362, -71.118956, 'place-harsq'],
    ['Central Square', 42.365486, -71.103802, 'place-cntsq'],
    ['Kendall/MIT', 42.36249079, -71.08617653, 'place-knncl'],
    ['Charles/MGH', 42.361166, -71.070628, 'place-chmnl'],
    ['Park Street', 42.35639457, -71.0624242, 'place-pktrm'],
    ['Downtown Crossing', 42.355518, -71.060225, 'place-dwnxg'],
    ['South Station', 42.352271, -71.05524200000001, 'place-sstat'],
    ['Broadway', 42.342622, -71.056967, 'place-brdwy'],
    ['Andrew', 42.330154, -71.057655, 'place-andrw'],
    ['JFK/UMass', 42.320685, -71.052391, 'place-jfk'],
    ['North Quincy', 42.275275, -71.029583, 'place-nqncy'],
    ['Wollaston', 42.2665139, -71.0203369, 'place-wlsta'],
    ['Quincy Center', 42.251809, -71.005409, 'place-qnctr'],
    ['Quincy Adams', 42.233391, -71.007153, 'place-qamnl'],
    ['Braintree', 42.2078543, -71.0011385, 'place-brntn'],
    ['Savin Hill', 42.31129, -71.053331, 'place-shmnl'],
    ['Fields Corner', 42.300093, -71.061667, 'place-fldcr'],
    ['Shawmut', 42.29312583, -71.06573796000001, 'place-smmnl'],
    ['Ashmont', 42.284652, -71.06448899999999, 'place-asmnl']
];

function createMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 42.352271, lng: -71.05524200000001},
        zoom: 13,
    });

    createMarkers();
    createPaths();
    getCurrentLocation();
}

function createMarkers() {
    for (var i = 0; i < stops.length; i++) {
        stop = stops[i];

        var marker = new google.maps.Marker({
            position: {lat: stop[1], lng: stop[2]},
            map: map,
            animation: google.maps.Animation.DROP,
            icon: { 
                url: "icon.png",
                scaledSize: new google.maps.Size(30, 30), 
                origin: new google.maps.Point(0,0), 
                anchor: new google.maps.Point(15, 15) 
            },
            title: stop[0],
            stop_id: stop[3]
        });

        markers.push(marker);
        addSchedule(marker);
    }
}

function createPaths() {
    var trainPathCoordinates = [];

    for (var i = 0; i < 18; i++) {
        var currentStop = {lat: stops[i][1], lng: stops[i][2]}
        trainPathCoordinates.push(currentStop);
    }

    var Braintree = new google.maps.Polyline({
          path: trainPathCoordinates,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });

    Braintree.setMap(map);

    trainPathCoordinates = [];
    var JFK = {lat: stops[12][1], lng: stops[12][2]}
    trainPathCoordinates.push(JFK);
    for (var i = 18; i < stops.length; i++) {
        var currentStop = {lat: stops[i][1], lng: stops[i][2]}
        trainPathCoordinates.push(currentStop);
    }

    var Ashmont = new google.maps.Polyline({
          path: trainPathCoordinates,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });

    Ashmont.setMap(map);
}

function getCurrentLocation() {
    var options = {
        enableHighAccuracy: true
    };

    var success = function(pos) {
        addCurrentLocation(pos)
    };

    var error = function(err) {
        console.warn('ERROR(${err.code}): ${err.message}');
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
}

function addCurrentLocation(pos) {
    var coordinates = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
    };

    map.panTo(coordinates);

    var currentLocation = new google.maps.Marker({
            position: coordinates,
            map: map,
            animation: google.maps.Animation.DROP,
            title: "Current Location"
    });

    curloc = currentLocation;
    addCurrentLocationPath();
}

function findClosestStop() {
    var closestStop = markers[0];
    var minDistance = google.maps.geometry.spherical.
                      computeDistanceBetween(curloc.position, 
                                             closestStop.position);
    for (var i = 0; i < markers.length; i++) {
        var distance = google.maps.geometry.spherical.
                       computeDistanceBetween(markers[i].position,
                                              curloc.position);

        if (distance < minDistance) {
            minDistance = distance;
            closestStop = markers[i];
        }
    }

    return closestStop;
}

function addCurrentLocationPath() {
    var closestStop = findClosestStop();
    var distance = google.maps.geometry.spherical.
                   computeDistanceBetween(closestStop.position,
                                          curloc.position);

    var pathCoordinates = [curloc.position, closestStop.position];

    var closestPath = new google.maps.Polyline({
        path: pathCoordinates,
        geodesic: true,
        strokeColor: '#228B22',
        strokeOpacity: 1.0,
        strokeWeight: 3
    });

    closestPath.setMap(map);

    var contentString = "<p>Closest Stop: " + closestStop.title + 
                        "<br>Distance: " + 
                        Number.parseFloat(distance/1609).toPrecision(2) + 
                        " miles</p>";
    var infowindow = new google.maps.InfoWindow();
    infowindow.setContent(contentString);

    curloc.addListener('click', function() {
        infowindow.open(map, curloc);
    });
}

function addSchedule(stop) {
    var stop_id = stop.stop_id;

    var request = new XMLHttpRequest();
    var message = new Object();
    var southBound = [];
    var northBound = [];

    var requestID = 
        "https://api-v3.mbta.com/predictions?filter[route]=Red&filter[stop]=" +
        stop_id + 
        "&page[limit]=10&page[offset]=0&sort=departure_time&api_key=" +
        "9829fc6ff8ab4b3b85cfb4eeb2a48a35";
    request.open("GET", requestID, true);

    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            var rawData = request.responseText;
            var schedule = JSON.parse(rawData);

            for (var i = 0; i < schedule.data.length; i++) {
                var arrival = schedule.data[i].attributes;

                if (arrival.direction_id == 0) {
                    southBound.push(new Date(arrival.arrival_time));
                } else {
                    northBound.push(new Date(arrival.arrival_time));
                }
            }

            var innerHTML = "<div id='InfoWindow'>" + 
                            "<p id=stop_name>" + stop.title + "</p>" +
                            "<p id='direction'>South Bound:</p>"+
                            "<p id='schedule'>";
            for (var i = 0; i < southBound.length; i++) {
                var minutes = southBound[i].getMinutes();
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                innerHTML += southBound[i].getHours() + ":" + minutes + "<br>";
            }
            innerHTML += "</p><p id='direction'>North Bound:</p>" + 
                         "<p id='schedule'>";
            for (var i = 0; i < northBound.length; i++) {
                var minutes = northBound[i].getMinutes();
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                innerHTML += northBound[i].getHours() + ":" + minutes + "<br>";
            }
            innerHTML += "</p></div>";

            var infowindow = new google.maps.InfoWindow();
            infowindow.setContent(innerHTML);

            stop.addListener('click', function() {
                infowindow.open(map, stop);
            });
            
            
        }
    }

    request.send();
}




