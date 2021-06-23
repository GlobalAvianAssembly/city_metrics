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

var result = intersectJoined.map(function(feature) {
  var cityName = feature.get('NAME_MAIN');
  var biomes = ee.FeatureCollection(feature.get('biomes'))
  return biomes.map(function(biomeFeature) {
    return biomeFeature.set('city_name', cityName)
  });
}).flatten()

print(result.size())

Map.addLayer(result)

Export.table.toCloudStorage({
  collection: result,
  description: 'Export-city-biome',
  fileNamePrefix: 'city-biome',
  bucket:'urban_ebird'
});

