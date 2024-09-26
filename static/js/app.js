function buildTimeseries(option) {
    // Fetch data from the local Node.js server
      d3.json('http://localhost:3000/data').then(function(timeSeriesData) {

        if (option == "Wind Speed") {
            var data2D = timeSeriesData.map(entry => entry.wspd_mph_2d);
            var data3D = timeSeriesData.map(entry => entry.wspd_mph_3d);
            var Diff = timeSeriesData.map(entry => entry.wspd_mph_diff);
            var plot_title = 'Timeseries of Wind Speed';
            var y_axis_label = 'Wind Speed (mph)';
            var name2D = 'Wind Speed 2D (mph)';
            var name3D = 'Wind Speed 3D (mph)';
            var nameDiff = 'Wind Speed diffrence, 2D-3D';
        } else if (option == "Wind Direction") {
            var data2D = timeSeriesData.map(entry => entry.wdr_2d);
            var data3D = timeSeriesData.map(entry => entry.wdr_3d);
            var Diff = timeSeriesData.map(entry => entry.wdr_diff);
            var plot_title = 'Timeseries of Wind Direction';
            var y_axis_label = 'Wind Direction (degrees)';
            var name2D = 'Wind Direction 2D (degrees)';
            var name3D = 'Wind Direction 2D (degrees)';
            var nameDiff = 'Wind Direction diffrence, 2D-3D';
        } else {
            var data2D = timeSeriesData.map(entry => entry.temp_f_2d);
            var data3D = timeSeriesData.map(entry => entry.temp_f_3d);
            var Diff = timeSeriesData.map(entry => entry.temp_f_diff);
            var plot_title = 'Timeseries of Temperature';
            var y_axis_label = 'Temperature (F)';
            var name2D = 'Temperature 2D (F)';
            var name3D = 'Temperature 3D (F)';
            var nameDiff = 'Temperature diffrence, 2D-3D';
        }
        
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
              y: Diff,
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

function buildHistogram(option) {
    // Fetch data from the local Node.js server
      d3.json('http://localhost:3000/data').then(function(timeSeriesData) {

        if (option == "Wind Speed") {
            var Diff = timeSeriesData.map(entry => entry.wspd_mph_diff);
            var plot_title = 'Histogram of Wind Speed Differences';
            var x_axis_label = 'Diff, 2D-3D (mph)';
        } else if (option == "Wind Direction") {
            var Diff = timeSeriesData.map(entry => entry.wdr_diff);
            var plot_title = 'Histogram of Wind Direction Differences';
            var x_axis_label = 'Diff, 2D-3D (degrees)';
        } else {
            var Diff = timeSeriesData.map(entry => entry.temp_f_diff);
            var plot_title = 'Histogram of Temperature Differences';
            var x_axis_label = 'Diff, 2D-3D (F)';
        }

      // Calculate the average
      let total = Diff.reduce((sum, value) => sum + value, 0);
      let avg = total / Diff.length;

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
      let median = calculateMedian(Diff);
        
      // Define the histogram trace
      let trace = {
          x: Diff,  // Data to plot
          type: 'histogram',  // Set type as histogram
          marker: {
              color: 'purple'  // Set color of the bars
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

function buildRegression(option) {
  // Fetch data from the local Node.js server
    d3.json('http://localhost:3000/data').then(function(timeSeriesData) {

      if (option == "Wind Speed") {
        var data2D = timeSeriesData.map(entry => entry.wspd_mph_2d);
        var data3D = timeSeriesData.map(entry => entry.wspd_mph_3d);
        var color_by = timeSeriesData.map(entry => entry.wspd_mph_3d);
        var plot_title = 'Regression of Wind Speed, 2D vs. 3D';
        var y_axis_label = 'Wind Speed 2D (mph)';
        var x_axis_label = 'Wind Speed 3D (mph)';
      } else if (option == "Wind Direction") {
        var data2D = timeSeriesData.map(entry => entry.wdr_2d);
        var data3D = timeSeriesData.map(entry => entry.wdr_3d_corr);
        var color_by = timeSeriesData.map(entry => entry.wspd_mph_3d);
        var plot_title = 'Regression of Wind Direction, 2D vs. 3D';
        var y_axis_label = 'Wind Direction 2D (degrees)';
        var x_axis_label = 'Wind Direction 3D (degrees)';
      } else {
        var data2D = timeSeriesData.map(entry => entry.temp_f_2d);
        var data3D = timeSeriesData.map(entry => entry.temp_f_3d);
        var color_by = timeSeriesData.map(entry => entry.wspd_mph_3d);
        var plot_title = 'Regression of Temperature, 2D vs. 3D';
        var y_axis_label = 'Temperature 2D (F)';
        var x_axis_label = 'Temperature 3D (F)';
      }

      // Calculate the regression line
      function linearRegression(x, y) {
        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
        const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0); // Sum of squares of y

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // Calculate R²
        const ssTotal = sumYY - (sumY * sumY) / n; // Total sum of squares
        const ssResidual = sumYY - slope * sumXY - intercept * sumY; // Residual sum of squares
        const rSquared = 1 - (ssResidual / ssTotal); // R² value

        return { slope, intercept, rSquared };
      }

      const { slope, intercept, rSquared } = linearRegression(data3D, data2D);

      // Generate y values for the regression line
      const regressionLine = data3D.map(xi => slope * xi + intercept);
  
      // Prepare data for Plotly
      const scatterTrace = {
            x: data3D,
            y: data2D,
            type: 'scatter',
            mode: 'markers',
            marker: {
              color: color_by, // Use y values for coloring
              colorscale: 'Viridis', // Choose a colorscale
              size: 4, // Size of the points
              colorbar: { // Add a colorbar
                  title: 'Wind speed (mph)'
              }
            },
            name: "data"
        };

      // Define the line plot for the regression line
      const lineTrace = {
          x: data3D,
          y: regressionLine,
          mode: 'lines',
          type: 'scatter',
          name: 'Regression Line',
          line: { color: 'red' }
      };

      const data = [scatterTrace, lineTrace];
  
      // Set up layout
      const layout = {
          title: plot_title,
          xaxis: {
              title: x_axis_label,
          },
          yaxis: {
              title: y_axis_label,
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

// Function for event listener
function optionChanged(option) {
  buildTimeseries(option);
  buildHistogram(option);
  buildRegression(option);
}

// Function to run on page load
function init() {
  
    // Use d3 to select the dropdown with id of `#selMetric`
    let selector = d3.select("#selMetric");

    let optionsList = [
      "Wind Speed",
      "Wind Direction",
      "Temperature"
  ];

    // Populate the selector with options
    optionsList.forEach((option) => {
    selector
      .append("option")
      .text(option)
      .property("value", option);
});

    // Build charts and metadata panel for wind speed
    buildTimeseries("Wind Speed");
    buildHistogram("Wind Speed");
    buildRegression("Wind Speed");
  };


// Initialize the dashboard
init();