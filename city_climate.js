/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var cities = ee.FeatureCollection("users/jamesr/UrbanAreasOver2Million"),
    climate = ee.Image("WORLDCLIM/V1/BIO");
/***** End of imports. If edited, may not auto-convert in the playground. *****/



var viz = {opacity: 0.5};

Map.addLayer(climate, viz);
Map.addLayer(cities, {opacity: 0.3})