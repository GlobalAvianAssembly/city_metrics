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
  matchesKey: 'species',
});

// Apply the join.
//var urban_areas_subset = urban_areas.filterMetadata("NAME_MAIN", "starts_with", "M");
//var species_subset = all_species.filterMetadata("binomial", "starts_with", "S");

var intersectJoined = saveAllJoin.apply(cities, biomes, spatialFilter);

var result = spatialJoined.map(function(feature) {
  var cityName = feature.get('NAME_MAIN');
  var biomes = ee.FeatureCollection(feature.get('points'))
  return biomes.map(function(biomeFeature) {
    return biomeFeature.set('city_name', cityName)
  });
}).flatten()

print(result.size())

Map.addLayer(result)

Export.table.toCloudStorage({
  collection: spatialJoined,
  description: 'Export-city-biome',
  fileNamePrefix: 'city-biome',
  bucket:'urban_ebird'
});

