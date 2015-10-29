var APP = new function() {
    var mSelf = this;

    this.createChart = function(theData) {
        var aCtx,
            aChart;

        // Get canvas context for chart drawing
        aCtx = document.getElementById('facial-tracking').getContext("2d");

        // Create chart
        aChart = new Chart(aCtx).Line(theData, {
            responsive: true,
            legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"width: 30px; height: 10px; background-color:<%=datasets[i].strokeColor%>\">&nbsp;&nbsp;&nbsp;</span> <%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
        });

        // Generate a legend
        $('#facial-tracking-legend').html(aChart.generateLegend());
    };

    this.loadData = function(theSubjectId) {
        $.ajax({
            method: 'POST',
            url: '../backend/report.php',
            dataType: 'json',
            data: {uid: theSubjectId},
        })
        .done(function(theInfo) {
            mSelf.createChart(theInfo.data);
            $('#subject-id').html('Subject: <strong>' + theInfo.uuid + '</strong> | Date: <strong>' + theInfo.date + '</strong>');

        })
        .fail(function() {
            $('#facial-tracking').html('Unable to load data!');
        })
        .always(function() {

        });
    };
};

$(function () {
    APP.loadData('b44f9011-78f3-40d9-bb86-c71decac1a40');
});
