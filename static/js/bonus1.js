// function to create the gauge plot for weekly washing frequence (called from app.js)
function buildGauge(wfreqData) {

    console.log(wfreqData);

    let value = parseFloat(wfreqData) * 20; // decides the span of the needle in each section
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
            marker: {
                size: 13,
                color: "black"
            },
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
}