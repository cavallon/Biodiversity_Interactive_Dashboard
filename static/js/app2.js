//populate the items in the dropdown
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
    buildMetadata(sampleNames[0]);
    buildBarChart(sampleNames[0]);
    buildBubbleChart(sampleNames[0]);
    })
};

//allows charts to update when dropdown is changed
function optionChanged(newSample) {
    buildMetadata(newSample);
    buildBarChart(newSample);
    buildBubbleChart(newSample);
};
  
//code to produce demographics table
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    let metadata = data.metadata;
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];
    let bubble = d3.select("#sample-metadata");

    bubble.html("");
    Object.entries(result).forEach(([key, value]) => {
      bubble.append("h6").text(key.toUpperCase() + ': ' + value);
    });
  });
};

//create the bar chart
function buildBarChart(sample){
  d3.json("samples.json").then((data) => {
    let samplesData = data.samples;
    let resultArray = samplesData.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    // list to hold arrays and convert to dictionary
    let allSampleData = [];

    for (i = 0; i < result.otu_ids.length; i++) {
      allSampleData.push({
        otu_ids: result.otu_ids[i],
        sample_values: result.sample_values[i],
        otu_labels: result.otu_labels[i]
      });
    };

    // filter by top ten results
    let topTenResult = allSampleData.sort((a,b) => a.sample_values-b.sample_values).reverse().slice(0,10);
    
    // bar chart variables
    let values = topTenResult.map(val=>val.sample_values);
    let labels = topTenResult.map(lab=>"OTU "+lab.otu_ids);
    let hoverText = topTenResult.map(t=>t.otu_labels);

    let bubble = d3.select("#bar");

    bubble.html("");
    let barData = {
      x: values,
      y: labels,
      text: hoverText,
      type: "bar",
      orientation: "h" 
    };

    let layout = {
      title: "Top 10 OTUs",
      xaxis:{title: "Sample Values"},
      yaxis:{
        title:"OTU ID",
        autorange:'reversed'
      }
    };

    Plotly.newPlot("bar", [barData], layout);
  });
};

// create bubble chart with function below
function buildBubbleChart(sample){
  d3.json("samples.json").then((data) => {
    let samplesData = data.samples;
    let resultArray = samplesData.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];
    // create arrays
    let values = result.sample_values;
    let ids = result.otu_ids;
    let labels = result.otu_labels;

    let bubble = d3.select("#bubble");

    bubble.html("");
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
      title: "OTU Sample values",
      xaxis:{title: "OTU IDs"},
      yaxis:{title: "Sample Values"}
    }

    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);
  });  
};



init();



