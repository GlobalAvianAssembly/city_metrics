/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var cities = ee.FeatureCollection("users/jamesr/UrbanAreasOver2Million"),
    elevationRaster = ee.Image("users/jamesr/world_digital_elevation_model"),
    estuaries = ee.FeatureCollection("users/jamesr/14_001_UBC003_SAU_Estuaries2003_v2");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

var LandCoverage = require('users/jamesr/city_metrics:modules/LandCoverage.js');

function aboveZero(x) {
  return ee.Number(x).max(0);
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

function areaCoveredbyEstuaries(polygon) {
  return polygon.intersection(estuaries).area().divide(10000)
}
  
var stats = cities.map(function(feature) {
  var polygon = feature.geometry();
  var frequency_city = LandCoverage.coverage(polygon, 15000000);
  
  
  var buffer_20k = polygon.buffer(20000).difference(polygon);
  var buffer_50k = polygon.buffer(50000).difference(polygon);
  var buffer_100k = polygon.buffer(100000).difference(polygon);
  
  var frequency_region20k = LandCoverage.coverage(buffer_20k, 300000000);
  var frequency_region50k = LandCoverage.coverage(buffer_50k, 300000000);
  var frequency_region100k = LandCoverage.coverage(buffer_100k, 300000000);
  
  var elevationMinMax_city = minMaxElevation(polygon);
  var elevationMinMax_region20k = minMaxElevation(buffer_20k);
  var elevationMinMax_region50k = minMaxElevation(buffer_50k);
  var elevationMinMax_region100k = minMaxElevation(buffer_100k);
  
  return ee.Feature(
    null, 
    LandCoverage.metrics('city', frequency_city, ee.Number(polygon.area()))
    .combine(LandCoverage.metrics('region_20', frequency_region20k, ee.Number(buffer_20k.area())))
    .combine(LandCoverage.metrics('region_50', frequency_region50k, ee.Number(buffer_50k.area())))
    .combine(LandCoverage.metrics('region_100', frequency_region100k, ee.Number(buffer_100k.area())))
  )
  .set('city_average_elevation', averageElevation(polygon))
  .set('city_min_elevation', aboveZero(elevationMinMax_city.get('b1_min')))
  .set('city_max_elevation', aboveZero(elevationMinMax_city.get('b1_max')))
  .set('city_estuary_area', areaCoveredbyEstuaries(polygon))
  .set('region_20_average_elevation', averageElevation(buffer_20k))
  .set('region_20_min_elevation', aboveZero(elevationMinMax_region20k.get('b1_min')))
  .set('region_20_max_elevation', aboveZero(elevationMinMax_region20k.get('b1_max')))
  .set('region_20_estuary_area', areaCoveredbyEstuaries(buffer_20k))
  .set('region_50_average_elevation', averageElevation(buffer_50k))
  .set('region_50_min_elevation', aboveZero(elevationMinMax_region50k.get('b1_min')))
  .set('region_50_max_elevation', aboveZero(elevationMinMax_region50k.get('b1_max')))
  .set('region_50_estuary_area', areaCoveredbyEstuaries(buffer_50k))
  .set('region_100_average_elevation', averageElevation(buffer_100k))
  .set('region_100_min_elevation', aboveZero(elevationMinMax_region100k.get('b1_min')))
  .set('region_100_max_elevation', aboveZero(elevationMinMax_region100k.get('b1_max')))
  .set('region_100_estuary_area', areaCoveredbyEstuaries(buffer_100k))
  .set('city_name', feature.get('NAME_MAIN'))
  .set('pop_2015', feature.get('POP_2015'));
});


Export.table.toCloudStorage({
  collection: stats,
  description: 'Export-city-land-coverage-to-gcs',
  fileNamePrefix: 'city_copernicus_land_coverage',
  bucket:'urban_ebird'
});

Map.addLayer(stats);