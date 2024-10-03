# Project 3: Anemometer Data Comparison Dashboard
- Steph Abegg (I ran it by James first, and he was okay with me going solo for this project)
- Data Visualization Track


## Project requirements

- The project includes visualizations, created with Plotly in JavaScript. There are three vislizations (timeseries scatterplot, histogram, and regression scatterplot) for each metric.

- The data is stored in and extracted from a PostgreSQL database.

- The project contains three JavaScript libraries that we did not cover in class (pg, express, cors, and SweetAlert2).

- The project dataset has 2344 records (raw data has many more).

- The project includes user-driven interaction since the user can select which metric (wind speed, wind direction, temperature) to view via radio buttons, as well as filter by wind speed (all wind speeds, or all wind speeds greater than 1 m/s) via radio buttons. The user can also click on the buttons to read more about 2D and 3D anemometers. Plus, the JavaScript-powered visualizations can be zoomed into with Plotly tools.

- Each of the visualizations (timeseries scatterplot, histogram, and regression scatterplot) includes three views corresponding to the three different metrics (wind speed, wind direction, temperature).

- The GitHub repo includes a README.md with an outline of the project.


## Research question

3D anemometers offer more comprehensive measurements than 2D anemometers by capturing wind speed and direction in three dimensions, providing a complete understanding of wind flow. This makes them ideal for complex environments and scientific research that require detailed wind analysis. However, they are typically more expensive and may be more susceptible to environmental factors such as precipitation and icing up. In contrast, 2D anemometers measure only the horizontal components of wind speed and direction, making them suitable for applications where vertical wind measurements are less critical or where there is a fair amount of precipitation.

A question is whether 2D anemometer data such as temperature, wind direction, and wind speed can be used as a substitute for the equivalent measurements from a 3D anemometer. This would be particularly beneficial during the times when a 3D anemometer is iced up. To address this question, we analyze data collected from a 2D anemometer and a 3D anemometer at the same location during the same 30-day time frame. The data from both anemometers is recorded on 5-second intervals. The data for each anemometer is first averaged over 15-minute windows (this smooths out the data as well as corresponds to how the wind data is used in practice), and then the 15-minute averaged temperatures, wind directions, and wind speeds are directly compared via time series plots, regression analysis, and binning.

| 2D anemometer        | 3D anemometer     |
|:---------------|-----------------:|
| <img src="images/2d_anemometer.png" width=150>  | <img src="images/3d_anemometer.png" width=150> |


## The Data

This study uses two datasets, both from anemometers located in North Dakota at 47.8437 N, 102.8524 W, elevation 2300 ft above sea level. The data from both anemometers spans spans 30 days from February 11, 2024 to March 11, 2024. One dataset is from is from a 2D anemometer and the other from a 3D anemometer. The anemometers measure on five-second intervals. There are two two-day gaps in the data, corresponding to when one or both of the anemometers was iced up: February 22 and 23 (both anemometers iced up) and March 3 and 4 (3D anemometer iced up). So we have a total of 26 days of data to compare. The raw 2D anemometer data contains 472,048 rows (pared down to 404,984 rows after cleaning the data) and the raw 3D anemometer data contains 420,917 rows (pared down to 420,911 rows after cleaning the data).

The relevant columns include:

- Date and time in UTC;

- Number of internal data points used to compute the measurements corresponding to a single time;

- Temperature in degrees Celsius;

- Wind direction in degrees (North: 0°, East: 90°);

- Wind speed in meters per second;

- Wind elevation in degrees (3D anemometer only).

In practice the anemometer data is averaged only 15-minute intervals. After doing so and removing rows where either the 2D or 3D data was not represented (this is all described in the data preparation section below), there were 2344 rows of data.


## Data preparation

Before analysis could ensue, the datasets had to be cleaned and columns had to be added. My data preparation was done with Python in the file [datacleaning.ipynb](datacleaning.ipynb). 

#### Data cleaning:

The various cleaning steps are described below.

- The UTC time column was changed into a datetime64 format.

- The seconds column was added to the UTC time, which curiously had all of the seconds zeroed out in the original dataset.

 - Columns that were not needed for the analysis were removed. Examples of columns that were removed were “_id”, “Origin of data”, and various pre-calculated date, hour, minute, second, and second bins that were later added back in forms more useful to this analysis.

 - Columns were renamed to clarify units (e.g. “temp” to “temp_C”, “wspd” to “wspd_mps”).

 - Rows with null values were dropped.

 - Histograms of the column data were created to check if the data had any obvious outliers or points in error. This revealed that the 2D anemometer data had a few data points with unrealistic temperatures (e.g. as low as -97°C and as high as 93°C, a bit extreme for even North Dakota in the winter!). Any rows where the temperature was outside of -30°C to 30°C were removed. The 3D anemometer did not record temperatures outside of this range.

