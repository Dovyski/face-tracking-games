var APP = APP || {};

APP.ExperimentViewer = function(theData) {
    this.mRawData = theData;
    this.mChartData = [];

    this.mChartConfig = {
        chart: {
            zoomType: 'x'
        },
        title: {
            text: 'USD to EUR exchange rate over time'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
        },
        xAxis: {
            title: {
                text: 'Exchange rate'
            },
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: 'Exchange rate'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                marker: {
                    radius: 1
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },

        series: [{
            type: 'area',
            name: 'USD to EUR',
            data: this.mChartData
        }]
    };
};

APP.ExperimentViewer.prototype.showHeartRate = function() {
    for(var i = 0; i < this.mRawData.length; i++) {
        this.mChartData.push([this.mRawData[i].timestamp, Math.random()]);
    }
};

APP.ExperimentViewer.prototype.showStressfulAreas = function() {
    this.mChartConfig.xAxis.plotBands = [{
        color: 'orange', // Color value
        from: 3, // Start of the plot band
        to: 4 // End of the plot band
    }];

    this.mChartConfig.xAxis.plotLines = [{
        color: 'red', // Color value
        dashStyle: 'longdashdot', // Style of the plot line. Default to solid
        value: 3, // Value of where the line will appear
        width: 2 // Width of the line
    }];
};

APP.ExperimentViewer.prototype.render = function(theContainerId) {
    $('#' + theContainerId).highcharts(this.mChartConfig);
};
