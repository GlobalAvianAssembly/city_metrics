/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var biomes = ee.FeatureCollection("RESOLVE/ECOREGIONS/2017"),
    cities = ee.FeatureCollection("users/jamesr/UrbanAreasOver2Million");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

Map.addLayer(biomes)