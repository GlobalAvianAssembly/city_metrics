# Avian diversity and function across the World’s most populous cities 
## Google Earth Engine Scripts

The javascript files within this repository can be imported into https://code.earthengine.google.com/ to regenerate hotspot and city metrics.

The outputs from each file are exported to a Google Cloud Storage bucket, downloaded, and imported into Google BigQuery.  

All data imported into BigQuery (Google 2022) was then modelled using dbt™ (DBT Labs 2022). 
Final datasets were extracted in R using bigrquery (Edmondson 2019) and analysis was performed in RStudio (RStudio Team 2022). 
Further details of our approach can be found in Appendix 4 of our manuscript. The final datasets can be found in our R analysis data repository (link provided in manuscript).

## File overview

### city_biomes.js
Finds which biomes and realms from the Ecoregions dataset (Resolve 2017) a city is located within.  
This data is used to populate columns in `download_data__input__city_data.csv`:
* `biome_name`: the name of the biome that covers the largest area of the city vector
* `realm`: the realm that covers the largest area of the city vector
* `number_of_biomes`: the total number of biomes within a city

### city_climate.js
Finds the climatic variables for each city from the World Bioclimatic Variables dataset (Hijmans et al. 2005).
This data is used to populate columns in `download_data__input__city_data.csv`:
* `temperature_annual_average`
* `temperature_monthly_min`
* `temperature_monthly_max` 
* `rainfall_annual_average`
* `rainfall_monthly_min`
* `rainfall_monthly_max`

### city_landscape_metrics.js
Finds the city landscape and elevations variables for each city from Copernicus Global Land Covers dataset (Buchhorn et al. 2019), EEA eleveation dataset (European Environment Agency 2016), and Global Estuary database (Alder 2003).
This data is used to populate columns in `download_data__input__city_data.csv`, city coverage metrics:
* `closed_forest`, `cultivated`, `herbaceous_vegetation`, `herbaceous_wetland`, `open_forest`, `permanent_water`, `shrubs`, `urban`
* `city_mean_elevation`, `city_elevation_delta`
* `city_includes_estuary`

regional coverage metrics:
* `region_100km_urban`, `region_100km_cultivated`, `region_50km_urban`, `region_50km_cultivated`, `region_20km_urban`, `region_20km_cultivated`
* `region_100km_mean_elevation`, `region_100km_elevation_delta`, `region_50km_mean_elevation`, `region_50km_elevation_delta`, `region_20km_mean_elevation`, `region_20km_elevation_delta`
* `region_100km_includes_estuary`, `region_50km_includes_estuary`, `region_20km_includes_estuary`

### city_population_density.js
Finds the population density averages for the city and regions around the cities from the Global Human Settlement Layer population raster (Schiavina et al. 2019).

This data is used to populate columns in `download_data__input__city_data.csv`, city coverage metrics:
* `city_average_pop_density`
* `city_delta_pop_density`
* `city_max_pop_density`

regional coverage metrics:
* `region_100km_average_pop_density`
* `region_50km_average_pop_density`
* `region_20km_average_pop_density`

### city_productivity.js
Finds the productivity (NDVI, SSM, SUSM) variables for the city and regions around cities from NASA’s MODIS Terra Vegetation Indicies (Didan 2022).
This data is used to populate columns in `download_data__input__city_data.csv`, city coverage metrics:
* `city_ndvi`
* `city_ssm`
* `city_susm`

regional coverage metrics:
* `region_20km_ndvi`, `region_50km_ndvi`, `region_100km_ndvi`
* `region_20km_ssm`, `region_50km_ssm`, `region_100km_ssm`
* `region_20km_susm`, `region_50km_susm`, `region_100km_susm`

### city_protected_areas.js
Finds the total area of the city and region around city that is covered by a protected area from the UNEP-WCMC and IUCN (2021) Protected Areas dataset.
This data is used to populate columns in `download_data__input__city_data.csv``:
* `city_percentage_protected`
* `region_20km_percentage_protected`
* `region_50km_percentage_protected`
* `region_100km_percentage_protected`




