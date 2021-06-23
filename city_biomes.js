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
  var biomeList = feature.get('biomes');
  
  var biomes = ee.FeatureCollection(biomeList);
  
  return biomes.map(function(biomeFeature) {
    return ee.Feature(null)
      .set('CITY_NAME', cityName)
      .set('BIOME_NAME', biomeFeature.get('BIOME_NAME'))
      .set('BIOME_NUM', biomeFeature.get('BIOME_NUM'))
      .set('ECO_ID', biomeFeature.get('ECO_ID'))
      .set('ECO_NAME', biomeFeature.get('ECO_NAME'))
      .set('NNH', biomeFeature.get('NNH'))
      .set('NNH_NAME', biomeFeature.get('NNH_NAME'))
      .set('REALM', biomeFeature.get('REALM'))
      .set('SHAPE_AREA', biomeFeature.get('SHAPE_AREA'))
      .set('SHAPE_LENG', biomeFeature.get('SHAPE_LENG'))
  })
}).flatten();


print(result)

Export.table.toCloudStorage({
  collection: result,
  description: 'Export-city-biome',
  fileNamePrefix: 'city-biome',
  bucket:'urban_ebird'
});

