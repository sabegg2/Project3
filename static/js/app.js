//let data_location = 'http://localhost:3000/data' // must navigate to folder containing js files and type "node server.js" in terminal
let data_location = 'data/data.json'  // go to http://localhost:8000

// Function to build timeseries
function buildTimeseries(plotType, speedFilter) {
  // Fetch data from the local Node.js server
  d3.json(data_location).then(function(timeSeriesData) {
      
    // Combine date and hour into a single Date object
    let combinedDates = timeSeriesData.map(entry => {
      // Extract the base date-time (without the time component)
      let baseDateTimeString = entry.date.split('T')[0]; // e.g., "2024-02-15"
      // Format hour to ensure two digits (e.g., 9 becomes "09")
      let formattedHour = String(entry.hour).padStart(2, '0');
      // Create a new date-time string with the hour
      let newDateTimeString = `${baseDateTimeString}T${formattedHour}:00:00.000Z`; // e.g., "2024-02-15T09:00:00.000Z"
      // Create a Date object
      return new Date(newDateTimeString);
    });
        
    // Get y-values depending on plotType
    if (plotType == "Wind Speed") {
      var data2D = timeSeriesData.map(entry => entry.wspd_mph_2d);
      var data3D = timeSeriesData.map(entry => entry.wspd_mph_3d);
      var diff = timeSeriesData.map(entry => entry.wspd_mph_diff);
      var plot_title = 'Timeseries of Wind Speed';
      var y_axis_label = 'Wind Speed (mph)';
      var name2D = 'Wind Speed 2D (mph)';
      var name3D = 'Wind Speed 3D (mph)';
      var nameDiff = 'Wind Speed diffrence, 2D-3D';
    } else if (plotType == "Wind Direction") {
      var data2D = timeSeriesData.map(entry => entry.wdr_2d);
      var data3D = timeSeriesData.map(entry => entry.wdr_3d);
      var diff = timeSeriesData.map(entry => entry.wdr_diff);
      var plot_title = 'Timeseries of Wind Direction';
      var y_axis_label = 'Wind Direction (degrees)';
      var name2D = 'Wind Direction 2D (degrees)';
      var name3D = 'Wind Direction 2D (degrees)';
      var nameDiff = 'Wind Direction diffrence, 2D-3D';
    } else {
      var data2D = timeSeriesData.map(entry => entry.temp_f_2d);
      var data3D = timeSeriesData.map(entry => entry.temp_f_3d);
      var diff = timeSeriesData.map(entry => entry.temp_f_diff);
      var plot_title = 'Timeseries of Temperature';
      var y_axis_label = 'Temperature (F)';
      var name2D = 'Temperature 2D (F)';
      var name3D = 'Temperature 3D (F)';
      var nameDiff = 'Temperature diffrence, 2D-3D';
    }
    // Filter y-values depending on speedFilter
    let wspd3D = timeSeriesData.map(entry => entry.wspd_mph_3d);
    if (speedFilter === 'Wind speed > 1 m/s (2.2mph)') {
      data2D = data2D.filter((_, i) => wspd3D[i] >= 2.24);
      data3D = data3D.filter((_, i) => wspd3D[i] >= 2.24);
      diff = diff.filter((_, i) => wspd3D[i] >= 2.24);
      combinedDates = combinedDates.filter((_, i) => wspd3D[i] >= 2.24);
    }
      
    // Prepare data for Plotly
    let data = [
      {
        x: combinedDates,
        y: data2D,
        type: 'scatter',
        mode: 'lines+markers',
        name: name2D,
        line: { color: 'green' }
      },
      {
       x: combinedDates,
        y: data3D,
        type: 'scatter',
        mode: 'lines+markers',
        name: name3D,
        line: { color: 'blue' }
      },
      {
        x: combinedDates,
        y: diff,
        type: 'scatter',
        mode: 'lines+markers',
        name: nameDiff,
        line: { color: 'purple' }
      }
    ];
    
    // Generate ticks for every unique date
    let uniqueDates = [...new Set(combinedDates.map(date => date.toISOString().split('T')[0]))];
    let tickVals = uniqueDates.map(date => new Date(date).getTime()); // Convert to milliseconds for Plotly
    let tickTexts = uniqueDates; // Use date strings as labels
    
    // Set up layout
    let layout = {
      title: plot_title,
      xaxis: {
        // title: 'Date',
        type: 'date', // Specify x-axis as date
        tickvals: tickVals, // Set tick values
        ticktext: tickTexts, // Set tick labels
        tickformat: '%Y-%m-%d', // Format of ticks on x-axis
        tickangle: -90
      },
      yaxis: {
        title: y_axis_label,
      },
      legend: {
        orientation: 'h', // Horizontal legend
        x: 0.5, // Centered horizontally
        y: 1, // Above the plot area
        xanchor: 'center', // Anchor the x position
        yanchor: 'bottom' // Anchor the y position
      }
    };
    
    // Plot the data
    Plotly.newPlot('timeseries', data, layout);
    
  });
}  

