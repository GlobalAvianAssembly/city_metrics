/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var populationDensity = ee.Image("users/jamesr/GHS_POP_E2015_GLOBE_R2019A_54009_250_V1_0"),
    cities = ee.FeatureCollection("users/jamesr/UrbanAreasOver2Million");
/***** End of imports. If edited, may not auto-convert in the playground. *****/


function aboveZero(x) {
  return ee.Number(x).max(0);
}

function averagePopulationDensity(polygon) {
  
  var result = populationDensity.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: polygon,
    scale: 100,
    maxPixels: 1e9
  }).get('b1');
  
  return ee.Algorithms.If({
    condition: result,
    trueCase: result,
    falseCase: 0
  });
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
  var buffer = polygon.buffer(100000).difference(polygon);
  
  var popDensMinMax_city = minMaxPopulationDensity(polygon);
  var popDensMinMax_region = minMaxPopulationDensity(buffer);
  
  return ee.Feature(
    null, 
    new ee.Dictionary()
  )
  .set('city_average_pop_dens', averagePopulationDensity(polygon))
  .set('city_min_pop_dens', aboveZero(popDensMinMax_city.get('b1_min')))
  .set('city_max_pop_dens', aboveZero(popDensMinMax_city.get('b1_max')))
  .set('region_average_pop_dens', averagePopulationDensity(buffer).min(0))
  .set('region_min_pop_dens', aboveZero(popDensMinMax_region.get('b1_min')))
  .set('region_max_pop_dens', aboveZero(popDensMinMax_region.get('b1_max')))
  .set('city_name', feature.get('NAME_MAIN'));
});


Export.table.toCloudStorage({
  collection: stats,
  description: 'Export-city-population-density-to-gcs',
  fileNamePrefix: 'city_copernicus_population_density',
  bucket:'urban_ebird'
});

Map.addLayer(stats);