/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var hotspots = ee.FeatureCollection("users/jamesr/UrbanHotspots");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

var LandCoverage = require('users/jamesr/city_metrics:modules/LandCoverage.js');

function metricsForBuffer(point, bufferSize, prefix) {
  var buffer_1km = point.buffer(bufferSize);
  var frequency = LandCoverage.coverage(buffer_1km, bufferSize * 1000);
  return LandCoverage.metrics(prefix, frequency, buffer_1km.area());
}

var updated = hotspots.limit(200).map(function(feature) {
  var point = feature.geometry();
  
  return ee.Feature(
    point,
    new ee.Dictionary()
      .combine(metricsForBuffer(point, 1000, 'b1km'))
      .set('city_name', feature.get('NAME_MAIN'))
      .set('hotspot_id', feature.get('hotspot_id'))
      .set('elevation', feature.get('ELEVATION'))
  );
});

Map.addLayer(updated);