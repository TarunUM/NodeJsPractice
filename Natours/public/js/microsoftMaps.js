const locations = JSON.parse(document.getElementById('map').dataset.locations);

function GetMap() {
  var avg_latt = 0;
  var avg_long = 0;

  for (i = 0; i < locations.length; i++) {
    avg_latt += locations[i].coordinates[1];
    avg_long += locations[i].coordinates[0];
  }
  avg_latt = avg_latt / locations.length;
  avg_long = avg_long / locations.length;

  var map = new Microsoft.Maps.Map('#map', {
    credentials:
      'AkJHgQXycn-JpKbK_LaqSN-86hir2btx7BrhwFKfJj70ZWyBrpqKAAnjuZEgynaJ',
    center: new Microsoft.Maps.Location(avg_latt, avg_long),
    mapTypeId: Microsoft.Maps.MapTypeId.grayscale,
    zoom: 8,
    showDashboard: false,
    offset: new Microsoft.Maps.Point(0, -1000),
  });

  //Add your post map load code here.
  var center = map.getCenter();

  locations.forEach((locss) => {
    /* Creating a new location object, creating a new pushpin object, and adding the pin to the map. */
    loc = new Microsoft.Maps.Location(
      locss.coordinates[1],
      locss.coordinates[0]
    );
    pin = new Microsoft.Maps.Pushpin(loc, {
      color: 'green',
      draggable: false,
    });
    map.entities.push(pin);
    console.log(locss);
    /* Creating a new infobox object for each location. */
    var infobox = new Microsoft.Maps.Infobox(loc, {
      title: locss.description,
      offset: new Microsoft.Maps.Point(0, 3),
    });

    //Assign the infobox to a map instance.
    infobox.setMap(map);
  });
}

GetMap();
