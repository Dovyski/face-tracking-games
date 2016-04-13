var APP = APP || {};

APP.ExperimentViewer = function(theIndex, theData) {
    this.mIndex = theIndex;
    this.mRawData = theData;
    this.mGame = this.mRawData.games[this.mIndex];
    this.mChartData = [];

    this.mChartConfig = {
        chart: {
            zoomType: 'x'
        },
        title: {
            text: this.mGame.name
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
            line : {
                dataLabels : {
                    enabled : true,
                    formatter : function() {
                        return this.y / 100 * 5;  // TODO: turn magic number into a constant
                    }
                },
                tooltip: {
                    pointFormatter: function () {
                        return '<strong>' + (this.y / 100 * 5) + '</strong>';  // TODO: turn magic number into a constant
                    }
                }
            },
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

    aHr = this.mGame.hr;
    aStart = this.mGame.start;

    for(i = 0; i < aHr.length; i++) {
        this.mChartData.push([i * 1000, aHr[i]]);
    }
};

APP.ExperimentViewer.prototype.showStressfulAreas = function() {
    var aQuestionnaire = this.mRawData.questionnaires[this.mIndex].data;

    this.mChartConfig.series.push({
        type: 'line',
        name: 'Value',
        color: '#FF0000',
        data: [
            {
                name: 'Stress at beginning',
                color: '#FF0000',
                y: aQuestionnaire[1].a / 5 * 100, // TODO: turn magic number into a constant
                x: 5000
            },
            {
                name: 'Stress at end',
                color: '#FF0000',
                y: aQuestionnaire[3].a / 5 * 100,  // TODO: turn magic number into a constant
                x: (this.mChartData.length - 8) * 1000
            }
        ]
    });
};

APP.ExperimentViewer.prototype.showBoringAreas = function() {
    var aQuestionnaire = this.mRawData.questionnaires[this.mIndex].data;

    this.mChartConfig.series.push({
        type: 'line',
        name: 'Value',
        color: '#00FF00',
        data: [
            {
                name: 'Boredom at beginning',
                color: '#00FF00',
                y: aQuestionnaire[0].a / 5 * 100,  // TODO: turn magic number into a constant
                x: 5000
            },
            {
                name: 'Boredom at end',
                color: '#00FF00',
                y: aQuestionnaire[2].a / 5 * 100,  // TODO: turn magic number into a constant
                x: (this.mChartData.length - 8) * 1000
            }
        ]
    });
};

APP.ExperimentViewer.prototype.render = function(theContainerId) {
    $('#' + theContainerId).highcharts(this.mChartConfig);
};
