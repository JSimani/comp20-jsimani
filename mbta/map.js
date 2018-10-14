function createMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 42.352271, lng: -71.05524200000001},
        zoom: 14,
        });


    var image = {
        url: "icon.png",
        scaledSize: new google.maps.Size(25, 25), 
        origin: new google.maps.Point(0,0), 
        anchor: new google.maps.Point(0, 0) 
    };

    var stops = [
        ['South Station', 42.352271, -71.05524200000001, 'place-sstat'],
        ['Andrew', 42.330154, -71.057655, 'place-andrw'],
        ['Porter Square', 42.3884, -71.11914899999999, 'place-portr'],
        ['Harvard Square', 42.373362, -71.118956, 'place-harsq'],
        ['JFK/UMass', 42.320685, -71.052391, 'place-jfk'],
        ['Savin Hill', 42.31129, -71.053331, 'place-shmnl'],
        ['Park Street', 42.35639457, -71.0624242, 'place-pktrm'],
        ['Broadway', 42.342622, -71.056967, 'place-brdwy'],
        ['North Quincy', 42.275275, -71.029583, 'place-nqncy'],
        ['Shawmut', 42.29312583, -71.06573796000001, 'place-smmnl'],
        ['Davis', 42.39674, -71.121815, 'place-davis'],
        ['Alewife', 42.395428, -71.142483, 'place-alfcl'],
        ['Kendall/MIT', 42.36249079, -71.08617653, 'place-knncl'],
        ['Charles/MGH', 42.361166, -71.070628, 'place-chmnl'],
        ['Downtown Crossing', 42.355518, -71.060225, 'place-dwnxg'],
        ['Quincy Center', 42.251809, -71.005409, 'place-qnctr'],
        ['Quincy Adams', 42.233391, -71.007153, 'place-qamnl'],
        ['Ashmont', 42.284652, -71.06448899999999, 'place-asmnl'],
        ['Wollaston', 42.2665139, -71.0203369, 'place-wlsta'],
        ['Fields Corner', 42.300093, -71.061667, 'place-fldcr'],
        ['Central Square', 42.365486, -71.103802, 'place-cntsq'],
        ['Braintree', 42.2078543, -71.0011385, 'place-brntn']
    ];

    createMarkers(map, image, stops);
    createPaths(map, stops);
}

function createMarkers(map, image, stops) {
    for (var i = 0; i < stops.length; i++) {
        stop = stops[i];
        var marker = new google.maps.Marker({
            position: {lat: stop[1], lng: stop[2]},
            map: map,
            animation: google.maps.Animation.DROP,
            icon: image,
            title: stop[0]
        });
    }
    
}

function createPaths(map, stops) {
    var trainPathCoordinates = [];

    for (var i = 0; i < stops.length; i++) {
        var currentStop = {lat: stops[i][1], lng: stops[i][2]}
        trainPathCoordinates.push(currentStop);
    }

    console.log(trainPathCoordinates);

    var trainPath = new google.maps.Polyline({
          path: trainPathCoordinates,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });

    trainPath.setMap(map);


}