var APP = APP || {};

APP.ExperimentViewer = function(theData) {
    this.mRawData = theData;
    this.mChartData = [];

    this.mChartConfig = {
        chart: {
            zoomType: 'x'
        },
        title: {
            text: this.mRawData.name
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
        },
        xAxis: {
            title: {
                text: 'Time'
            },
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: 'Data'
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
            name: 'HR',
            data: this.mChartData
        }]
    };
};

APP.ExperimentViewer.prototype.showHeartRate = function() {
    var aHr,
        i,
        aStart;

    aHr = this.mRawData.hr;
    aStart = this.mRawData.start;

    for(i = 0; i < aHr.length; i++) {
        this.mChartData.push([i * 1000, aHr[i]]);
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
