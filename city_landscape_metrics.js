/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var cities = ee.FeatureCollection("users/jamesr/UrbanAreasOver2Million");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

var LandCoverage = require('users/jamesr/city_metrics:modules/LandCoverage.js');

  
var stats = cities.map(function(feature) {
  var polygon = feature.geometry();
  var frequency_city = LandCoverage.coverage(polygon, 15000000);
  
  var buffer = polygon.buffer(100000).difference(polygon);
  var frequency_region = LandCoverage.coverage(buffer, 300000000);
  
  return ee.Feature(
    polygon, 
    LandCoverage.metrics('city', frequency_city, polygon.area())
    .combine(LandCoverage.metrics('region', frequency_region, buffer.area()))
  )
  .set('city_name', feature.get('NAME_MAIN'))
  .set('pop_2015', feature.get('POP_2015'));
});

print(stats);

Export.table.toCloudStorage({
  collection: stats,
  description: 'Export-city-land-coverage-to-gcs',
  fileNamePrefix: 'city_copernicus_land_coverage',
  bucket:'urban_ebird'
});

Map.addLayer(stats);