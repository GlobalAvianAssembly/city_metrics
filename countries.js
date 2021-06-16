/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var cities = ee.FeatureCollection("users/jamesr/UrbanAreasOver2Million"),
    countries = ee.FeatureCollection("FAO/GAUL_SIMPLIFIED_500m/2015/level0");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

// Define a spatial filter, with distance 0 km.
var distFilter = ee.Filter.withinDistance({
  distance: 0,
  leftField: '.geo',
  rightField: '.geo',
  maxError: 10
});

// Define a saveAll join.
var distSaveAll = ee.Join.saveAll({
  matchesKey: 'points',
  measureKey: 'distance'
});

// Apply the join.
var spatialJoined = distSaveAll.apply(cities, countries, distFilter);

Export.table.toCloudStorage({
  collection: spatialJoined,
  description: 'Export-city-country',
  fileNamePrefix: 'city-country',
  bucket:'urban_ebird'
});


Map.addLayer(spatialJoined)