/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var biomes = ee.FeatureCollection("RESOLVE/ECOREGIONS/2017"),
    cities = ee.FeatureCollection("users/jamesr/UrbanAreasOver2Million");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

var spatialFilter = ee.Filter.intersects({
  leftField: '.geo',
  rightField: '.geo',
  maxError: 10
});

// Define a save all join.
var saveAllJoin = ee.Join.saveAll({
  matchesKey: 'biomes',
});

var intersectJoined = saveAllJoin.apply(cities, biomes, spatialFilter);

Map.addLayer(ee.FeatureCollection(intersectJoined.first().get('biomes')))

var result = intersectJoined.map(function(feature) {
  var cityName = feature.get('NAME_MAIN');
  var biomeList = feature.get('biomes');
  
  var biomes = ee.FeatureCollection(biomeList);
  
  return biomes.map(function(biomeFeature) {
    return biomeFeature.set('CITY_NAME', cityName)
  }).sort("SHAPE_AREA", false);
}).flatten();


var resultFC = ee.FeatureCollection(result);
Map.addLayer(resultFC)

Export.table.toCloudStorage({
  collection: resultFC,
  description: 'Export-city-biome',
  fileNamePrefix: 'city-biome',
  bucket:'urban_ebird'
});

