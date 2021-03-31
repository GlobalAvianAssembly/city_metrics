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
var species_in_cities = intersectJoined.map(function(urban_area) {
  return ee.List(urban_area.get('species'))
    .map(function(species_area) {
      var species_area_f = ee.Feature(species_area);
      return new ee.Dictionary()
        .set('city_name', urban_area.get('NAME_MAIN'))
        .set('species', species_area_f.get('binomial'));
    });
});

print(species_in_cities.flatten())
