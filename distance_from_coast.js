/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var coastline = ee.FeatureCollection("users/jamesr/GSHHS_l_L1_Coastline"),
    cities = ee.FeatureCollection("users/jamesr/UrbanAreasOver2Million");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

var spatialFilter = ee.Filter.withinDistance({
  distance: 5000000,
  leftField: '.geo',
  rightField: '.geo',
  maxError: 10
})

//join the cities to coastline
var joined = ee.Join.saveAll({
  matchesKey: 'neighbors', 
  measureKey: 'distance',
  ordering: 'distance'
}).apply({
  primary: cities, 
  secondary: coastline, 
  condition: spatialFilter
});

var hasNearest = joined.map(function(f) {
  var neighsSize = ee.List(f.get('neighbors')).size();
  return f.set('numberOfNeighbours', neighsSize);
}).filter(ee.Filter.gt('numberOfNeighbours', 1));

Map.addLayer(hasNearest, {color: 'red'}, 'hasNearest');

// Get distance to nearest point.
var withNearestDist = hasNearest.map(function(f) {
  var nearestDist = ee.Feature(ee.List(f.get('neighbors')).get(1))
    .get('distance');
  return f.set('nearestDistanceToNeighbour', nearestDist);
});

// export to cloud
Export.table.toCloudStorage({
  collection: withNearestDist,
  description: 'Export-urban-area-to-coastline',
  fileNamePrefix: 'ee-urban-area-distance-to-coastline',
  bucket:'urban_ebird'
});


print(withNearestDist)