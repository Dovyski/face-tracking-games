var FTG = FTG || {};

FTG.ExpressionDetector = function(theConfig) {
	var mSelf = this;
	var mCamera;
	var mOverlay;
	var mCanvas;
	var mEmotionClassifier;
	var mCtrack;
	var mMeasure = [];
	var mPoints;
	var mDebug;
	var mInitiated = false;
	var mInitiating = false;

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
		requestAnimFrame(step);

		// Abort if anything is not initialized
		if(!init()) {
			return;
		}

		mSelf.update();
	};

	var createDebugElements = function() {
		mOverlay = document.createElement('canvas');

		mOverlay.id = mConfig.canvasId;
		mOverlay.setAttribute('width', mConfig.width);
		mOverlay.setAttribute('height', mConfig.height);
		document.getElementById(mConfig.container).appendChild(mOverlay);

		mCanvas = mOverlay.getContext('2d');
	};

	var init = function(theCallback) {
		if(mInitiated) {
			// If we are already initialized, so there is nothing
			// else to be done here. The show must go on!
			return true;

		} if(mInitiating) {
			// We are initializing. We cannot initialize once again,
			// so let's return false to indicate things cannot go
			// on.
			return false;
		}

		console.debug('Expression init');

		// Prevent double initalization
		mInitiating = true;

		// Start the init process itself...
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

			// start video
			mCamera.playVideo();

			// start tracking
			mCtrack.start(mCamera.getVideo());

			// Ready to party!
			mInitiated = true;

			// Tell everyone we are ready to rock!
			if(theCallback) {
				theCallback();
			}
		});
	};

	// Will track the face only after each call to this method is performed.
	// It's useful if you want to use in conjunction with a game loop, for instance.
	this.update = function() {
		// Wait until everything is initialized
		if(!init()) {
			return;
		}

		if(mDebug) {
			mCanvas.clearRect(0, 0, mCanvas.canvas.width, mCanvas.canvas.height);

			if (mCtrack.getCurrentPosition()) {
				mCtrack.draw(mOverlay);
			}
		}
		mPoints = mCtrack.getCurrentParameters();
		mMeasure = mEmotionClassifier.meanPredict(mPoints);
	};

	// Will make the detector loop (using requestAnimFrame) and keep on tracking the face.
	this.start = function(theCallback) {
		init(function() {
			if(theCallback) {
				theCallback();
			}
			step();
		});
	};

	this.debug = function(theStatus) {
		mDebug = theStatus;
	};

	this.getEmotions = function() {
		return mMeasure;
	};

	this.getPoints = function() {
		return mPoints;
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
