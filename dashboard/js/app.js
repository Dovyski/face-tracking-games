var APP = new function() {
    var mSelf = this;

    this.generateSideMenu = function() {
        $('#main-menu').empty();

        this.generateSessionsMenu();
        this.generateExperimentsMenu();
    };

    this.generateSessionsMenu = function() {
        var aOut;

        aOut =
            '<li>' +
                '<a><i class="fa fa-bar-chart-o"></i> Sessions <span class="fa fa-chevron-down"></span></a>' +
                '<ul class="nav child_menu" style="display: none">' +
                    '<li><a href="javascript:void(0)" class="action-link">Active</a></li>' +
                '</ul>' +
            '</li>';

        $('#sidebar-menu').append('<ul class="nav side-menu">' + aOut + '</ul>');

        $('#sidebar-menu a.action-link').click(function() {
            APP.loadData($(this).data('subject'), $(this).data('game'));
        });
    };

    this.generateExperimentsMenu = function() {
        var aSelf = this;

        this.loadData({method: 'experiments'}, function(theInfo) {
            var aOut = '',
                j,
                aInfo,
                i;

            aOut += '<ul class="nav side-menu"><li><a><i class="fa fa-bar-chart-o"></i> Subjects <span class="fa fa-chevron-down"></span></a>' +
                    '<ul class="nav child_menu" style="display: none;">';

            for(i = 0; i < theInfo.data.length; i++) {
                aInfo = theInfo.data[i];
                aOut += '<li><a href="javascript:void(0)" data-subject="' + aInfo.uuid + '" class="subject-link">'+ aInfo.uuid + '<br />' + aInfo.timestamp +'</a></li>';
            }

            aOut += '</ul></li></ul>';

            $('#sidebar-menu').append(aOut);

            $('#sidebar-menu a.subject-link').click(function() {
                aSelf.showExperimentData($(this).data('subject'));
            });

            customUpdateSidebarMenu();
        });
    };

    this.showExperimentData = function(theSubject) {
        $('#data-area').html(theSubject);
    };

    this.createCharts = function(theInfo) {
        $('#subject-id').html('<strong>' + theInfo.uuid + '</strong> <small>' + theInfo.date + '</small>');

        this.createChart(theInfo.emotions, 'facial-tracking', 'facial-tracking-legend');
        this.createChart(theInfo.scores, 'score-tracking', 'score-tracking-legend');
    };

    this.createChart = function(theData, theContainerId, theLegendId) {
        var aCtx,
            aContainer,
            aCanvas,
            aChart;

        // Get canvas context for chart drawing
        $('#' + theContainerId).empty();
        aContainer = document.getElementById(theContainerId);
        aCanvas = document.createElement('canvas');
        aCtx = aCanvas.getContext("2d");

        aContainer.appendChild(aCanvas);

        theData.labelsFilter = function (theIndex) {
            //return true if this index should be filtered out
            return (theIndex + 1) % 10 !== 0;
        };

        // Create chart
        aChart = new Chart(aCtx).LineAlt(theData, {
            responsive: true,
            legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"width: 30px; height: 10px; background-color:<%=datasets[i].strokeColor%>\">&nbsp;&nbsp;&nbsp;</span> <%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
        });

        // Generate a legend
        $('#' + theLegendId).html(aChart.generateLegend());
    };

    this.loadData = function(theData, theCallback) {
        $.ajax({
            method: 'POST',
            url: '../backend/index.php',
            dataType: 'json',
            data: theData,
        })
        .done(function(theInfo) {
            theCallback(theInfo);
        })
        .fail(function() {
            $('#facial-tracking').html('Unable to load data!');
        })
        .always(function() {

        });
    };
};

$(function () {
    APP.generateSideMenu();
});
