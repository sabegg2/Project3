# Project3
- Anemometer Data Comparison Dashboard
- Steph Abegg

## Research Question

3D anemometers offer more comprehensive measurements than 2D anemometers by capturing wind speed and direction in three dimensions, providing a complete understanding of wind flow. This makes them ideal for complex environments and scientific research that require detailed wind analysis. However, they are typically more expensive and may be more susceptible to environmental factors such as precipitation and icing up. In contrast, 2D anemometers measure only the horizontal components of wind speed and direction, making them suitable for applications where vertical wind measurements are less critical or where there is a fair amount of precipitation.

A question is whether 2D anemometer data such as temperature, wind direction, and wind speed can be used as a substitute for the equivalent measurements from a 3D anemometer. This would be particularly beneficial during the times when a 3D anemometer is iced up. To address this question, we analyze data collected from a 2D anemometer and a 3D anemometer at the same location during the same 30-day time frame. The data from both anemometers is recorded on 5-second intervals. The data for each anemometer is first averaged over 15-minute windows (this smooths out the data as well as corresponds to how the wind data is used in practice), and then the 15-minute averaged temperatures, wind directions, and wind speeds are directly compared via timeseries plots, regression analysis, and binning.

## The Data

1.	Data from a 2D anemometer in North Dakota, located at 47.8437 N, 102.8524 W. The elevation at this location is approximately 2300 ft above sea level and the 2D anemometer is situated 5.2 meters above the ground. The 2D anemometer data spans 30 days from February 11, 2024 to March 11, 2024, on five-second intervals. There is a two-day gap in the data, over the days of February 22 and 23, corresponding to a winter storm where the 2D anemometer was iced up. (So, we have a total of 28 days of data for the 2D anemometer, although throughout this paper it is referred to as 30 days due to the time span of the data.) The raw 2D anemometer data contains 472,048 rows (pared down to 404,984 rows after cleaning the data). The relevant columns include:
a.	Date and time in UTC;
b.	Number of internal data points used to compute the measurements corresponding to a single time;
c.	Temperature in degrees Celsius;
d.	Wind direction in degrees (North: 0°, East: 90°);
e.	Wind speed in meters per second.

2.	Data from a 3D anemometer in North Dakota, located at the same location as the 2D anemometer. The 3D anemometer is situated 3 meters above the ground. The 3D anemometer data spans 30 days from February 11, 2024 to March 11, 2024, on five-second intervals. There are two two-day gaps in the data, over the days of February 22 and 23 and March 3 and 4, corresponding to winter storms when the 3D anemometer was iced up. (So, we have a total of 26 days of data for the 3D anemometer, although throughout this paper it is referred to as 30 days due to the time span of the data.) The raw 3D anemometer data contains 420,917 rows (pared down to 420,911 rows after cleaning the data). The relevant columns include:
a.	Date and time in UTC ;
b.	Number of internal data points used to compute the measurements corresponding to a single time;
c.	Temperature in degrees Celsius;
d.	Wind direction in degrees (North: 0°, East: 90°);
e.	Wind speed in meters per second;
f.	Wind elevation in degrees.

After conducting 15-minute averaging, this gaave 2626 rows data with 2D and 3D measurements during the same 15-minut windows.

## The Elements of the Dashboard

The elements of the dashboard are:

(1) A dropdown list with three options: Wind Speed, Wind Direction, Temperature. This allows different data to be to be selected. All of the plots and metadata update when a new option is selected.

<img src="images/select.png" width=200>

(2) A timeseries that shows the 2D and 3D anemometer data over time, as well as the difference between the measurements correpsonding to the same 15-minute window.

<img src="images/timeseries.png" width=900>

(3) A histogram for the differences between the measuements.

<img src="images/histogram.png" width=500>

(4) A scatterplot of 2D vs. 3D data. A regression line and R^2 value is plotted.

<img src="images/regression.png" width=500>

## GitHub Pages

I deployed my repository to GitHub Pages. The interactive dashboard I created in this assignment can be displayed and interacted with at the following link:

https://sabegg2.github.io/Project3/

## Files

The javascript and html files are:

[app.js](static/js/app.js)