// Function to build histogram
function buildHistogram(plotType, speedFilter) {
  // Fetch data from the local Node.js server (in terminal: node server.js)
  d3.json(data_location).then(function(timeSeriesData) {
        
    // Get values depending on plotType
    if (plotType == "Wind Speed") {
      var diff = timeSeriesData.map(entry => entry.wspd_mph_diff);
      var plot_title = 'Histogram of Wind Speed Differences';
      var x_axis_label = 'Diff, 2D-3D (mph)';
      var bin_size = .25;
    } else if (plotType == "Wind Direction") {
      var diff = timeSeriesData.map(entry => entry.wdr_diff);
      var plot_title = 'Histogram of Wind Direction Differences';
      var x_axis_label = 'Diff, 2D-3D (degrees)';
      var bin_size = 1;
    } else {
      var diff = timeSeriesData.map(entry => entry.temp_f_diff);
      var plot_title = 'Histogram of Temperature Differences';
      var x_axis_label = 'Diff, 2D-3D (F)';
      var bin_size = .5;
    }

    // Filter values depending on speedFilter
    let wspd3D = timeSeriesData.map(entry => entry.wspd_mph_3d);
    if (speedFilter === 'Wind speed > 1 m/s (2.2mph)') {
      diff = diff.filter((_, i) => wspd3D[i] >= 2.24);
    }

    // Calculate the average
    let total = diff.reduce((sum, value) => sum + value, 0);
    let avg = total / diff.length;

    // Function to calculate the median
    function calculateMedian(arr) {
      let sorted = [...arr].sort((a, b) => a - b);
      let middle = Math.floor(sorted.length / 2);

      if (sorted.length % 2 === 0) {
        // If even number of elements, take average of the two middle numbers
        return (sorted[middle - 1] + sorted[middle]) / 2;
      } else {
        // If odd, return the middle element
        return sorted[middle];
      }
    }
    let median = calculateMedian(diff);
     
    

    // Define the histogram trace
    let trace = {
      x: diff,  // Data to plot
      type: 'histogram',  // Set type as histogram
      marker: {
        color: 'purple'  // Set color of the bars
      },
      xbins: {
        start: Math.floor(Math.min(...diff)),   // Starting point of the first bin
        end: Math.ceil(Math.max(...diff)),    // End point of the last bin
        size: bin_size     // Width of each bin
      },
    };

    // Set up the layout for the chart
    let layout = {
      title: plot_title,  // Title of the plot
      xaxis: { title: x_axis_label },  // X-axis label
      yaxis: { title: 'Frequency' },  // Y-axis label (frequency count)
      shapes: [
        // Average line
        {
          type: 'line',
          x0: avg, 
          x1: avg,
          y0: 0, 
          y1: 1, 
          xref: 'x', 
          yref: 'paper', 
          line: {
            color: 'red',
            width: 2,
            dash: 'dot'
          }
        },
        // Median line
        {
          type: 'line',
          x0: median, 
          x1: median,
          y0: 0, 
          y1: 1, 
          xref: 'x', 
          yref: 'paper', 
          line: {
            color: 'pink',
            width: 2,
            dash: 'dash' // Dash line for median
          }
        }
      ],
      annotations: [
      // Average annotation
        {
          x: avg,
          y: 1.05, 
          xref: 'x',
          yref: 'paper',
          text: `Average: ${avg.toFixed(2)}`, 
          showarrow: false,
          font: {
            size: 14,
            color: 'red'
          }
        },
      // Median annotation
        {
          x: median,
          y: 1.10, 
          xref: 'x',
          yref: 'paper',
          text: `Median: ${median.toFixed(2)}`, 
          showarrow: false,
          font: {
            size: 14,
            color: 'pink'
          }
        }
      ]
    };

    // Plot the histogram
    Plotly.newPlot('histogram', [trace], layout);
    
  });
}  

