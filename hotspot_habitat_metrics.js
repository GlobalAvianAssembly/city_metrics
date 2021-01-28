/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var hotspots = ee.FeatureCollection("users/jamesr/UrbanHotspots"),
    populationDensity = ee.Image("users/jamesr/GHS_POP_E2015_GLOBE_R2019A_54009_250_V1_0");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

var LandCoverage = require('users/jamesr/city_metrics:modules/LandCoverage.js');

function averagePopulationDensity(polygon) {
  return populationDensity.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: polygon,
    scale: 100,
    maxPixels: 1e9
  }).get('b1');
}

function metricsForBuffer(point, bufferSize, prefix) {
  var buffer = point.buffer(bufferSize);
  var frequency = LandCoverage.coverage(buffer, bufferSize * 1000);
  return LandCoverage.metrics(prefix, frequency, buffer.area())
    .set(prefix + '_avg_pop_density', averagePopulationDensity(buffer));
}

var updated = hotspots.limit(200).map(function(feature) {
  var point = feature.geometry();
  
  return ee.Feature(
    point,
    new ee.Dictionary()
      .combine(metricsForBuffer(point, 1000, 'b1km'))
      .combine(metricsForBuffer(point, 2000, 'b2km'))
      .combine(metricsForBuffer(point, 3000, 'b3km'))
      .combine(metricsForBuffer(point, 4000, 'b4km'))
      .combine(metricsForBuffer(point, 5000, 'b5km'))
      .set('city_name', feature.get('NAME_MAIN'))
      .set('hotspot_id', feature.get('hotspot_id'))
      .set('elevation', feature.get('ELEVATION'))
      .set('latitude', feature.get('lat'))
  );
});

Map.addLayer(updated);