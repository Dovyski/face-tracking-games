var FTG = FTG || {};

FTG.Camera = function(theConfig) {
	var mSelf = this;
	var mVideo;
	var mConfig = theConfig;

	// Code from:
	// 	https://github.com/auduno/clmtrackr/tree/dev/examples
	// 	MIT licensed, Copyright (c) 2013, Audun Mathias Øygard
	var initUserMediaStuff = function() {
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;

		// check for camerasupport
		if (navigator.getUserMedia) {

			var aVideoSelector = {video : true};

			if (window.navigator.appVersion.match(/Chrome\/(.*?) /)) {
				var aChromeVersion = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
				if (aChromeVersion < 20) {
					aVideoSelector = "video";
				}
			}

			navigator.getUserMedia(aVideoSelector, function( theStream ) {
				if (mVideo.mozCaptureStream) {
					mVideo.mozSrcObject = theStream;
				} else {
					mVideo.src = (window.URL && window.URL.createObjectURL(theStream)) || theStream;
				}
				mVideo.play();

			}, function() {
				alert("There was some problem trying to fetch video from your webcam. If you have a webcam, please make sure to accept when the browser asks for access to your webcam.");
			});

		} else {
			alert("This demo depends on getUserMedia, which your browser does not seem to support. :(");
		}
	};

	var createAndAttachVideoElement = function() {
		var aVideo;

		aVideo = document.createElement('video');
		aVideo.id = mConfig.videoId;
		aVideo.setAttribute('width', mConfig.width);
		aVideo.setAttribute('height', mConfig.height);

		document.getElementById(mConfig.container).appendChild(aVideo);

		return aVideo;
	};

	this.init = function(theCallback) {
		console.debug('Camera init');

		mVideo = createAndAttachVideoElement();
		mVideo.addEventListener('canplay', theCallback, false);

		initUserMediaStuff();
	};

	this.playVideo = function() {
		mVideo.play();
	};

	this.getVideo = function() {
		return mVideo;
	};
};
