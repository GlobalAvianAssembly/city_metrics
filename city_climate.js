/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var cities = ee.FeatureCollection("users/jamesr/UrbanAreasOver2Million"),
    climate = ee.Image("WORLDCLIM/V1/BIO");
/***** End of imports. If edited, may not auto-convert in the playground. *****/



function averagePopulationDensity(polygon) {
  return aboveZero(populationDensity.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: polygon,
    scale: 100,
    maxPixels: 1e9
  }).get('b1'));
}

var viz = {opacity: 0.5};

Map.addLayer(climate, viz);
Map.addLayer(cities, {opacity: 0.3})