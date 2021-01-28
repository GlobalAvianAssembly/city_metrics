/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var hotspots = ee.FeatureCollection("users/jamesr/UrbanHotspots");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

var LandCoverage = require('users/jamesr/city_metrics:modules/LandCoverage.js');

/*
var buffer = polygon.buffer(100000).difference(polygon);
  var frequency_region = LandCoverage.coverage(buffer, 300000000);
  
  return ee.Feature(
    polygon, 
    LandCoverage.metrics('city', frequency_city, polygon.area())
    .combine(LandCoverage.metrics('region', frequency_region, buffer.area()))
  )
  */
  
var updated = hotspots.map(function(feature) {
  var buffer_1km = feature.geometry().buffer(1000);
  var frequency = LandCoverage.coverage(buffer_1km, 100000);
  var metrics = LandCoverage.metrics('b1km', frequency, buffer_1km.area());
  
  return ee.Feature(
    feature.geometry(),
    metrics
    .set('city_name', feature.get('NAME_MAIN'))
    .set('hotspot_id', feature.get('hotspot_id'))
    .set('elevation', feature.get('ELEVATION'))
  );
});

Map.addLayer(updated);