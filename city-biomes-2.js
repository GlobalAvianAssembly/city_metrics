/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var cities = ee.FeatureCollection("users/jamesr/UrbanAreasOver2Million"),
    biome = ee.Image("OpenLandMap/PNV/PNV_BIOME-TYPE_BIOME00K_C/v01");
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
var spatialJoined = distSaveAll.apply(cities, biomes, distFilter);

Export.table.toCloudStorage({
  collection: spatialJoined,
  description: 'Export-city-biome',
  fileNamePrefix: 'city-biome',
  bucket:'urban_ebird'
});


Map.addLayer(spatialJoined)