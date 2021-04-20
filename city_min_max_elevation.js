/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var cities = ee.FeatureCollection("users/jamesr/UrbanAreasOver2Million"),
    elevation = ee.Image("users/jamesr/world_digital_elevation_model");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

var elevations = cities.map(function(feature) {
  var polygon = feature.geometry();
  
  var discrete = new ee.Dictionary(frequency.get('discrete_classification'));
  var totalLandCoverArea = ee.Number(discrete.values().reduce(ee.Reducer.sum()));
  
  var frequency_city = LandCoverage.coverage(polygon, 15000000);
  
  var buffer = polygon.buffer(100000).difference(polygon);
  var frequency_region = LandCoverage.coverage(buffer, 300000000);
  
  return feature
    .set('min_elevation', feature.get('NAME_MAIN'))
    .set('max_elevation', feature.get('POP_2015'));
});