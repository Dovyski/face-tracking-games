var FTG = FTG || {};

FTG.Camera = function() {
	var mSelf = this;
	var mVideo;

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

	this.init = function(theCallback) {
		console.debug('Camera init');

		mVideo = document.createElement('video');
		mVideo.id = 'videoel';
		mVideo.setAttribute('width', 400);
		mVideo.setAttribute('height', 300);

		document.getElementById('container').appendChild(mVideo); // TODO: allow user to specify the element to append to.

		initUserMediaStuff();
		mVideo.addEventListener('canplay', theCallback, false);
	};

	this.playVideo = function() {
		mVideo.play();
	};

	this.getVideo = function() {
		return mVideo;
	};
};
