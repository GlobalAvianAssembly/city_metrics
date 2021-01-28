/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var hotspots = ee.FeatureCollection("users/jamesr/UrbanHotspots");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

var LandCoverage = require('users/jamesr/city_metrics:modules/LandCoverage.js');

var updated = hotspots.map(function(feature) {
  var buffer_1km = feature.geometry().buffer(1000);
  Landscape.
});

Map.addLayer(updated);