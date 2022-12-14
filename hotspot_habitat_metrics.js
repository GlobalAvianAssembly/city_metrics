/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var hotspots = ee.FeatureCollection("users/jamesr/UrbanHotspots"),
    populationDensity = ee.Image("users/jamesr/GHS_POP_E2015_GLOBE_R2019A_54009_250_V1_0"),
    elevationRaster = ee.Image("users/jamesr/world_digital_elevation_model");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

var LandCoverage = require('users/jamesr/city_metrics:modules/LandCoverage.js');

function aboveZero(x) {
  return ee.Number(x).max(0);
}

function averagePopulationDensity(polygon) {
  
  var result = populationDensity.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: polygon,
    scale: 100,
    maxPixels: 1e9
  }).get('b1');
  
  return ee.Algorithms.If({
    condition: result,
    trueCase: result,
    falseCase: 0
  });
}

function averageElevation(polygon) {
  return aboveZero(elevationRaster.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: polygon,
    scale: 100,
    maxPixels: 1e9
  }).get('b1'));
}

function minMaxElevation(polygon) {
  return elevationRaster.reduceRegion({
    reducer: ee.Reducer.minMax(),
    geometry: polygon,
    scale: 100,
    maxPixels: 1e9
  });
}

function metricsForBuffer(point, bufferSize, prefix) {
  var buffer = point.buffer(bufferSize);
  var frequency = LandCoverage.coverage(buffer, bufferSize * 1000);
  var elevationMinMax = minMaxElevation(buffer);
  
  return LandCoverage.metrics(prefix, frequency, buffer.area())
    .set(prefix + '_avg_pop_density', averagePopulationDensity(buffer))
    .set(prefix + '_average_elevation', averageElevation(buffer))
    .set(prefix + '_min_elevation', aboveZero(elevationMinMax.get('b1_min')))
    .set(prefix + '_max_elevation', aboveZero(elevationMinMax.get('b1_max')));
}

function toBufferedFeature(feature) {
  var point = feature.geometry();
  
  return ee.Feature(
    point,
    new ee.Dictionary()
      .combine(metricsForBuffer(point, 500, 'b500'))
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
}


var updated = hotspots.map(function(feature) {
  return toBufferedFeature(feature);
});

Export.table.toCloudStorage({
  collection: updated,
  description: 'Export-hotspot-land-coverage-to-gcs',
  fileNamePrefix: 'hotspot_copernicus_land_coverage_and_pop_density',
  bucket:'urban_ebird'
});

Map.addLayer(updated);