- The measurements from the anemometers are in five-second intervals. An individual measurement is an internal computation from several data points taken over the preceding five seconds. This number is given in the “n_pts” column.  A typical measurement from the 3D anemometer is computed from about 100 individual data points while a typical measurement from the 2D anemometer is computed from about 25 individual data points. The histograms indicated that some measurements had just a couple of data points contributing to the measurement. Any rows where the number of internal data points was less than five were removed.  

- The data was checked for duplicate rows. There were no duplicate rows. 

- To make the wind speeds from the 3D anemometer comparable with the wind speeds from the 2D anemometer, the wind speed from the 3D anemometer was adjusted to just the horizontal component multiplying by the cosine of the wind elevation. The wind elevation angles are generally small, so this correction had very little effect on the wind speeds.

- The two anemometers corresponded to different heights above the ground. The 3D anemometer is 3 meters above the ground, the 2D anemometer is 5.2 meters above the ground. To be comparable, the wind speeds were corrected using the wind shear formula (v_2=v_1  ((h_2/z_0 )  )/((h_1/z_0 ) ), where v_1 is the reference wind speed measured at height h_1, v_2 is the wind speed at height h_2, and z_0 is the roughness length which depends on the terrain).  The height of the 3D anemometer was used for reference, and the 2D anemometer wind speeds were corrected to represent a height of 3 meters above the ground.

#### New columns:

The columns that were added are described below.

- To make the time series plots more representative of a local day (midnight to midnight), a column for local time was added. The location of the anemometers is in Central Time, which is UTC -06:00, so computing local time involved subtracting 6 hours from the UTC time.

- Columns were added for date and hour of day, both in local time.

- A column was added for minute. This was used for binning into 15-minute intervals.

- A column was added to bin the 2D and 3D anemometer data into 15-minute intervals, starting on the hour. This was used for averaging the temperature, wind speed, and wind direction over every 15 minutes. This smooths out the data as well as corresponds to how the wind data is used in practice.

- Columns were added for the cosines and sines of the wind direction. This was needed for the circular averaging of the wind direction over the 15-minute bins. Circular averaging averages the east-west and north-south components separately, and then computes the average wind angle by finding the arctangent of the ratio of the components. Also, the cosine and sine components of the wind direction were needed for the multilinear regression models. Standard linear regression cannot handle the circular nature of time properly because it assumes a linear relationship and does not account for the circular wrap-around of angles.

- A column was added for temperature in degrees Fahrenheit. Fahrenheit is the unit used for the plots, being more commonplace in the United States than Celsius.

- A column was added for wind speed in miles per hour. Miles per hour is the unit used for the plots, being more commonplace in the United States than meters per second.

#### Joined dataframe: 

Now that the data was cleaned and the necessary columns added, it was time to merge the two datasets to allow for direct comparison of the data for the same times. New dataframes (designated “data_2d_15min” and “data_3d_15min”) were created for each of the 2D and 3D anemometer data sets, by averaging temperature, wind direction, and wind speed over 15-minute intervals. The wind direction was averaged using circular averaging. Circular averaging averages the east-west and north-south components separately, and then computes the average wind angle by finding the arctangent of the ratio of the components. Finally, a dataframe “df_2d_and_3d” was created via an outer join of the 15-minute averaged 2D anemometer data with the 15-minute averaged 3D anemometer data, joining on date, hour, and 15-minute bin. For all but the four days where one or both of the anemometers were iced up, this gives a 1 to 1 comparison of measurements. All rows with null values were removed. New columns were added for the differences between the 15-minute average 2D and 3D (2D-3D) wind speed, wind direction, and temperature for the same 15-minute windows.

The joined dataframe of 15-minute averages for both anemometers was exported into a .csv, which was the data used for the dashboard. This joined dataframe had 2344 rows of data.


## The elements of the dashboard

I deployed my repository to GitHub Pages. The interactive dashboard I created in this assignment can be displayed and interacted with at the following link. 

https://sabegg2.github.io/Project3/

The elements of the dashboard are:

(1a) A radio button list with three options: Wind Speed, Wind Direction, Temperature. This allows different data to be to be selected and viewed. All of the plots and metadata update when a new option is selected. The Wind Speed is the default when the page first loads.
(1b) A radio button filter with two options: All wind speeds, or wind speeds greater than 1m/s (2.2 mph). All of the plots and metadata update when a new option is selected. The All wind speeds is the default when the page first loads.

<img src="images/select.png" width=400>

(2) A time series that shows the 2D and 3D anemometer data over time, as well as the difference between the measurements corresponding to the same 15-minute window. The user can zoom into the plot using the Plotly zoom feature.

<img src="images/timeseries.png" width=900>

(3) A histogram for the differences between the measurements. The histogram also shows the average and median of the differences over the 30-day span of data.

<img src="images/histogram.png" width=500>

(4) A scatterplot of 2D vs. 3D data. A regression line and R^2 value is shown on the plot as well. The points are colored by wind speed.

<img src="images/regression.png" width=500>

(5) Popups that show images of the 2D and 3D anemometers with a brief description.

<img src="images/popup.png" width=200> <img src="images/popup2D.png" width=200>  <img src="images/popup3D.png" width=200>


The javascript and html files for the dashboard are [app.js](static/js/app.js) and [index.html](index.html).

## Instructions on how to use and interact with the project

The dashboard is a single page showing three graphs: timeseries, histogram of differences, and scatterplot with regression line. Use the radio buttons on the upper right of the page to display either wind speed, wind direction, or temperature data. Radio buttons can also be used to filter the data to points with wind speeds > 1 m/s. Click the buttons to read more about 2D and 3D anemometers.

## Data analysis

#### Timeseries comparison

| All wind speeds             |
|:----------------:|
| <img src="images/timeseries_wspd.png" width=900>   |
| <img src="images/timeseries_wdr.png" width=900>  |
| <img src="images/timeseries_temp.png" width=900>  |

The images above show timeseries of the 15-minute averaged wind speed, wind direction, and temperature measurements of both the 2D (green) and 3D (blue) anemometers over the 30-day span of data. This is for all wind speeds. Visually, the 2D and 3D anemometer data for all dependent variables line up well. The purple dots show the difference (2D-3D) between the 15-minute averages. These differences hover near zero and are within the tolerances of the measurements (e.g. the tolerance of a wind direction measurement is 20 degrees, and the wind direction difference between the 2D and 3D anemometer measurements falls well below this value; a similar argument can be made for the difference in temperatures and wind speeds).  

#### Histogram analysis

| All wind speeds        | Wind speed > 1 m/s (2.2 mph)      |
|:---------------|-----------------:|
| <img src="images/hist_wspd.png" width=300> | <img src="images/hist_wspd_greater1.png" width=300>   |
| <img src="images/hist_wdr.png" width=300>  | <img src="images/hist_wdr_greater1.png" width=300> |
| <img src="images/hist_temp.png" width=300> | <img src="images/hist_temp_greater1.png" width=300> |

The histograms show a distribution of the differences between the 2D and 3D anemometer data. The histograms on the right filter the data to wind speeds > 1 m/s (2.2 mph).

Over the 30-day span of data:

- The average wind speed difference (2D-3D) between the 2D and 3D anemometers was only -0.3 miles per hour, even when wind speeds were filtered to > 1 m/s (2.2 mph). This is surprisingly small given the scatter in wind speeds.

- The average wind direction difference (2D-3D) between the 2D and 3D anemometers was -2.5 degrees. When the wind speed is filtered to > 1 m/s (2.2 mph), the average wind direction difference (2D-3D) is -4.2 degrees and the larger wind speed differences are filtered out. These average differences are well within the 20 degree (or so) tolerance of a wind direction measurement from an anemometer. When the wind speed is > 1m/s, most of the individual differences are also within the tolerance of the anemometer.
  
- The average temperature difference (2D-3D) between the 2D and 3D anemometers was about 0.9°F, where the 2D anemometer recorded slightly higher temperatures on average.  When the wind speed is filtered to > 1 m/s (2.2 mph), the average temperature difference (2D-3D) decreases to about 0.75°F and the larger temperature differences are filtered out.


#### Regression analysis

| All wind speeds        | Wind speed > 1 m/s (2.2 mph)      |
|:---------------|-----------------:|
| <img src="images/reg_wspd.png" width=300> | <img src="images/reg_wspd_greater1.png" width=300>   |
|  <img src="images/reg_wdr.png" width=300>  | <img src="images/reg_wdr_greater1.png" width=300> |
| <img src="images/reg_temp.png" width=300> | <img src="images/reg_temp_greater1.png" width=300> |