// Function to build regression
function buildRegression(plotType, speedFilter) {
  // Fetch data from the local Node.js server
  d3.json(data_location).then(function(timeSeriesData) {
    // Get values depending on plotType
    if (plotType == "Wind Speed") {
      var data2D = timeSeriesData.map(entry => entry.wspd_mph_2d);
      var data3D = timeSeriesData.map(entry => entry.wspd_mph_3d);
      var plot_title = 'Regression of Wind Speed, 2D vs. 3D';
      var y_axis_label = 'Wind Speed 2D (mph)';
      var x_axis_label = 'Wind Speed 3D (mph)';
    } else if (plotType == "Wind Direction") {
      var data2D = timeSeriesData.map(entry => entry.wdr_2d);
      var data3D = timeSeriesData.map(entry => entry.wdr_3d_corr);
      var plot_title = 'Regression of Wind Direction, 2D vs. 3D';
      var y_axis_label = 'Wind Direction 2D (degrees)';
      var x_axis_label = 'Wind Direction 3D (degrees)';
    } else {
      var data2D = timeSeriesData.map(entry => entry.temp_f_2d);
      var data3D = timeSeriesData.map(entry => entry.temp_f_3d);
      var plot_title = 'Regression of Temperature, 2D vs. 3D';
      var y_axis_label = 'Temperature 2D (F)';
      var x_axis_label = 'Temperature 3D (F)';
    }
    let color_by = timeSeriesData.map(entry => entry.wspd_mph_3d);
        
    // Filter values depending on speedFilter
    let wspd3D = timeSeriesData.map(entry => entry.wspd_mph_3d);
    if (speedFilter === 'Wind speed > 1 m/s (2.2mph)') {
      data2D = data2D.filter((_, i) => wspd3D[i] >= 2.24);
      data3D = data3D.filter((_, i) => wspd3D[i] >= 2.24);
      color_by = color_by.filter((_, i) => wspd3D[i] >= 2.24);
    }

    // Calculate the regression line
    function linearRegression(x, y) {
      let n = x.length;
      let sumX = x.reduce((a, b) => a + b, 0);
      let sumY = y.reduce((a, b) => a + b, 0);
      let sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
      let sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
      let sumYY = y.reduce((sum, yi) => sum + yi * yi, 0); // Sum of squares of y

      let slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      let intercept = (sumY - slope * sumX) / n;

      // Calculate R²
      let ssTotal = sumYY - (sumY * sumY) / n; // Total sum of squares
      let ssResidual = sumYY - slope * sumXY - intercept * sumY; // Residual sum of squares
      let rSquared = 1 - (ssResidual / ssTotal); // R² value

      return { slope, intercept, rSquared };
    }
      
    // Generate y values for the regression line
    let { slope, intercept, rSquared } = linearRegression(data3D, data2D);
    let regressionLine = data3D.map(xi => slope * xi + intercept);
  
    // Prepare data for Plotly
    let scatterTrace = {
      x: data3D,
      y: data2D,
      type: 'scatter',
      mode: 'markers',
      marker: {
          color: color_by, // Use wind speed values for coloring
          colorscale: 'Viridis', // Choose a colorscale
          cmin: 0,                 // Force the color scale to start at 0
          cmax: Math.max(...color_by),
          size: 4, // Size of the points
          colorbar: { // Add a colorbar
              title: 'Wind speed (mph)',
              tickvals: [0,5,10,15,20], // Tick values
              ticktext: ['0', '5', '10', '15', '20'] // Tick text
          }
      },
      name: "data"
    };

    // Define the line plot for the regression line
    let lineTrace = {
      x: data3D,
      y: regressionLine,
      mode: 'lines',
      type: 'scatter',
      name: 'Regression Line',
      line: { color: 'red' }
    };

    let data = [scatterTrace, lineTrace];
  
    // Set up layout
    let layout = {
      title: plot_title,
      xaxis: {
          title: x_axis_label,
          range: [Math.min(0,...data3D), Math.max(...data3D)],  // Force the x-axis to start at 0, dynamically set max based on data
          zeroline: true   // Show the line for x=0
      },
      yaxis: {
          title: y_axis_label,
          range: [Math.min(0,...data2D), Math.max(...data2D)],  // Force the y-axis to start at 0, dynamically set max based on data
          zeroline: true  // Show the line for y=0
      },
      annotations: [{
          x: 0.1, // x coordinate for annotation
          y: 0.9, // y coordinate for annotation
          text: `R²: ${rSquared.toFixed(4)}`, // Annotation text
          showarrow: false,
          font: {
              size: 16,
              color: 'red'
          },
          xref: 'paper', // Use paper coordinates
          yref: 'paper'  // Use paper coordinates
      }],
      legend: {
          orientation: 'h', // Horizontal legend
          x: 0.5, // Centered horizontally
          y: 1, // Above the plot area
          xanchor: 'center', // Anchor the x position
          yanchor: 'bottom' // Anchor the y position
      }
    };

  
    // Plot the data
    Plotly.newPlot('regression', data, layout);
  
  });
}  

