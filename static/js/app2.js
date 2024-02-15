// create dynamic dropdown menu
function init() {
    let selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      let sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
    })
};

// when dropdown is changed, 
// volunteer demographics and charts are updated
function optionChanged(newSample) {
    buildMetadata(newSample);
    buildBarChart(newSample);
    buildBubbleChart(newSample);
};
  
// function to produce demographics table
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    let metadata = data.metadata;
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];
    let PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(key.toUpperCase() + ': ' + value);
    });
  });
};

// function to produce the bar chart
function buildBarChart(sample){
  d3.json("samples.json").then((data) => {
    let samplesData = data.samples;
    let resultArray = samplesData.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    // put all three arrays into dictionary format
    let allSampleData = [];

    for (i = 0; i < result.otu_ids.length; i++) {
      allSampleData.push({
        otu_ids: result.otu_ids[i],
        sample_values: result.sample_values[i],
        otu_labels: result.otu_labels[i]
      });
    };

    // for top ten results
    let topTenResult = allSampleData.sort((a,b) => a.sample_values-b.sample_values).reverse().slice(0,10);
    
    // vars for the bar chart
    let values = topTenResult.map(val=>val.sample_values);
    let labels = topTenResult.map(lab=>"UTO "+lab.otu_ids);
    let hoverText = topTenResult.map(t=>t.otu_labels);

    let PANEL = d3.select("#bar");

    PANEL.html("");
    let barData = {
      x: values,
      y: labels,
      text: hoverText,
      type: "bar",
      orientation: "h" 
    };

    let layout = {
      title: "Top 10 bacterial species (OTUs)",
      xaxis:{title: "Sample Values"},
      yaxis:{
        title:"UTO IDs",
        autorange:'reversed'
      }
    };

    Plotly.newPlot("bar", [barData], layout);
  });
};

// function to produce the bubble chart
function buildBubbleChart(sample){
  d3.json("samples.json").then((data) => {
    let samplesData = data.samples;
    let resultArray = samplesData.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];
    // set the data arrays
    let values = result.sample_values;
    let ids = result.otu_ids;
    let labels = result.otu_labels;

    let PANEL = d3.select("#bubble");

    PANEL.html("");
    let bubbleTrace = {
      x: ids,
      y: values,
      text: labels,
      mode: 'markers',
      marker:{
        color: ids,
        size: values
      }
    };
    
    let bubbleLayout = {
      title: "Bacterial species (OTU) Sample value",
      xaxis:{title: "OTU ID"},
      yaxis:{title: "Sample value"}
    }

    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);
  });  
};



init();
// initial loading for id 940
optionChanged(940);




     //function buildMetadata(sample) {
         //d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
//           // Filter the data for the object with the desired sample number


//           // Use d3 to select the panel with id of #sample-metadata
//           // Use `.html("") to clear any existing metadata
//           // Hint: Inside the loop, you will need to use d3 to append new
//           // tags for each key-value in the metadata.
//         });
//       }
//       function buildCharts(sample) {
//         d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
//           // write the code for charts
//           // Build a Bubble Chart
//       function init() {
//         // Grab a reference to the dropdown select element
//         // Use the list of sample names to populate the select options
//         d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
//           // Use the first sample from the list to build the initial plots
//       function optionChanged(newSample) {
//         // Fetch new data each time a new sample is selected
//       // Initialize the dashboard
//       init();
