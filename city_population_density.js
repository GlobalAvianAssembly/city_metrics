/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var populationDensity = ee.Image("users/jamesr/GHS_POP_E2015_GLOBE_R2019A_54009_250_V1_0"),
    cities = ee.FeatureCollection("users/jamesr/UrbanAreasOver2Million");
/***** End of imports. If edited, may not auto-convert in the playground. *****/


function averagePopulationDensity(polygon) {
  return populationDensity.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: polygon,
    scale: 100,
    maxPixels: 1e9
  }).get('b1');
}

function minMaxPopulationDensity(polygon) {
  return populationDensity.reduceRegion({
    reducer: ee.Reducer.minMax(),
    geometry: polygon,
    scale: 100,
    maxPixels: 1e9
  });
}

var stats = cities.map(function(feature) {
  var polygon = feature.geometry();
  var buffer_20k = polygon.buffer(20000).difference(polygon);
  var buffer_50k = polygon.buffer(50000).difference(polygon);
  var buffer_100k = polygon.buffer(100000).difference(polygon);
  
  var popDensMinMax_city = minMaxPopulationDensity(polygon);
  var popDensMinMax_region20k = minMaxPopulationDensity(buffer_20k);
  var popDensMinMax_region50k = minMaxPopulationDensity(buffer_50k);
  var popDensMinMax_region100k = minMaxPopulationDensity(buffer_100k);
  
  return ee.Feature(
    null, 
    new ee.Dictionary()
  )
  .set('city_average_pop_dens', averagePopulationDensity(polygon))
  .set('city_min_pop_dens', popDensMinMax_city.get('b1_min'))
  .set('city_max_pop_dens', popDensMinMax_city.get('b1_max'))
  .set('region_20_average_pop_dens', averagePopulationDensity(buffer_20k))
  .set('region_20_min_pop_dens', popDensMinMax_region20k.get('b1_min'))
  .set('region_20_max_pop_dens', popDensMinMax_region20k.get('b1_max'))
  .set('region_50_average_pop_dens', averagePopulationDensity(buffer_50k))
  .set('region_50_min_pop_dens', popDensMinMax_region50k.get('b1_min'))
  .set('region_50_max_pop_dens', popDensMinMax_region50k.get('b1_max'))
  .set('region_100_average_pop_dens', averagePopulationDensity(buffer_100k))
  .set('region_100_min_pop_dens', popDensMinMax_region100k.get('b1_min'))
  .set('region_100_max_pop_dens', popDensMinMax_region100k.get('b1_max'))
  .set('city_name', feature.get('NAME_MAIN'));
});


Export.table.toCloudStorage({
  collection: stats,
  description: 'Export-city-population-density-to-gcs',
  fileNamePrefix: 'city_population_density',
  bucket:'urban_ebird'
});

var viz = {palette: ['00FFFF', '0000FF'], opacity: 0.8, min: 1000, bands: ['b1']};

Map.addLayer(populationDensity, viz);
Map.addLayer(cities, {opacity: 0.3})