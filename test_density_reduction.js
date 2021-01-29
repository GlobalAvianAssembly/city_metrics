/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var hotspots = ee.FeatureCollection("users/jamesr/UrbanHotspots"),
    populationDensity = ee.Image("users/jamesr/GHS_POP_E2015_GLOBE_R2019A_54009_250_V1_0");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

function averagePopulationDensity(polygon) {
  return populationDensity.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: polygon,
    scale: 100,
    maxPixels: 1e9
  });
}

var hotspot = hotspots.filter("hotspot_id == 'L2558046'");



print(averagePopulationDensity(hotspot.geometry().buffer(50)))
Map.centerObject(hotspot.geometry(), 20);
Map.addLayer(hotspot.geometry().buffer(50));