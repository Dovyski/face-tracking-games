/**
 * A set of useful utilities.
 */

var FTG = FTG || {};

FTG.Utils = function() {
};

FTG.Utils.getURLParamByName = function(theName) {
	var aRegex;

    theName = theName.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    aRegex = new RegExp('[\\?&]' + theName + '=([^&#]*)'),
    aResults = aRegex.exec(location.search);

    return aResults === null ? '' : decodeURIComponent(aResults[1].replace(/\+/g, ' '));
};
