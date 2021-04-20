/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var cities = ee.FeatureCollection("users/jamesr/UrbanAreasOver2Million"),
    elevation = ee.Image("users/jamesr/world_digital_elevation_model");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

var elevations = cities.map(function(feature) {
  var polygon = feature.geometry();
  
  discrete = elevation.reduceRegion({
    reducer: ee.Reducer.frequencyHistogram(),
    geometry: polygon,
    scale: 100,
    maxPixels: 15000000
  });
  
  var maxElevation = ee.Number(discrete.values().reduce(ee.Reducer.max()));
  var minElevation = ee.Number(discrete.values().reduce(ee.Reducer.min()));
  
  return feature
    .set('min_elevation', feature.get('NAME_MAIN'))
    .set('max_elevation', feature.get('POP_2015'));
});

Map.addLayer(elevation);