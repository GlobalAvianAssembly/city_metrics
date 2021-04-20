/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var cities = ee.FeatureCollection("users/jamesr/UrbanAreasOver2Million"),
    elevation = ee.Image("users/jamesr/world_digital_elevation_model");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

var elevations = cities.map(function(feature) {
  var polygon = feature.geometry();
  
  var discrete = elevation.reduceRegion({
    reducer: ee.Reducer.frequencyHistogram(),
    geometry: polygon,
    scale: 100,
    maxPixels: 15000000
  });
  
  var minMaxElevation = ee.Number(discrete.values().reduce(ee.Reducer.minMax()));
  
  return feature
    .set('elevation', minMaxElevation)
});


Map.addLayer(elevation.reduceRegions(cities, ee.Reducer.minMax()));
