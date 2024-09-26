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

2626 rows of 15-minute averaged 2d and 3d anemometer data.

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

## Files

The javascript and html files are:

[app.js](static/js/app.js)

[index.html](index.html)

## Database

Data stored in and extracted from at least one database (pgAdmin). To run, I wrote a simple Node.js server that will query your PostgreSQL database and serve the data over HTTP as a json file. H

[anemometer_db_schema.sql](anemometer_db_schema.sql)

[server.js](static/js/app.js)



## Data Preparation

I did a significant amout of data cleaning to prepare the 2d and 3d datasets used in the visualizations.

[datacleaning.ipynb](datacleaning.ipynb)

## New Library Not Covered in Class

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');  // Import the CORS package

You need a server-side language (e.g., Node.js, Python, PHP) to query the PostgreSQL database. This server will act as an intermediary between your database and D3.js in the browser.
Install necessary dependencies:

pg: PostgreSQL client for Node.js.
express: To set up a server.

Now, write a simple Node.js server that will query your PostgreSQL database and serve the data over HTTP.

Summary of the Flow:
Node.js server connects to PostgreSQL and queries the database.
The data from PostgreSQL is exposed via an API endpoint (e.g., /data).
D3.js in the front-end fetches the data from this API endpoint using d3.json() and visualizes it.

You need to configure your Node.js server to allow cross-origin requests by adding CORS headers.

Here’s how you can fix it by adding CORS support to your Node.js app.

1. Install the cors package:
