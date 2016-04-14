var APP = APP || {};

APP.ExperimentViewer = function(theIndex, theData) {
    this.mIndex = theIndex;
    this.mRawData = theData;
    this.mGame = this.mRawData.games[this.mIndex];
    this.mChart = null;

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
            type: 'datetime',
            plotLines: []
        },
        yAxis: {
            title: {
                text: 'HR value'
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
        series: []
    };
};

APP.ExperimentViewer.prototype.showHeartRate = function() {
    var aHr,
        i,
        aStart,
        aData = [];

    aHr = this.mGame.hr;
    aStart = this.mGame.start;

    for(i = 0; i < aHr.length; i++) {
        aData.push([i * 1000, aHr[i]]);
    }

    this.mChartConfig.series.push({
        type: 'area',
        name: 'HR',
        data: aData
    });
};

APP.ExperimentViewer.prototype.showStressReport = function() {
    var aQuestionnaire = this.mRawData.questionnaires[this.mIndex].data;

    this.mChartConfig.series.push({
        type: 'line',
        name: 'Self-reported stress',
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
                x: (this.mGame.hr.length - 8) * 1000
            }
        ],
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
    });
};

APP.ExperimentViewer.prototype.showBoredomReport = function() {
    var aQuestionnaire = this.mRawData.questionnaires[this.mIndex].data;

    this.mChartConfig.series.push({
        type: 'line',
        name: 'Self-reported boredom',
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
                x: (this.mGame.hr.length - 8) * 1000
            }
        ],
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
    });
};

APP.ExperimentViewer.prototype.showHRBaseline = function() {
    var aValue = this.mRawData.baseline;

    this.mChartConfig.series.push({
        type: 'spline',
        name: 'HR baseline',
        color: '#8C00FF',
        data: [[0, aValue], [this.mGame.hr.length * 1000, aValue]]
    });
};

APP.ExperimentViewer.prototype.showBaselinedHRMeans = function() {
    var i,
        aSeriesData = [],
        aTotal,
        aPart,
        aScale = 5;

    aTotal = (this.mGame.end - this.mGame.start) * 1000;
    aPart = aTotal / this.mGame['hr-means-baseline'].length;

    for(i = 0; i < this.mGame['hr-means-baseline'].length; i++) {
        aSeriesData.push([aPart * i + aPart / 2, this.mGame['hr-means-baseline'][i] * aScale]);
    }

    this.mChartConfig.series.push({
        type: 'spline',
        name: 'HR variation relative to baseline',
        color: '#FFFF00',
        data: aSeriesData,
        dataLabels : {
            enabled : false,
            formatter : function() {
                return this.y / aScale;
            }
        },
        tooltip: {
            pointFormatter: function () {
                return '<strong>' + (this.y / aScale) + '</strong>';
            },
            xDateFormat: 'HR variation:'
        }
    });
};

APP.ExperimentViewer.prototype.showInGameActions = function() {
    var i,
        aSeriesData = [],
        aTime;

    for(i = 0; i < this.mGame.actions.length; i++) {
        aTime = (this.mGame.actions[i].timestamp/1000 - this.mGame.start) * 1000;

        if(this.mGame.actions[i].action != 'question' && this.mGame.actions[i].action != 'newBlock') {
            aSeriesData.push({
                x: aTime,
                y: this.mGame.actions[i].value,
                name: this.mGame.actions[i].action,
                color: '#FF00FF'
            });
        }
    }

    this.mChartConfig.series.push({
        type: 'spline',
        name: 'In-game actions',
        color: '#FF8800',
        data: aSeriesData,
        tooltip: {
            pointFormatter: function () {
                return ' ';
            },
        }
    });
};

APP.ExperimentViewer.prototype.showInGameEvents = function() {
    var i,
        aTime;

    for(i = 0; i < this.mGame.actions.length; i++) {
        aTime = (this.mGame.actions[i].timestamp/1000 - this.mGame.start) * 1000;

        if(this.mGame.actions[i].action == 'question' || this.mGame.actions[i].action == 'newBlock' || this.mGame.actions[i].action == 'difficulty') {
            this.mChart.xAxis[0].addPlotLine({
                color: '#FF00FF',
                dashStyle: 'longdashdot',
                value: aTime,
                width: 1,
                id: 'events' + i
            });
        }
    }
};

APP.ExperimentViewer.prototype.showEnjoymentArea = function() {
    var aAnswer = this.mRawData.questionnaires[this.mIndex].data[4].a | 0,
        aLabel = this.mRawData.questionnaires[this.mIndex].data[4].al,
        aTotal,
        aPart;

    aTotal = this.mGame.end - this.mGame.start;
    aPart = aTotal / 5;
    aAnswer--;

    this.mChart.xAxis[0].addPlotBand({
        color: '#E3FFE0',
        from: aAnswer * aPart * 1000,
        to: (aAnswer * aPart + aPart) * 1000,
        label: {
            text: '<strong>Enjoyed the most</strong><br>' + aLabel
        },
        id: 'enjoy'
    });
};

APP.ExperimentViewer.prototype.handleChartOptionChange = function(theEvent) {
    var aChart,
        aType,
        aLabel,
        aSerie,
        aIndex,
        aSelf;

    // Get information regarding the viewer that triggered this click
    aIndex = $(this).data('index');
    aSelf  = APP.instance.getExperimentViewerByIndex(aIndex);
    aChart = aSelf.mChart;

    aType  = $(this).data('type');
    aLabel = $(this).data('label');

    if(aType == 'serie') {
        aSerie = aChart.series[aLabel];

        if(aSerie.visible) {
            aSerie.hide();
        } else {
            aSerie.show();
        }
    } else if(aType == 'plotLine') {
        if(theEvent.target.checked) {
            if(aLabel == 'events') {
                aSelf.showInGameEvents();
            }
        } else {
            for(i = 0; i < aSelf.mGame.actions.length; i++) {
                aSelf.mChart.xAxis[0].removePlotLine('events' + i);
            }
        }

    } else if(aType == 'plotBand') {
        if(theEvent.target.checked) {
            if(aLabel == 'enjoy') {
                aSelf.showEnjoymentArea();
            }
        } else {
            aSelf.mChart.xAxis[0].removePlotBand(aLabel);
        }
    }
};

APP.ExperimentViewer.prototype.showEverything = function() {
    this.showHeartRate();
    this.showStressReport();
    this.showBoredomReport();
    //this.showEnjoymentArea();
    this.showHRBaseline();
    this.showBaselinedHRMeans();
    this.showInGameActions();
    //this.showInGameEvents();
};

APP.ExperimentViewer.prototype.renderChartControlOptions = function(theContainerId) {
    var i,
        aId,
        aSelf = this,
        aOut = '';

    for(i = 0; i < this.mChart.series.length; i++) {
        aId = 'c' + i + this.mIndex;
        aOut += '<input type="checkbox" name="' + aId + '" id="' + aId + '" data-type="serie" data-label="'+ i +'" data-index="' + this.mIndex + '" checked="checked" /><label for="' + aId + '">' + this.mChart.series[i].name +'</label>';
    }

    aId = 'events' + this.mIndex;
    aOut += '<input type="checkbox" name="' + aId + '" id="' + aId + '" data-type="plotLine" data-label="events" data-index="' + this.mIndex + '" checked="checked" /><label for="' + aId + '">In-game events</label>';

    aId = 'enjoy' + this.mIndex;
    aOut += '<input type="checkbox" name="' + aId + '" id="' + aId + '" data-type="plotBand" data-label="enjoy" data-index="' + this.mIndex + '" checked="checked" /><label for="' + aId + '">Enjoyment area</label>';

    $('#' + theContainerId).append('<div class="chart-controls">' + aOut + '</div>');
    $('.chart-controls input').off().on('change', this.handleChartOptionChange);
};

APP.ExperimentViewer.prototype.render = function(theContainerId) {
    var aId = 'chart' + this.mIndex;

    $('#' + theContainerId).append('<div id="' + aId + '"></div>');

    this.mChartConfig.chart.renderTo = aId;
    this.mChart = new Highcharts.Chart(this.mChartConfig);

    this.renderChartControlOptions(theContainerId);
};
