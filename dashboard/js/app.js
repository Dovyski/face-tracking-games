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
                j,
                aGame,
                i;

            for(j in theInfo) {
                aGame = theInfo[j];

                aOut += '<li><a><i class="fa fa-bar-chart-o"></i> '+ aGame.name +' <span class="fa fa-chevron-down"></span></a>' +
                        '<ul class="nav child_menu" style="display: none">';

                for(i = 0; i < aGame.subjects.length; i++) {
                    aOut += '<li><a href="javascript:void(0)" data-subject="' + aGame.subjects[i] + '" data-game="' + aGame.id + '" class="subject-link">'+ aGame.subjects[i] +'</a></li>';
                }

                aOut += '</ul></li>';
            }

            $('#side-menu').html(aOut);

            $('#side-menu a.subject-link').click(function() {
                APP.loadData($(this).data('subject'), $(this).data('game'));
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

    this.loadData = function(theSubjectId, theGameId) {
        $.ajax({
            method: 'POST',
            url: '../backend/report.php',
            dataType: 'json',
            data: {uid: theSubjectId, game: theGameId},
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
