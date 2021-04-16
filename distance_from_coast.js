/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var coastline = ee.FeatureCollection("users/jamesr/GSHHS_l_L1_Coastline"),
    cities = ee.FeatureCollection("users/jamesr/UrbanAreasOver2Million");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

Map.addLayer(coastline)
Map.addLayer(cities)