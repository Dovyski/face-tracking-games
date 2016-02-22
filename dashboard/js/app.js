var APP = APP || {};

APP = function() {
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
        var aViewer;

        this.loadData({method: 'experiment', user: theSubject}, function(theData) {
            var aViewer;

            if(theData.success) {
                aViewer = new APP.ExperimentViewer(theData.data);

                aViewer.showHeartRate();
                aViewer.showStressfulAreas();
                aViewer.render('data-area');

            } else {
                console.error('Something wrong');
            }
        });
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
    new APP().generateSideMenu();
});
