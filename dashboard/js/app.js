var APP = new function() {
    var mSelf = this;

    this.generateSideMenu = function() {
        $.ajax({
            method: 'POST',
            url: '../backend/menu.php',
            dataType: 'json'
        })
        .done(function(theInfo) {
            var aOut = '',
                aGame,
                i;

            for(aGame in theInfo) {
                aOut += '<li><a><i class="fa fa-bar-chart-o"></i> Card Flipper <span class="fa fa-chevron-down"></span></a>' +
                        '<ul class="nav child_menu" style="display: none">';

                for(i = 0; i < theInfo[aGame].length; i++) {
                    aOut += '<li><a href="javascript:void(0)" data-subject="' + theInfo[aGame][i] + '" class="subject-link">'+ theInfo[aGame][i] +'</a></li>';
                }

                aOut += '</ul></li>';
            }

            $('#side-menu').html(aOut);

            $('#side-menu a.subject-link').click(function() {
                APP.loadData($(this).data('subject'));
            });

            customUpdateSidebarMenu();
        })
        .fail(function() {
            $('#side-menu').html('|ops!');
        });
    };

    this.createCharts = function(theInfo) {
        $('#subject-id').html('<strong>' + theInfo.uuid + '</strong> <small>' + theInfo.date + '</small>');

        this.createChart(theInfo.emotions, 'facial-tracking', 'facial-tracking-legend');
        this.createChart(theInfo.scores, 'score-tracking', 'score-tracking-legend');
    };

    this.createChart = function(theData, theCanvasId, theLegendId) {
        var aCtx,
            aChart;

        // Get canvas context for chart drawing
        aCtx = document.getElementById(theCanvasId).getContext("2d");

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

    this.loadData = function(theSubjectId) {
        $.ajax({
            method: 'POST',
            url: '../backend/report.php',
            dataType: 'json',
            data: {uid: theSubjectId},
        })
        .done(function(theInfo) {
            mSelf.createCharts(theInfo);

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