[index.html](index.html)

## Database

It was required that data was stored in and extracted from at least one database. I used pgAdmin. To access the data, I wrote a simple Node.js server that will query your PostgreSQL database and serve the data over HTTP as a json file. H

[anemometer_db_schema.sql](anemometer_db_schema.sql)

[server.js](static/js/app.js)



## Data Preparation

I did a significant amout of data cleaning to prepare the 2d and 3d datasets used in the visualizations. Also some analysis.

[datacleaning.ipynb](datacleaning.ipynb)

Cleaning

Before analysis could ensue, the datasets had to be cleaned. The dataset cleaning is described below, where “2D”, “3D”, “NAM” indicate which dataset(s) was involved in each cleaning step.
	NAM: The cleaning took place as the data was being extracted from the individual downloaded .grb2 files. Only data needed for the analysis was included in the final exported .csv file, and the columns were named as desired.
	2D/3D: The UTC time column was changed into a datetime64 format.
	2D/3D: The seconds column was added to the UTC time, which curiously had all of the seconds zeroed out in the original dataset.
	2D/3D: Columns that were not needed for the analysis were removed. Examples of columns that were removed were “_id”, “Origin of data”, and various pre-calculated date, hour, minute, second, and second bins that were later added back in forms more useful to this analysis.
	2D/3D: Columns were renamed to clarify units (e.g. “temp” to “temp_C”, “wspd” to “wspd_mps”).
	2D/3D: Rows with null values were dropped.
	2D: Histograms of the column data were created to check if the data had any obvious outliers or points in error. This revealed that the 2D anemometer data had a few data points with unrealistic temperatures (e.g. as low as -97°C and as high as 93°C, a bit extreme for even North Dakota in the winter!). Any rows where the temperature was outside of -30°C to 30°C were removed. Neither the 3D anemometer data nor the NAM data had temperatures outside of this range.
	2D/3D: The measurements from the anemometers are in five-second intervals. An individual measurement is an internal computation from several data points taken over the preceding five seconds. This number is given in the “n_pts” column.  A typical measurement from the 3D anemometer is computed from about 100 individual data points while a typical measurement from the 2D anemometer is computed from about 25 individual data points. The histograms indicated that some measurements had just a couple of data points contributing to the measurement. Any rows where the number of internal data points was less than five were removed.  
	2D/3D: The data was checked for duplicate rows. There were no duplicate rows. 
	3D: To make the wind speeds from the 3D anemometer comparable with the wind speeds from the 2D anemometer and the NAM forecast data (which was computed upon extraction to be the horizontal wind speed), the wind speed from the 3D anemometer was adjusted to just the horizontal component multiplying by the cosine of the wind elevation. The wind elevation angles are generally small, so this correction had very little effect on the wind speeds.
	2D/NAM: The two anemometers and the NAM forecast data corresponded to different heights above the ground. The 3D anemometer is 3 meters above the ground, the 2D anemometer is 5.2 meters above the ground, and the elevation of the “surface” wind speed measurements from the NAM data is 80 meters off the ground. To be comparable, the wind speeds were corrected using the wind shear formula (v_2=v_1  ((h_2/z_0 )  )/((h_1/z_0 ) ), where v_1 is the reference wind speed measured at height h_1, v_2 is the wind speed at height h_2, and z_0 is the roughness length which depends on the terrain).  The height of the 3D anemometer was used for reference, and the 2D anemometer and NAM wind speeds were corrected to represent a height of 3 meters above the ground.


New Columns

