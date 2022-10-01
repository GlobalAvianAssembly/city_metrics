
var ssm = ee.ImageCollection("NASA_USDA/HSL/SMAP10KM_soil_moisture")
  .select("ssm");

print(ssm);

Map.addLayer(ssm);


Export.image.toDrive({
  image: ssm,
  description: 'World SSM'
});