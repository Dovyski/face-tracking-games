var APP = APP || {};

APP.ExperimentViewer = function(theIndex, theData) {
    this.mIndex = theIndex;
    this.mRawData = theData;
    this.mGame = this.mRawData.games[this.mIndex];
    this.mQuestionnaire = this.mRawData.questionnaires[this.mIndex].data;
    this.mChart = null;
    this.mChartControlers = [];
    this.mChartControlPresets = {
        'None': [],
        'HR (complete)': ['heartRate', 'hrBaseline', 'hrBaselinedMeans'],
        'HR (basic)': ['heartRate', 'hrBaseline'],
        'Emotions (basic)': ['stressReport', 'boredomReport', 'enjoymentArea', 'hrBaselinedMeans'],
        'Emotions (complete)': ['stressReport', 'boredomReport', 'enjoymentArea', 'hrBaselinedMeans', 'inGameEvents'],
        'In-game (basic)': ['inGameActions', 'inGameEvents'],
        'In-game (medium)': ['heartRate', 'hrBaseline', 'hrBaselinedMeans', 'inGameActions', 'inGameEvents'],
        'In-game (complete)': ['heartRate', 'hrBaseline', 'hrBaselinedMeans', 'enjoymentArea', 'inGameActions', 'inGameEvents']
    };
    this.mChartConfig = {
        chart: {
            zoomType: 'x'
        },
        title: {
            text: this.mGame.name + ' (understood? ' + this.mQuestionnaire[5].al + ')'
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



APP.ExperimentViewer.prototype.setSerieVisibility = function(theSerie, theVisibility) {
    if(!theSerie) {
        return;
    }

    if(theVisibility) {
        theSerie.show();
    } else {
        theSerie.hide();
    }
};

APP.ExperimentViewer.prototype.addChartController = function(theInfo) {
    var i,
        aAlreadyExists = false;

    for(i = 0; i < this.mChartControlers.length; i++) {
        if(this.mChartControlers[i].id == theInfo.id) {
            aAlreadyExists = true;
            break;
        }
    }

    if(!aAlreadyExists) {
        this.mChartControlers.push(theInfo);
    }
}

APP.ExperimentViewer.prototype.heartRate = function(theStatus, theRedraw) {
    var aHr,
        i,
        aStart,
        aSerie,
        aId = 'heartRate',
        aData = [];

    theRedraw = theRedraw == undefined ? true : theRedraw;
    theStatus = theStatus == undefined ? true : theStatus;

    aSerie = this.mChart.get(aId);

    if(aSerie) {
        // Series exists.
        this.setSerieVisibility(aSerie, theStatus);

    } else {
        // Serie does not exist.
        if(theStatus) {
            aHr = this.mGame.hr;
            aStart = this.mGame.start;

            for(i = 0; i < aHr.length; i++) {
                aData.push([i * 1000, aHr[i]]);
            }

            this.mChart.addSeries({
                type: 'area',
                name: 'HR',
                data: aData,
                id: aId
            }, theRedraw);

            this.addChartController({id: aId, name: 'HR'});
        }
    }
};

APP.ExperimentViewer.prototype.stressReport = function(theStatus, theRedraw) {
    var aQuestionnaire = this.mRawData.questionnaires[this.mIndex].data,
        aId = 'stressReport';

    theRedraw = theRedraw == undefined ? true : theRedraw;
    theStatus = theStatus == undefined ? true : theStatus;

    aSerie = this.mChart.get(aId);

    if(aSerie) {
        // Series exists.
        this.setSerieVisibility(aSerie, theStatus);

    } else {
        // Serie does not exist.
        if(theStatus) {
            this.mChart.addSeries({
                id: aId,
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
            }, theRedraw);

            this.addChartController({id: aId, name: 'Stress'});
        }
    }
};

APP.ExperimentViewer.prototype.boredomReport = function(theStatus, theRedraw) {
    var aQuestionnaire = this.mRawData.questionnaires[this.mIndex].data,
        aId = 'boredomReport';

    theRedraw = theRedraw == undefined ? true : theRedraw;
    theStatus = theStatus == undefined ? true : theStatus;

    aSerie = this.mChart.get(aId);

    if(aSerie) {
        // Series exists.
        this.setSerieVisibility(aSerie, theStatus);

    } else {
        // Serie does not exist.
        if(theStatus) {
            this.mChart.addSeries({
                id: aId,
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
            }, theRedraw);

            this.addChartController({id: aId, name: 'Boredom'});
        }
    }
};

APP.ExperimentViewer.prototype.hrBaseline = function(theStatus, theRedraw) {
    var aId = 'hrBaseline';

    theRedraw = theRedraw == undefined ? true : theRedraw;
    theStatus = theStatus == undefined ? true : theStatus;

    if(theStatus) {
        this.mChart.yAxis[0].addPlotLine({
            id: aId,
            value: this.mRawData.baseline,
            color: '#8C00FF',
            dashStyle: 'shortdash',
            width: 3,
            label: {
                text: 'HR baseline'
            }
        }, theRedraw);

        this.addChartController({id: aId, name: 'HR baseline'});
    } else {
        this.mChart.yAxis[0].removePlotLine(aId);
    }
};

APP.ExperimentViewer.prototype.hrBaselinedMeans = function(theStatus, theRedraw) {
    var i,
        aSeriesData = [],
        aTotal,
        aPart,
        aScale = 5,
        aId = 'hrBaselinedMeans';

    theRedraw = theRedraw == undefined ? true : theRedraw;
    theStatus = theStatus == undefined ? true : theStatus;

    aSerie = this.mChart.get(aId);

    if(theStatus) {
        if(aSerie) {
            this.setSerieVisibility(aSerie, true);

        } else {
            aTotal = (this.mGame.end - this.mGame.start) * 1000;
            aPart = aTotal / this.mGame['hr-means-baseline'].length;

            for(i = 0; i < this.mGame['hr-means-baseline'].length; i++) {
                aSeriesData.push([aPart * i + aPart / 2, this.mGame['hr-means-baseline'][i] * aScale]);
            }

            this.mChart.addSeries({
                id: aId,
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
            }, theRedraw);

            this.addChartController({id: aId, name: 'HR baselined means'});
        }

        this.mChart.yAxis[0].removePlotLine(aId);
        this.mChart.yAxis[0].addPlotLine({
            id: aId,
            value: 0,
            color: '#000',
            dashStyle: 'shortdash',
            width: 3,
            label: {
                text: 'No variation line'
            }
        }, theRedraw);

    } else {
        if(aSerie) {
            this.setSerieVisibility(aSerie, false);
        }
        this.mChart.yAxis[0].removePlotLine(aId);
    }
};

APP.ExperimentViewer.prototype.isInGameAction = function(theName) {
    return theName != 'question' && theName != 'newBlock' && theName != 'difficulty';
};

APP.ExperimentViewer.prototype.isInGameEvent = function(theName) {
    return theName == 'question' || theName == 'newBlock' || theName == 'difficulty';
};

APP.ExperimentViewer.prototype.inGameActions = function(theStatus, theRedraw) {
    var i,
        aSeriesData = [],
        aTime,
        aActions,
        aId = 'inGameActions';

    theRedraw = theRedraw == undefined ? true : theRedraw;
    theStatus = theStatus == undefined ? true : theStatus;
    aActions  = this.mGame.actions;

    aSerie = this.mChart.get(aId);

    if(aSerie) {
        // Series exists.
        this.setSerieVisibility(aSerie, theStatus);

    } else {
        // Serie does not exist.
        if(theStatus) {
            for(i = 0; i < aActions.length; i++) {
                aTime = (aActions[i].timestamp/1000 - this.mGame.start) * 1000;

                if(this.isInGameAction(aActions[i].action)) {
                    aSeriesData.push({
                        x: aTime,
                        y: aActions[i].value,
                        name: aActions[i].action,
                        color: '#FF00FF'
                    });
                }
            }

            this.mChart.addSeries({
                id: aId,
                type: 'spline',
                name: 'In-game actions',
                color: '#FF8800',
                data: aSeriesData,
                tooltip: {
                    pointFormatter: function () {
                        return ' ';
                    },
                }
            }, theRedraw);

            this.addChartController({id: aId, name: 'In-game actions'});
        }
    }
};

APP.ExperimentViewer.prototype.inGameEvents = function(theStatus, theRedraw) {
    var i,
        aTime,
        aActions,
        aId = 'inGameEvents',
        aExists = false;

    theRedraw = theRedraw == undefined ? true : theRedraw;
    theStatus = theStatus == undefined ? true : theStatus;
    aActions  = this.mGame.actions;

    if(theStatus) {

        for(i = 0; i < aActions.length; i++) {
            aTime = (aActions[i].timestamp/1000 - this.mGame.start) * 1000;

            if(this.isInGameEvent(aActions[i].action)) {
                this.mChart.xAxis[0].addPlotLine({
                    color: aActions[i].action == 'difficulty' ? '#000' : '#FF00FF',
                    dashStyle: aActions[i].action == 'difficulty' ? 'solid' : 'longdashdot',
                    value: aTime,
                    width: aActions[i].action == 'difficulty' ? 2 : 1,
                    id: 'events' + i
                }, false);
            }
        }

        this.addChartController({id: aId, name: 'In-game events'});

    } else {
        for(i = 0; i < aActions.length; i++) {
            if(this.isInGameEvent(aActions[i].action)) {
                this.mChart.xAxis[0].removePlotLine('events' + i, false);
            }
        }
    }

    this.mChart.redraw();
};

APP.ExperimentViewer.prototype.enjoymentArea = function(theStatus, theRedraw) {
    var aAnswer = this.mRawData.questionnaires[this.mIndex].data[4].a | 0,
        aLabel = this.mRawData.questionnaires[this.mIndex].data[4].al,
        aTotal,
        aId = 'enjoymentArea',
        aPart;

    theRedraw = theRedraw == undefined ? true : theRedraw;
    theStatus = theStatus == undefined ? true : theStatus;

    aTotal = this.mGame.end - this.mGame.start;
    aPart = aTotal / 5;
    aAnswer--;

    if(theStatus) {
        this.mChart.xAxis[0].addPlotBand({
            color: '#E3FFE0',
            from: aAnswer * aPart * 1000,
            to: (aAnswer * aPart + aPart) * 1000,
            label: {
                text: '<strong>Enjoyed the most</strong><br>' + aLabel
            },
            id: aId
        });

        this.addChartController({id: aId, name: 'Enjoyment area'});

    } else {
        this.mChart.xAxis[0].removePlotBand(aId, theRedraw);
    }
};

APP.ExperimentViewer.prototype.handleChartOptionChange = function(theEvent) {
    var aIndex,
        aMethod,
        aSelf;

    // Get information regarding the viewer that triggered this click
    aIndex = $(this).data('index');
    aSelf  = APP.instance.getExperimentViewerByIndex(aIndex);

    // Call the propert function to handle the data
    aMethod  = $(this).data('method');
    aSelf[aMethod](theEvent.target.checked);
};

APP.ExperimentViewer.prototype.handleChartPreset = function(theEvent) {
    var aIndex,
        aValue,
        i,
        aPreset,
        aId,
        aShouldEnable,
        aSelf;

    // Get information regarding the viewer that triggered this click
    aIndex = $(this).data('index');
    aSelf  = APP.instance.getExperimentViewerByIndex(aIndex);

    aValue  = $(this).val();
    aPreset = aSelf.mChartControlPresets[aValue];

    for(i = 0; i < aSelf.mChartControlers.length; i++) {
        aShouldEnable = aPreset.indexOf(aSelf.mChartControlers[i].id) != -1;
        aId = '#' + aSelf.mChartControlers[i].id + aSelf.mIndex;

        if((aShouldEnable && !$(aId).is(':checked')) || (!aShouldEnable && $(aId).is(':checked'))) {
            $(aId).trigger('click');
        }
    }
};

APP.ExperimentViewer.prototype.initChartControlOptions = function(theContainerId) {
    var i,
        aOut = '',
        aName,
        aId;

    for(i = 0; i < this.mChartControlers.length; i++) {
        aId = this.mChartControlers[i].id + this.mIndex;
        aOut += '<input type="checkbox" name="' + aId + '" id="' + aId + '" data-method="' + this.mChartControlers[i].id + '" data-index="' + this.mIndex + '" checked="checked" /><label for="' + aId + '">' + this.mChartControlers[i].name +'</label>';
    }

    aOut += 'Select: <select name="preset" data-index="' + this.mIndex + '"><option value=""></option>';
    for(aName in this.mChartControlPresets) {
        aOut += '<option value="' + aName + '">' + aName + '</option>';
    }
    aOut += '</select>';

    $('#' + theContainerId).append('<div class="chart-controls">' + aOut + '</div>');
    $('.chart-controls input').off().on('change', this.handleChartOptionChange);
    $('.chart-controls select').off().on('change', this.handleChartPreset);
};

APP.ExperimentViewer.prototype.init = function(theContainerId) {
    var aId = 'chart' + this.mIndex;

    $('#' + theContainerId).append('<div id="' + aId + '"></div>');

    this.mChartConfig.chart.renderTo = aId;
    this.mChart = new Highcharts.Chart(this.mChartConfig);

    this.heartRate(true, false);
    this.stressReport(true, false);
    this.boredomReport(true, false);
    this.hrBaseline(true, false);
    this.hrBaselinedMeans(true, false);
    this.inGameActions(true, false);
    this.inGameEvents(true, false);
    this.enjoymentArea(true, false);

    this.mChart.redraw(false);

    this.initChartControlOptions(theContainerId);
};