After the data was cleaned, some new columns were added. The new columns are described below, where “2D”, “3D”, “NAM” indicate which dataset(s) was involved in each column addition.
•	2D/3D/NAM: To make the time series plots more representative of a local day (midnight to midnight), a column for local time was added. The location of the anemometers is in Central Time, which is UTC -06:00, so computing local time involved subtracting 6 hours from the UTC time.
•	2D/3D/NAM: Columns were added for date and hour of day, both in local time.
•	2D/3D: A column was added for minute. This was used for binning into 15-minute intervals.
•	2D/3D: A column was added to bin the 2D and 3D anemometer data into 15-minute intervals, starting on the hour. This was used for averaging the temperature, wind speed, and wind direction over every 15 minutes. This smooths out the data as well as corresponds to how the wind data is used in practice.
•	NAM: A column was added for the date and hour of the forecast, in local time. This involved adding the forecast period (in hours) to the local time to get the time corresponding to the forecast, and then separating the result into date and hour. Future dataframes were merged on these new forecast date and hour columns to be able to directly compare the forecasts with each other and with corresponding anemometer measurements for that date and hour.
•	2D/3D/NAM: Columns were added for the cosines and sines of the wind direction. This was needed for the circular averaging of the wind direction over the 15-minute bins. Circular averaging averages the east-west and north-south components separately, and then computes the average wind angle by finding the arctangent of the ratio of the components. Also, the cosine and sine components of the wind direction were needed for the multilinear regression models. Standard linear regression cannot handle the circular nature of time properly because it assumes a linear relationship and does not account for the circular wrap-around of angles.
•	2D/3D/NAM: Columns were added for the cosines and sines of the scaled hour of day. These were needed for the multilinear regression models, for the same reason as the wind components.
•	2D/3D/NAM: A column was added for temperature in degrees Fahrenheit. Fahrenheit is the unit used for the plots, being more commonplace in the United States than Celsius.
•	2D/3D/NAM: A column was added for wind speed in miles per hour. Miles per hour is the unit used for the plots, being more commonplace in the United States than meters per second.


Joined Dataframes

Now that the data was cleaned and the necessary columns added, it was time to merge the three datasets (2D anemometer data, 3D anemometer data, and NAM data) to allow for direct comparison of the data for the same times. The analysis was based primarily on this merged data. The merged data frames are described below, where “2D”, “3D”, “NAM” indicate which dataset(s) was involved in each data frame.
•	2D/3D: New dataframes (designated “data_2D_15min” and “data_3D_15min”) were created for each of the 2D and 3D anemometer data sets, by averaging temperature, wind direction, and wind speed over 15-minute intervals. The wind direction was averaged using circular averaging. Circular averaging averages the east-west and north-south components separately, and then computes the average wind angle by finding the arctangent of the ratio of the components. This reduced the 2D anemometer datapoints to 2626 and the 3D to 2345 (the reason that the 3D anemometer has fewer is because it was iced up from March 3-4, while the 2D anemometer was still operating). Figure 6 shows the number of rows of data from the raw data, cleaned data, and the dataframes. 
•	2D/3D: A dataframe “df_2D_and_3D” was created via an outer join of the 15-minute averaged 2D anemometer data with the 15-minute averaged 3D anemometer data, joining on date, hour, and 15-minute bin. For all but the four days where one or both of the anemometers were iced up, this gives a 1 to 1 comparison of measurements.

## Conclusions

Based on this analysis, the measurements of temperature, wind direction, and wind speed from the 2D and 3D anemometer show themselves to be very similar and with a strong linear relationship. There is some scatter in the data, but when averaged over time, the values are within a reasonable error tolerance. Removing data with low wind speeds (<1m/s, the typical threshold for reliable measurements anyway) reduces the scatter. This suggests that the 2D anemometer data can be used instead of the 3D anemometer data if needed.

## New Library Not Covered in Class

Project must include at least one JavaScript OR Python library that we did not cover. 

I needed a server-side language to query the PostgreSQL database. This server will act as an intermediary between your database and D3.js in the browser. To do this, I installed the necessary dependencies pg (PostgreSQL client for Node.js) and express (to set up the server). Next, with the help of ChatGTP, I wrote a simple Node.js server that queried my PostgreSQL database and serve the data over HTTP. I also needed to configure my  Node.js server to allow cross-origin requests by adding CORS headers. To do this, I installed the cors package.

## Ethical Considerations

## References for Data

The wind data was provided by LongPath Tecchnologies, Inc., a methane-gas monitoring service based in Boulder, Colorado. The data was collected at one of the sites they monitor.

## References for Code

For the most part, I wrote my code on my own, using techniques learned in class. I find ChatGTP to be a great helper for directing me on the correct path. The only significant code that I pulled directly from ChatGTP is the server.js code for connecting with the pgAdmin database.


