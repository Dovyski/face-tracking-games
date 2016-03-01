var APP = APP || {};

APP.Monitor = function(theContainerId) {
    this.mContainerId = theContainerId;
    this.mIntervalId = -1;
};

APP.Monitor.prototype.run = function() {
    this.buildLayoutStructure();

    this.mIntervalId = setInterval(this.update, 1000);
};

APP.Monitor.prototype.update = function() {
    $('#data-area').html('asaas' + Math.random());
};

APP.Monitor.prototype.buildLayoutStructure = function() {
    var aOut = '';

    aOut =
    '<div class="page-title">' +
        '<div class="title_left">' +
            '<h3 id="subject-id"></h3>' +
        '</div>' +

        '<div class="title_right"></div>' +
    '</div>' +
    '<div class="clearfix"></div>' +

    '<div class="row">' +
        '<div class="col-md-12">' +
            '<div class="x_panel">' +
                '<div class="x_title">' +
                    '<h2>Current active session</h2> <i class="fa fa-refresh fa-spin" style="margin-left: 10px; margin-top: 8px;"></i>' +
                    '<div class="clearfix"></div>' +
                '</div>' +
                '<div class="x_content">' +
                    '<div class="row">' +
                        '<div class="col-md-12" style="padding: 10px;" id="data-area">hgf</div>' +
                    '</div>' +
                    '<div class="row">' +
                        '<div id="legend-area" class="col-md-12"></div>' +
                    '</div>' +
                    '<div class="clearfix"></div>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>';

    $('#' + this.mContainerId).html(aOut);
};
