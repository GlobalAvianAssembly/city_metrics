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
  return polygon.intersection(estuaries).area()
}
  
var stats = cities.map(function(feature) {
  var polygon = feature.geometry();
  var frequency_city = LandCoverage.coverage(polygon, 15000000);
  
  var buffer = polygon.buffer(100000).difference(polygon);
  var frequency_region = LandCoverage.coverage(buffer, 300000000);
  
  var elevationMinMax_city = minMaxElevation(polygon);
  var elevationMinMax_region = minMaxElevation(buffer);
  
  return ee.Feature(
    null, 
    LandCoverage.metrics('city', frequency_city, ee.Number(polygon.area()))
    .combine(LandCoverage.metrics('region', frequency_region, ee.Number(buffer.area())))
  )
  .set('city_average_elevation', averageElevation(polygon))
  .set('city_min_elevation', aboveZero(elevationMinMax_city.get('b1_min')))
  .set('city_max_elevation', aboveZero(elevationMinMax_city.get('b1_max')))
  .set('city_estuary_area', areaCoveredbyEstuaries(polygon))
  .set('region_average_elevation', averageElevation(buffer).min(0))
  .set('region_min_elevation', aboveZero(elevationMinMax_region.get('b1_min')))
  .set('region_max_elevation', aboveZero(elevationMinMax_region.get('b1_max')))
  .set('region_estuary_area', areaCoveredbyEstuaries(buffer))
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