// Function to build all plots
function builtAllPlots(plotType, speedFilter) {
  buildTimeseries(plotType, speedFilter);
  buildHistogram(plotType, speedFilter);
  buildRegression(plotType, speedFilter);
}

// Function if a different radio button selected
function optionChanged(option) {

  let radioButtons1 = document.getElementsByName('plotType');
  // Loop through the radio buttons to find the checked one
  for (let radioButton of radioButtons1) {
    if (radioButton.checked) {
      var plotType = radioButton.value; // Return the value of the checked radio button
    }
  }
 
  let radioButtons2 = document.getElementsByName('speedFilter');
  // Loop through the radio buttons to find the checked one
  for (let radioButton of radioButtons2) {
    if (radioButton.checked) {
      var speedFilter = radioButton.value; // Return the value of the checked radio button
    }
  }

  builtAllPlots(plotType, speedFilter);
}

// Function to run on page load
function init() {
  
  // Use d3 to select the div with id of #plotType
  let plotTypeSelector = d3.select("#plotType");

  // Add plot types
  let plotTypeList = [
    "Wind Speed",
    "Wind Direction",
    "Temperature"
  ];

  // Populate the selector with radio buttons
  plotTypeList.forEach((option, index) => {
    plotTypeSelector
      .append("label")  // Create a label for each radio button
      .html(`<input type="radio" name="plotType" value="${option}" id="plotType${index}" ${index === 0 ? 'checked' : ''} onchange="optionChanged(this.value)"> ${option}`)
      .attr("for", `plotType${index}`);
  });

  // Use d3 to select the div with id of #speedFilter
  let speedFilterSelector = d3.select("#speedFilter");

  // Add speeds
  let speedFilterList = [
    "All wind speeds",
    "Wind speed > 1 m/s (2.2mph)"
  ];

  // Populate the selector with radio buttons
  speedFilterList.forEach((option, index) => {
    speedFilterSelector
      .append("label")  // Create a label for each radio button
      .html(`<input type="radio" name="speedFilter" value="${option}" id="speedFilter${index}" ${index === 0 ? 'checked' : ''} onchange="optionChanged(this.value)"> ${option}`)
      .attr("for", `speedFilter${index}`);
  });

  // Build charts and metadata panel for wind speed
  optionChanged();
};

// Initialize the dashboard
init();