onload = function () {
  var atlas;
  atlas = document.getElementsByTagName('ATLAS')[0];
  placePins();
};

var mapper = {
  currentTerritory: '',
  keyOpen: false,
  lockCoords: null,
  moving: false,
  pinning: false,
};

var placePins = function () {
  var map;
  var i; var j;
  map = JSON.parse(localStorage.getItem("map"));
  amendData(map);
  for (i = 0; i < map.allNames.length; i++) {
    for (j = 0; j < map[map.allNames[i]].length; j++) {
      pin = document.createElement('PIN');
      pin.style.left = map[map.allNames[i]][j].x;
      pin.style.top = map[map.allNames[i]][j].y;
      pin.coords = {
        x: map[map.allNames[i]][j].x,
        y: map[map.allNames[i]][j].y,
      };
      pin.onmouseenter = function () {
        mapper.lockCoords = this.coords;
        console.log(this.coords);
      };
      pin.onmouseleave = function () {
        mapper.lockCoords = null;
      };
      document.body.appendChild(pin);
    }
  }
};

var amendData = function (map) {
  // console.log(map.Ontario[2]);
  // map.Ontario[2].x -= 50;
  // map.Ontario[2].y += 40;
  // var i;
  // for (i=0 ; i<map.Nunavut.length ; i++) {
  //   if (i > 83) {
  //     map.Nunavut[i].x += 59;
  //     map.Nunavut[i].y += 2;
  //   }
  //   if (i > 117) {
  //     map.Nunavut[i].x += 90;
  //     map.Nunavut[i].y += 4;
  //   }
  // }
  // localStorage.setItem("map", JSON.stringify(map));
  console.log(JSON.stringify(map));
};

onkeydown = function (event) {
  // Hold P or Z and click to place a new pin.
  if (event.keyCode === 80 || event.keyCode === 90) {
    mapper.pinning = true;
  }
  // Press M to open map key.
  if (event.keyCode === 77) {
    var mapKey = document.getElementById('map-key');
    var territory = document.getElementById('territory-name');
    var select = document.getElementById('submit-button');
    if (mapper.keyOpen) {
      if (document.activeElement !== territory) {
        mapper.keyOpen = false;
        mapKey.style.display = 'none';
      }
    } else {
      map = JSON.parse(localStorage.getItem("map"));
      mapper.keyOpen = true;
      territory.value = mapper.currentTerritory;
      mapKey.style.display = 'flex';
    }
    select.onclick = function () {
      mapper.currentTerritory = territory.value;
    };
  }
};

onkeyup = function (event) {
  mapper.pinning = false;
};

onclick = function (event) {
  var map;
  var pin;
  var x;
  var y;
  if (mapper.pinning) {
    map = JSON.parse(localStorage.getItem("map"));
    console.log(map);
    if (!map[mapper.currentTerritory]) {
      map[mapper.currentTerritory] = [];
    }
    if (!map.allNames) {
      map.allNames = [];
    }
    if (!map.allNames.includes(mapper.currentTerritory)) {
      map.allNames.push(mapper.currentTerritory);
    }
    if (mapper.lockCoords) {
      x = mapper.lockCoords.x;
      y = mapper.lockCoords.y;
    } else {
      x = event.pageX;
      y = event.pageY;
    }
    map[mapper.currentTerritory].push({
      territory: mapper.currentTerritory,
      number: map[mapper.currentTerritory].length,
      x: x,
      y: y,
    });
    pin = document.createElement('PIN');
    pin.style.left = x;
    pin.style.top = y;
    pin.coords = {
      x: x,
      y: y,
    };
    pin.onmouseenter = function () {
      mapper.lockCoords = this.coords;
      console.log(this.coords);
    };
    pin.onmouseleave = function () {
      mapper.lockCoords = null;
    };
    document.body.appendChild(pin);
    localStorage.setItem("map", JSON.stringify(map));
  }
};
