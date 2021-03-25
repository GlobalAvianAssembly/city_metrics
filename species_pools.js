/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var all_species = ee.FeatureCollection("users/jamesr/AllSpeciesClippedToUrbanArea"),
    urban_areas = ee.FeatureCollection("users/jamesr/UrbanAreasOver2Million");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

// Define a spatial filter, with distance 100 km.
var distFilter = ee.Filter.withinDistance({
  distance: 1000,
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
var spatialJoined = distSaveAll.apply(urban_areas, all_species, distFilter);

Export.table.toCloudStorage({
  collection: spatialJoined,
  description: 'Export-regional-species-pool',
  fileNamePrefix: 'regional-species-pool',
  bucket:'urban_ebird'
});

// Print the result.
//print(spatialJoined);