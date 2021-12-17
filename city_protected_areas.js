/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var cities = ee.FeatureCollection("users/jamesr/UrbanAreasOver2Million"),
    protected_areas = ee.Image("users/jamesr/ProtectedAreas2");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

protected_area_coverage = function(polygon) {
  return protected_areas.reduceRegion({
    reducer: ee.Reducer.frequencyHistogram(),
    geometry: polygon,
    scale: 100,
    maxPixels: 300000000
  });
}

percentage_protected = function(polygon) {
  var cover_frequency = protected_area_coverage(polygon);
  var area_covered_by_protected = ee.Number(frequencyDictionary.get('b1', 0);
  var total_area = polygon.area();
  
  return
}

var stats = cities.map(function(feature) {
  var polygon = feature.geometry();
  
  var buffer_20k = polygon.buffer(20000).difference(polygon);
  var buffer_50k = polygon.buffer(50000).difference(polygon);
  var buffer_100k = polygon.buffer(100000).difference(polygon);
  
  var frequency = protected_area_coverage(polygon);
  
  