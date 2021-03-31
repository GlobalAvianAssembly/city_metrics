/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var all_species = ee.FeatureCollection("users/jamesr/AllSpeciesClippedToUrbanArea"),
    urban_areas = ee.FeatureCollection("users/jamesr/UrbanAreasOver2Million");
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
var urban_areas_subset = urban_areas.filterMetadata("NAME_MAIN", "starts_with", "M");
var species_subset = all_species.filterMetadata("binomial", "starts_with", "S");

var intersectJoined = saveAllJoin.apply(urban_areas_subset, species_subset, spatialFilter);

print(intersectJoined)

// Return list of species per urban area
intersectJoined = intersectJoined.map(function(urban_area) {
  var species = ee.List(urban_area.get('species'))
    .map(function(s) {
      return ee.Feature(urban_area.geometry(), new ee.Dictionary()
        .set('city_name', urban_area.get('NAME_MAIN'))
        .set('species', s));
    });
  return ee.FeatureCollection(species);
});

print(intersectJoined)