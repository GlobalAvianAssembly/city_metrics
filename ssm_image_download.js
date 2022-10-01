
var ssm = ee.ImageCollection("NASA_USDA/HSL/SMAP10KM_soil_moisture")
  .select("ssm");

Map.addLayer(ssm);