The 2D and 3D anemometers are from the same location, so under ideal behavior they would record the same measurements, barring for small differences due to height and terrain. Linear regressions were conducted to quantify the linear relationship between the measurements of the two anemometers. The data is colored on a gradient corresponding to wind speed, the metric that has greatest effect on scatter.

The images above show the linear regression between the 15-minute averaged temperature measurements of the two anemometers. The R^2 values are quite high (0.90 or higher) for all three variables, indicating a strong linear relationship. When the wind speed is filtered to > 1 m/s (2.2 mph), the wind direction and tempearture regressions show even less scatter and higher R^2 values. These are all positive linear relationships. The R^2 value is the lowest for the wind speed regression, indicating a bit more scatter with that variable between the two anemometers. Perhaps wind speed varies slightly over small distances (the anemometers are not far apart) or that wind speed just has a higher error of measurement. After all, the average difference in wind speeds between the two anemometers is only -0.3 mph, indicating that the scatter has no bias. Also, the points further from the regression lines for the wind direction and temperature tend to have lower wind speeds. It makes sense that calm winds tend to have a less definite wind direction. One possible theory for the temperature scatter at lower wind speed that the 2D anemometer is located in an area where the surroundings tend to absorb heat a bit more than around the 3D anemometer, leading to slightly elevated temperatures if there is less wind to blow the heat away.

#### Overall conclusion

Based on this analysis, the measurements of wind speed, wind direction, and temperature from the 2D and 3D anemometer show themselves to be very similar and with a strong linear relationship. There is some scatter in the data, but when averaged over time, the values are within a reasonable error tolerance. Removing data with low wind speeds (less than 1m/s, the typical threshold for reliable measurements anyway) reduces the scatter. This all suggests that the 2D anemometer data can be used instead of the 3D anemometer data if needed.


## Database

In this project, we were required to store and extract the data from at least one database. I used pgAdmin. My SQL schema is [anemometer_db_schema.sql](anemometer_db_schema.sql). To access the data directly from the app (this would be useful if the database were updated), I wrote a Node.js server ([server.js](static/js/app.js)) that queries my PostgreSQL database and serves the data over HTTP as a json file. For the data to display, my local server needs to be running. So for the purposes of my final project submission, I just included a static data.json file output by the database.


## New libraries not covered in class

In this project, we were required to include at least one JavaScript or Python library that we did not cover in class. 

For the purpose of accessing the database directly from the app, I used three new libraries: pg, express, and cors. The pg library is used to interact with PostgreSQL databases from a Node.js application. The express library is a fast, minimalist web framework for Node.js, used to build web servers and APIs. The cors library provides middleware to enable Cross-Origin Resource Sharing (CORS) in an Express application. CORS allows your server to handle requests from different origins (domains, ports).

I also used SweetAlert2 JavaScript library, which provides customizable alerts, modals, and popups. I created two popups showing images and descriptions of the two anemometer types (2D and 3D).


## Ethical considerations

The data used in this study was from two anemometers located at a site in North Dakota. The anemometers and the data they provide are property of LongPath Technologies, Inc. Since historical wind data is accessible to anyone who wants to install their own anemometer or from several local forecasting stations, the data is not considered confidential. There is no identifying information about the site or persons involved, so there are no ethical issues with its usage.


## Assumptions made in this study

- The anemometers are oriented correctly and were in normal operation during the timespan of the datasets.

- The wind shear formula applies to correcting the wind speeds for height.
    
- Both anemometers are placed in the open and surrounded by similar terrain and not located close to any heat sink or source.

- The anemometer data was collected for 30 days during the winter in North Dakota, when weather can be quite harsh. This analysis assumes that the weather and conditions do not affect the results.  It also assumes that this 30-day window is representative of general behavior at any time.


## References for data

The wind data was provided by LongPath Technologies, Inc., a methane-gas monitoring service based in Boulder, Colorado. I am a data analyst for LongPath Technologies, Inc. The data was collected at one of the sites they monitor. [https://www.longpathtech.com/](https://www.longpathtech.com/).


## References for code

For the most part, I wrote my code on my own, using techniques learned in class. I find ChatGTP to be a great helper for directing me on the correct path. The main significant pieces of code that I pulled directly from ChatGTP are:

- The server.js code for connecting with the pgAdmin database.
- The code to write a median function for computing the median for the histogram.
- The code for creating the SweetAlert2 popups.
