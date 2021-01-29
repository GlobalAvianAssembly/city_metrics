/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var hotspots = ee.FeatureCollection("users/jamesr/UrbanHotspots"),
    populationDensity = ee.Image("users/jamesr/GHS_POP_E2015_GLOBE_R2019A_54009_250_V1_0");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

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

hotspots.filter(function(feature) {
  return ee.Algorithms.If({
    condition: feature.get,
    trueCase: result,
    falseCase: 0
  });
}