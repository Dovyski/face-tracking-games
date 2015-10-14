var FTG = FTG || {};

FTG.ExpressionDetector = function(theConfig) {
	var mSelf = this;
	var mCamera;
	var mOverlay;
	var mCanvas;
	var mEmotionClassifier;
	var mCtrack;
	var mMeasure;
	var mDebug;

	var mDefaultConfig = {
		container: '',			// id of the element where the video/canvas tag should be attached to
		width: 400,				// width of the video/canvas element
		height: 300,			// height of the video/canvas element
		videoId: 'videoel',		// id of the video tag that will be added to handle the camera input
		canvasId: 'overlay',	// id of the canvas tag that will be added to handle the visual debug
	};

	var mergeObjects = function(theA, theB) {
		var aResult = {},
			i;

		for(i in theA) {
			aResult[i] = theA[i];
		}

		for(i in theB) {
			aResult[i] = theB[i];
		}

		return aResult;
	};

	var mConfig = mergeObjects(mDefaultConfig, theConfig);

	var step = function() {
		var i;

		requestAnimFrame(step);

		if(mDebug) {
			mCanvas.clearRect(0, 0, mCanvas.canvas.width, mCanvas.canvas.height);

			if (mCtrack.getCurrentPosition()) {
				mCtrack.draw(mOverlay);
			}
		}

		mMeasure = mEmotionClassifier.meanPredict(mCtrack.getCurrentParameters());
	};

	var createDebugElements = function() {
		mOverlay = document.createElement('canvas');

		mOverlay.id = mConfig.canvasId;
		mOverlay.setAttribute('width', mConfig.width);
		mOverlay.setAttribute('height', mConfig.height);
		document.getElementById(mConfig.container).appendChild(mOverlay);

		mCanvas = mOverlay.getContext('2d');
	};

	this.init = function(theCallback) {
		console.debug('Expression init');

		mCamera	= new FTG.Camera(mConfig);

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

	this.getDominantEmotion = function() {
		var i,
			aSize = mMeasure.length,
			aGreater = 0;

		for(i = 0; i < aSize; i++) {
			if(mMeasure[i].value > mMeasure[aGreater].value) {
				aGreater = i;
			}
		}

		return mMeasure[aGreater];
	};
};
