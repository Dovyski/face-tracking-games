var APP = APP || {};

APP = function() {
    var mSelf = this;

    this.generateSideMenu = function() {
        $('#main-menu').empty();

        this.generateSessionsMenu();
        this.generateExperimentsMenu();
    };

    this.generateSessionsMenu = function() {
        var aOut,
            aSelf = this;

        aOut =
            '<li>' +
                '<a><i class="fa fa-bar-chart-o"></i> Sessions <span class="fa fa-chevron-down"></span></a>' +
                '<ul class="nav child_menu" style="display: none">' +
                    '<li><a href="javascript:void(0)" class="action-link" data-action="active">Active</a></li>' +
                '</ul>' +
            '</li>';

        $('#sidebar-menu').append('<ul class="nav side-menu">' + aOut + '</ul>');

        $('#sidebar-menu a.action-link').click(function() {
            var aAction = $(this).data('action');

            if(aAction == 'active') {
                aSelf.showActiveSession();
            }
        });
    };

    this.showActiveSession = function() {
        var aMonitor;

        aMonitor = new APP.Monitor('main-area', this);
        aMonitor.run();
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
                aOut += '<li><a href="javascript:void(0)" data-subject="' + aInfo.uuid + '" class="subject-link">'+ aInfo.uuid +'</a></li>';
            }

            aOut += '</ul></li></ul>';

            $('#sidebar-menu').append(aOut);

            $('#sidebar-menu a.subject-link').click(function() {
                aSelf.showExperimentData($(this).data('subject'));
            });

            customUpdateSidebarMenu();
            aSelf.showExperimentData(409);
        });
    };

    this.showExperimentData = function(theSubject) {
        this.loadData({method: 'experiment', user: theSubject}, function(theData) {
            var aViewer,
                i,
                aGame,
                aId,
                aGames;

            if(theData.success) {
                $('#data-area').empty();
                $('#data-title').html('Subject: ' + theSubject);

                aGames = theData.data.games;

                for(i = 0; i < aGames.length; i++) {
                    aId = 'game' + i;
                    $('#data-area').append('<div id="' + aId + '"></div>');

                    aViewer = new APP.ExperimentViewer(i, theData.data);

                    aViewer.showHeartRate();
                    aViewer.showStressReport();
                    aViewer.showBoredomReport();
                    aViewer.showEnjoymentArea();
                    aViewer.showHRBaseline();
                    aViewer.showBaselinedHRMeans();
                    aViewer.render(aId);
                }
            } else {
                console.error('Something wrong');
            }
        });
    };

    this.loadData = function(theData, theCallback, theCallbackContext) {
        $.ajax({
            method: 'POST',
            url: '../backend/index.php',
            dataType: 'json',
            data: theData,
        })
        .done(function(theInfo) {
            theCallback.call(theCallbackContext || this, theInfo);
        })
        .fail(function() {
            $('#facial-tracking').html('Unable to load data!');
        })
        .always(function() {

        });
    };
};

$(function () {
    var aApp;

    aApp = new APP();
    aApp.generateSideMenu();

    if(FTG.Utils.getURLParamByName('active')) {
        aApp.showActiveSession();
    }
});
