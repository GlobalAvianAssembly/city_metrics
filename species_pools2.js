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
var urban_areas_subset = urban_areas.filterMetadata("NAME_MAIN", "starts_with", "A");
var species_subset = urban_areas.filterMetadata("binomial", "starts_with", "S");

var intersectJoined = saveAllJoin.apply(urban_areas_subset, species_subset, spatialFilter);

print(intersectJoined)

// Return list of species per urban area
intersectJoined = intersectJoined.map(function(urban_area) {
  // Get "power_plant" intersection list, count how many intersected this state.
  var allSpecies = ee.List(urban_area.get('species'));
  // Return the state feature with a new property: power plant count.
  return allSpecies
});
