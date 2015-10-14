var FTG = FTG || {};

FTG.ExpressionDetector = function() {
	var mSelf = this;
	var mCamera;
	var mOverlay;
	var mCanvas;
	var mEmotionClassifier;
	var mCtrack;
	var mMeasure;
	var mDebug;

	var step = function() {
		var i;

		requestAnimFrame(step);

		if(mDebug) {
			mCanvas.clearRect(0, 0, 400, 300); // TODO: get canvas size

			if (mCtrack.getCurrentPosition()) {
				mCtrack.draw(mOverlay);
			}
		}

		mMeasure = mEmotionClassifier.meanPredict(mCtrack.getCurrentParameters());
	};

	var createDebugElements = function() {
		mOverlay = document.createElement('canvas');

		mOverlay.id = 'overlay';
		mOverlay.setAttribute('width', 400);
		mOverlay.setAttribute('height', 300);
		document.getElementById('container').appendChild(mOverlay); // TODO: allow user to specify the element to append to.

		mCanvas = mOverlay.getContext('2d');
	};

	this.init = function(theCallback) {
		console.debug('Expression init');

		mCamera	= new FTG.Camera();

		mCamera.init(function() {
			console.debug('Video is ready!');

			// Setup internal stuff
			createDebugElements();
			mDebug = true;

			// Setup emotion classifier
			mEmotionClassifier = new emotionClassifier();
			mEmotionClassifier.init(emotionModel);

			// Setup of emotion detection
			mCtrack = new clm.tracker({useWebGL : true});
			mCtrack.init(pModel);

			console.debug('Known emotions:', mEmotionClassifier.getEmotions());

			// Tell everyone we are ready to rock!
			theCallback();
		});
	};

	this.start = function() {
		// start video
		mCamera.playVideo();
		// start tracking
		mCtrack.start(mCamera.getVideo());
		// start loop to draw face
		step();
	};

	this.debug = function(theStatus) {
		mDebug = theStatus;
	};

	this.getEmotions = function() {
		return mMeasure;
	};
};
