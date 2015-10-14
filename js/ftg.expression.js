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

	var drawDebug = function() {
		var i;

		requestAnimFrame(drawDebug);
		mCanvas.clearRect(0, 0, 400, 300); // TODO: get canvas size

		if (mCtrack.getCurrentPosition()) {
			mCtrack.draw(mOverlay);
		}

		mMeasure = mEmotionClassifier.meanPredict(mCtrack.getCurrentParameters());

		/*
		if (aMeasure) {
			for (i = 0; i < aMeasure.length; i++) {
				if (er[i].value > 0.4) {
					document.getElementById('icon'+(i+1)).style.visibility = 'visible';
				} else {
					document.getElementById('icon'+(i+1)).style.visibility = 'hidden';
				}

				console.log(er[i].emotion, er[i].value);
			}
		}
		*/
	}

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
	}

	this.init = function(theOverlay, theCamera) {
		console.debug('Expression init');

		mCamera	 = theCamera;
		mOverlay = document.getElementById(theOverlay);
		mCanvas  = mOverlay.getContext('2d');
		mDebug	 = true;

		mEmotionClassifier = new emotionClassifier();
		mEmotionClassifier.init(emotionModel);

		// setup of emotion detection
		mCtrack = new clm.tracker({useWebGL : true});
		mCtrack.init(pModel);

		console.debug('Known emotions:', mEmotionClassifier.getEmotions());
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
