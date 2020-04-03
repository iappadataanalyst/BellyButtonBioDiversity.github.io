//Build the metadata panel  
function buildSampleMetadata(incomingSampleData) {

    // Define a variable for the HTML element
    var sampleMetadataPanel = d3.select("#sample-metadata");

    //Clears any existing information 
    sampleMetadataPanel.html("");
   
    //d3 reads in the JSON
    d3.json("data/samples.json").then(function(data) {
        //console.log(sampleMetadataPanel);

        // Array of Objects
        var metadataSamples = data.metadata;

        var metadataResultArray = metadataSamples.filter(sampleObj => sampleObj.id == incomingSampleData);
        var sampleMetadata = metadataResultArray[0];

        //Add each key/value pair to the panel and append the information into it
        Object.entries(sampleMetadata).forEach(function([key, value]) {
            console.log(key, value);
            d3.select("#sample-metadata").property("value");

            var panelTag = sampleMetadataPanel.append("p")
            panelTag.text(`${key}: ${value}`);
        });
    
    console.log(sampleMetadata.wfreq);
 
   });
};

function buildGauge(wfreqData) {

    console.log(wfreqData);

    let value = parseInt(wfreqData)*(180/10); // decides the span of the needle in each section
    let degrees = 180 - value // needle degree based on each value 
    let radius = 0.5;
    let radians = degrees * Math.PI / 180;
    let x = radius * Math.cos(radians); // x coordinate of the needle
    let y = radius * Math.sin(radians); // y coordinate of the needle

    // setting up path to create a triangle 
    let mainPath = "M -.0 -0.025 L .0 0.025 L ",
        pathX = String(x),
        space = " ",
        pathY = String(y),
        pathEnd = " Z";
    let path = mainPath.concat(pathX, space, pathY, pathEnd);

    // plotly trace
    let gaugeData = [
        // needle center coordinate and shape
        {
            type: "scatter",
            x: [0],
            y: [0],
            marker: {size: 15, color:'black'},
           
            name: "Wash Frequence",
            text: wfreqData,
            hoverinfo: "name+text",
            showlegend: false,
        },
        // pie chart converted into half by setting up 50% of it to have same color as the background (white in this case)
        {
            type: "pie",
            showlegend: false,
            hole: 0.45,
            rotation: 90,

            values: [100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100], // divided into part1 and part2. Part1 divided into 9 equal sections
            text: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
            direction: "clockwise",
            textinfo: "text",
            textposition: "inside",
            marker: {
                colors: [
                    "rgb(175,238,238)",
                    "rgb(173,216,230)",
                    "rgb(135,206,250)",
                    "rgb(72,209,204)",
                    "rgb(100,149,237)",
                    "rgb(70,130,180)",
                    "rgb(65,105,225)",
                    "rgb(95,158,160)",
                    "rgb(0,128,128)",
                    "rgb(255,255,255)"
                ]
            },
            labels: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
            hoverinfo: "label"
        }
    ];

    // plotly layout
    let gaugeLayout = {
        autosize: true,
        shapes: [{
            type: "path",
            path: path,
        }],

        title: ("Belly Button Washing Frequency Scrubs Per Week"),
        xaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1]
        },

        yaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1]
        }
    };

    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
};


//Function to build the charts (bar graph and bubble chart)
function buildSiteCharts(incomingSampleData) {
    console.log(incomingSampleData);
    
    d3.json("data/samples.json").then(function(data) {

        //Array of objects
        var samples = data.samples;
        
        //Filter through the array for the incoming sample and use it for the site charts
        var resultArray = samples.filter(sampleObj => sampleObj.id == incomingSampleData);
        var sampleData = resultArray[0];
        
        // Here: bar chart ------------------

        //Initialize x/y variables for the bar chart
        var otuID = sampleData.otu_ids.slice(0,10).reverse();
        var sampleValues = sampleData.sample_values.slice(0,10).reverse();
        var hoverLabels = sampleData.otu_labels.slice(0,10).reverse();

        // y value
        otuMicrobes = []
        otuID.forEach(function(id) {
            var otuMicrobeName = `OTU ${id}`;
            otuMicrobes.push(otuMicrobeName);
        });

        //Bar chart trace 
        var samplesBarChart = [{
            type: "bar", 
            x: sampleValues,
            y: otuMicrobes,
            hovertext: hoverLabels,
            orientation: "h"
        }];

        //Layout of the bar chart and other design elements
        var barChartLayout = {
            title: "Microbe Bar Chart",
            height: 700,
            width: 500,
            xaxis: { autorange: true},
            hoverlabel: { bgcolor: "#459BD9"} 
        };

        //Plotly displays the bar chart
        Plotly.newPlot("bar", samplesBarChart, barChartLayout);

        //Here: bubble chart -------------------------

        //Initlialize x/y variables for the bubble chart
        var otuIDXAxis = sampleData.otu_ids;
        var sampleValuesYAxis = sampleData.sample_values;
        var otuTextValues = sampleData.otu_labels;

        //Bubble chart trace
        var bubbleChart = [{
            x: otuIDXAxis,
            y: sampleValuesYAxis,
            text: otuTextValues,
            mode: "markers", 
            marker: {
                colorscale: "Earth",
                size: sampleValuesYAxis,
                color: otuIDXAxis
            }
        }];

        // Bubble Chart Layout
        var bubbleChartLayout = {
            title: "Microbe Bubble Chart" ,
            xaxis: {title: "Sample OTU ID"},
            yaxis: {title: "Sample Values"}
        };

        //Plotly displays the bubble chart
        Plotly.newPlot("bubble", bubbleChart, bubbleChartLayout);  
        //buildGauge(sampleData.WFREQ);
        var metaArray = data.metadata.filter(metaObj => metaObj.id == incomingSampleData);
        var wData = metaArray[0].wfreq;
        buildGauge(wData);
    });

};

// Initial loading, where d3 selects the drop down selector to append the sample IDs
function init() {
    
    var dropDownSelector = d3.select("#selDataset");
    console.log(dropDownSelector);

    //List of Sample names
    d3.json("data/samples.json").then(function(nameOfSamples) {
        console.log(nameOfSamples);
        Object.entries(nameOfSamples).forEach(function([key, value]) {
            console.log([key, value]);
            
            if (key == "names") {
                value.forEach((incomingSampleData) => {  
                    dropDownSelector
                        .append("option")
                        .text(incomingSampleData)
                        .property("value", incomingSampleData);
            
                });

                //The first sample in the entire dataset is used to build the charts (like creating a default)
                buildSiteCharts(value[0]);
                buildSampleMetadata(value[0]);
                //Guage_Chart(value[0]);
            };
        });
        
    });

};

//Update all the charts for the next sample
function optionChanged(nextSample) {
    buildSiteCharts(nextSample);
    buildSampleMetadata(nextSample);
};

//Initialize the dashboard for the user
init();