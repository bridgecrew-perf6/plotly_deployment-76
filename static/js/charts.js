function init() {
  // Grab a reference to the dropdown select element
  let selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/json/samples.json").then((data) => {
    let sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    let firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("static/json/samples.json").then((data) => {
    let metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    let PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1.1 Create the buildCharts function.
function buildCharts(sample) {
  // 1.2 Use d3.json to load and retrieve the samples.json file 
  d3.json("static/json/samples.json").then((data) => {
    // 1.3 Create a variable that holds the samples array. 
    let samples = data.samples;
    // 1.4 Create a variable that filters the samples for the object with the desired sample number.
    let samplesArray = samples.filter(sampleObj => sampleObj.id == sample)
    
    // 3.1 Create a variable that filters the metadata array for the object with the desired sample number.
    let meta = data.metadata;
    let meta1 = meta.filter(sampleObj => sampleObj.id == sample);

    // 1.5 Create a variable that holds the first sample in the array.
    let samplesFirst = samplesArray[0]

    // 3.2 Create a variable that holds the first sample in the metadata array.
    let metaArray = meta1[0];

    // 1.6 Create variables that hold the otu_ids, otu_labels, and sample_values.
    let samples_otu_ids = samplesFirst.otu_ids;
    let samples_otu_labels = samplesFirst.otu_labels;
    let samples_sample_values = samplesFirst.sample_values;

    // 3.3 Create a variable that holds the washing frequency.
    let meta_wFreq = parseInt(metaArray.wfreq);

    // 1.7 Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    let yticks = samples_otu_ids.slice(0,10)
    let yticks2 = yticks.map(x => `OTU ${x}`).reverse()

    let barX = samples_sample_values.slice(0,10).reverse()

    // 1.8 Create the trace for the bar chart. 
    let barData = [{
      x: barX,
      y: yticks2,
      type: "bar",
      orientation: "h"
    }];

    // 1.9 Create the layout for the bar chart. 
    let barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>",
    };
    // 1.10 Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout); 

    // 2.1 Create the trace for the bubble chart.
    let bubbleData1 = {
      x: samples_otu_ids,
      y: samples_sample_values,
      text: samples_otu_labels,
      mode: 'markers',
      marker: {
        size: samples_sample_values,
        color: samples_otu_ids,
        colorscale: "Earth"
      }
    };

    let bubbleData = [bubbleData1]

    // 2.2 Create the layout for the bubble chart.
    let bubbleLayout = {
      title: "<b>Bacteria Cultures Per Sample</b>",
      xaxis: {
        title: "OTU ID",
        range: [-100,3300]
      },
      hovermode: 'closest',
      margin: {
        l: 60,
        r: 0,
        t: 30,
        b: 50
      }
    };

    // 2.3 Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // 3.4 Create the trace for the gauge chart.
    let gaugeData1 = {
      domain: { x: [0, 1], y: [0, 1] },
      value: meta_wFreq,
      title: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range : [0, 10]},
        bar: {color: "black"},
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lime" },
          { range: [8, 10], color: "green" }
        ]
      }

    };
    
    let gaugeData = [gaugeData1];
    
    // 3.5 Create the layout for the gauge chart.
    let gaugeLayout = { 
      plot_bgcolor: "white",
      margin: { 
        t: 0, 
        b: 0 
      }
    };

    // 3.6 Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);


  });
}








