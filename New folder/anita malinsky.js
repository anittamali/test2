(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"anita malinsky_atlas_1", frames: [[0,0,1659,1575]]},
		{name:"anita malinsky_atlas_2", frames: [[0,0,1584,1497]]},
		{name:"anita malinsky_atlas_3", frames: [[0,0,1328,1222],[1330,0,678,1622]]},
		{name:"anita malinsky_atlas_4", frames: [[0,0,804,1127],[1215,0,308,1618],[0,1129,1213,659],[1525,0,261,977],[1788,0,260,961],[1787,979,261,959],[806,0,261,979],[1525,979,260,963]]},
		{name:"anita malinsky_atlas_5", frames: [[630,1058,305,422],[1424,1303,264,454],[648,0,277,519],[1266,437,310,429],[326,1051,302,431],[0,1385,324,418],[1573,868,311,420],[1578,431,315,422],[322,625,318,424],[1260,876,311,425],[955,876,303,437],[0,955,320,428],[862,1482,291,427],[1576,0,320,429],[927,0,322,439],[1251,0,323,435],[642,625,311,431],[1155,1315,267,464],[326,1484,268,465],[596,1484,264,472],[1690,1290,264,454],[955,441,309,433],[263,0,383,623],[0,0,261,953]]},
		{name:"anita malinsky_atlas_6", frames: [[753,1888,76,39],[831,1888,76,39],[909,1888,76,38],[0,1820,75,33],[77,1820,72,32],[351,1835,38,14],[311,1853,38,9],[351,1851,38,12],[151,1839,38,16],[191,1839,38,16],[151,1820,38,17],[391,1835,38,14],[311,1864,38,9],[271,1853,38,12],[77,1854,38,16],[0,1855,38,16],[191,1820,38,17],[431,1835,38,14],[271,1867,38,9],[231,1854,38,12],[271,1835,38,16],[311,1835,38,16],[231,1835,38,17],[0,0,284,419],[1000,474,242,476],[1006,952,242,476],[1006,1430,242,472],[258,1354,246,479],[286,0,246,479],[503,481,246,479],[534,0,246,479],[782,0,245,472],[251,880,250,472],[0,880,249,475],[1244,464,242,473],[1250,939,241,471],[1735,0,239,468],[1737,470,236,469],[760,955,242,468],[1250,1412,243,462],[1488,461,245,461],[1029,0,248,462],[506,962,252,463],[1279,0,248,459],[1495,1389,240,462],[1493,924,242,463],[753,1427,251,459],[0,1357,256,461],[0,421,259,457],[506,1427,245,472],[751,481,247,472]]}
];


(lib.AnMovieClip = function(){
	this.actionFrames = [];
	this.ignorePause = false;
	this.currentSoundStreamInMovieclip;
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		var pos = this.timeline.resolve(positionOrLabel);
		if (pos != null) { this.startStreamSoundsForTargetedFrame(pos); }
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		this.soundStreamDuration.forEach(function(value,key){
			key.instance.stop();
		});
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			var _this = this;
			this.soundStreamDuration.forEach(function(value,key,arr){
				if((value.end) == currentFrame){
					key.instance.stop();
					if(_this.currentSoundStreamInMovieclip == key) { _this.currentSoundStreamInMovieclip = undefined; }
					arr.delete(key);
				}
			});
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			var _this = this;
			if(this.soundStreamDuration.size > 0){
				var maxDuration = 0;
				this.soundStreamDuration.forEach(function(value,key){
					if(value.end > maxDuration){
						maxDuration = value.end;
						_this.currentSoundStreamInMovieclip = key;
					}
				});
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if((deltaFrame >= 0) && this.ignorePause){
					cjs.MovieClip.prototype.play.call(this);
					this.ignorePause = false;
				}
				else if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
				else if(deltaFrame <= -2){
					cjs.MovieClip.prototype.stop.call(this);
					this.ignorePause = true;
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.CachedBmp_64 = function() {
	this.initialize(ss["anita malinsky_atlas_5"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_63 = function() {
	this.initialize(ss["anita malinsky_atlas_5"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_120 = function() {
	this.initialize(img.CachedBmp_120);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2828,1909);


(lib.CachedBmp_107 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_106 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_105 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_104 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_103 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_102 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_101 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_100 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_99 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_98 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_97 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_96 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_95 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_94 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_93 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_92 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_91 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_90 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_6 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_5 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_4 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_89 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_88 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_156 = function() {
	this.initialize(ss["anita malinsky_atlas_4"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_87 = function() {
	this.initialize(ss["anita malinsky_atlas_5"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_86 = function() {
	this.initialize(ss["anita malinsky_atlas_5"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_79 = function() {
	this.initialize(ss["anita malinsky_atlas_5"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_78 = function() {
	this.initialize(ss["anita malinsky_atlas_5"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_77 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_76 = function() {
	this.initialize(ss["anita malinsky_atlas_5"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_75 = function() {
	this.initialize(ss["anita malinsky_atlas_5"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_74 = function() {
	this.initialize(ss["anita malinsky_atlas_5"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_73 = function() {
	this.initialize(ss["anita malinsky_atlas_5"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_72 = function() {
	this.initialize(ss["anita malinsky_atlas_5"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_71 = function() {
	this.initialize(ss["anita malinsky_atlas_5"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_70 = function() {
	this.initialize(ss["anita malinsky_atlas_5"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_69 = function() {
	this.initialize(ss["anita malinsky_atlas_5"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_68 = function() {
	this.initialize(ss["anita malinsky_atlas_5"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_67 = function() {
	this.initialize(ss["anita malinsky_atlas_5"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_66 = function() {
	this.initialize(ss["anita malinsky_atlas_5"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_44 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_43 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_42 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_41 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_40 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_39 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_38 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_37 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(31);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_36 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(32);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_35 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(33);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_34 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(34);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_33 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(35);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_32 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(36);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_31 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(37);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_30 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(38);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_29 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(39);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_28 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(40);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_27 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(41);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_26 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(42);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_25 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(43);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_24 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(44);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_23 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(45);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_22 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(46);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_21 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(47);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_20 = function() {
	this.initialize(ss["anita malinsky_atlas_5"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_19 = function() {
	this.initialize(ss["anita malinsky_atlas_5"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_18 = function() {
	this.initialize(ss["anita malinsky_atlas_5"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_17 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(48);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_16 = function() {
	this.initialize(ss["anita malinsky_atlas_5"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_15 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(49);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_14 = function() {
	this.initialize(ss["anita malinsky_atlas_6"]);
	this.gotoAndStop(50);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_65 = function() {
	this.initialize(ss["anita malinsky_atlas_5"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_10 = function() {
	this.initialize(ss["anita malinsky_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_12 = function() {
	this.initialize(ss["anita malinsky_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_113 = function() {
	this.initialize(ss["anita malinsky_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_11 = function() {
	this.initialize(img.CachedBmp_11);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2205,7874);


(lib.CachedBmp_62 = function() {
	this.initialize(ss["anita malinsky_atlas_5"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_61 = function() {
	this.initialize(ss["anita malinsky_atlas_4"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_9 = function() {
	this.initialize(ss["anita malinsky_atlas_4"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1 = function() {
	this.initialize(ss["anita malinsky_atlas_3"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.BG = function() {
	this.initialize(img.BG);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,3631,2057);


(lib.BMP_3ba5c8f2_04b4_4b2b_a252_36f5c7ab6eb4 = function() {
	this.initialize(ss["anita malinsky_atlas_4"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.BMP_6ee24740_86fe_4ffc_9fe7_bf090fb4ef91 = function() {
	this.initialize(ss["anita malinsky_atlas_4"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.BMP_8092a444_8ce5_4664_9679_9f4d5a5aa692 = function() {
	this.initialize(ss["anita malinsky_atlas_4"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.BMP_823c1e00_6031_405e_bf46_eb255521357a = function() {
	this.initialize(ss["anita malinsky_atlas_5"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.BMP_b731b6c6_2353_47a4_a46e_e643956eb19b = function() {
	this.initialize(ss["anita malinsky_atlas_4"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.BMP_dd6b41c0_5568_4f07_bbc3_661edbd3dc5b = function() {
	this.initialize(ss["anita malinsky_atlas_4"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.flash0ai = function() {
	this.initialize(img.flash0ai);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,8982,1145);// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop, this.reversed));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.WarpedAsset_6 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_64();
	this.instance.setTransform(-79.75,-104.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-79.7,-104.3,152.5,211);


(lib.WarpedAsset_2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.BMP_b731b6c6_2353_47a4_a46e_e643956eb19b();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,261,979);


(lib.WarpedAsset_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_63();
	this.instance.setTransform(-65.9,-113.45,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-65.9,-113.4,132,227);


(lib.Star3Animation = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(255,255,255,0)").s().p("AACETIgBgDQADgEgBgDIgCgGIgBgJIAAgBQAAgIABgJIABgDIABgBIAAAAIABAAIAAABIABABQgDAKABAJIACAPQACAFgGAHIABgBgAgGCGIAAAAIgBgBIAAgBIgBgQIgDgVIAAgBIgBgWIACgQIABgGQACgMgDgHIgCgEIgFgLIAAABQgDgGgLgBIgUgBIgTgBIgBgBIAAgBIAAAAIABgBIABAAIASACIAUAAIAIACQAGACACAEIAAAAIADAFIAEAKQADAIgCAMIgCAWIAAABIAAAVIABAJIACANIACAQIgBABIAAABIgBAAgAAKBUIAAAAIgBgBIAAgBIACgEQACgHgBgIIAAgBIgBgSIAAAAIACgMIACgGQACgLAHgFIADgBQAFgDAHAAQAKAAALgCIAVgEQAJgBAMAEIABABIAAABIAAAAIgBABIgBAAIgCgBQgKgEgIABIgUAEIgEABQgKACgIAAQgIAAgGADQgFAFgDAJIgDASIAAATQACALgEAJIgBABIAAAAIgBAAgAhJAIIgUgBIgTgBIgSgBIgUABQgMAAgNgEIgEgBIgMgBIgCABQgHADgLgBQgKAAgJgCQgIgBgPAAIgBgBIAAgBIAAAAIABgBIAAAAIAWACIACAAQAIABAKABQAHAAAFgBIAFgBQAIgDAMAEIAHACQAJABAIAAIAKAAIAKAAIASAAIAAAAIATABIAUABIABABIABAAIgBABIAAABIgBAAgABpAGIgBgBIAAAAIAAgBIABgBIABAAQAJABALgBQAMgBAJAAIABAAIACAAQAIABAIgBIABgBIABAAIAIAAIAJABQAJABAIgDIACAAIALgDIgEAAIgVgEQgIgBgKAAIgBgBIAAAAIAAgBIAAgBIABAAQALAAAHACIAIABIANACQAMACAIgCIACgBIABAAQAKgDAHACIANACIAAAAIAFABIABABIAAABIAAAAIgBABIgBABIgBgBIAAgBIAAAAIAAAAIgBABIgBABIgSABQgMABgKgBIgFAAIgGAAIgJABQgKAFgKgCQgKgBgJABQgJACgKgBIAAAAQgJgBgLACIgMAAIgKAAgADxgGIgHACIAAAAIgKABIACABIALABIAIgBIABAAIAQgCIgLgBIgBAAIgFgBIgEAAgAkAAAIgEgCIgBAAIAAAAIgFABQgBAAAAAAQgBAAAAgBQgBAAAAAAQAAgBAAAAIAAgBIABgCIADAAIAFABQAHgBAKAAQALAAAKgCQALgBAJAAIABAAQAKABAJgBIAUgCIABAAIABABIAAAAIgBABIAAABIgUACQgKABgLgBQgJgBgKACQgKACgMgBIgNABIABAAIAAABIABAAIAAABIgBABIgBAAIAAAAgAkLgDIABAAIABAAIgBgBIgBABgACogIIgRgBIgTAAQgKAAgNgCIgXgBQgMAAgKgBIgSgBIgSgBIgBgBIAAgBIAAAAIABgBIAAAAIASABIASACQAKABAMgBIAYACQAMACAKgBIATAAIARABIABABIABAAIAAABIgBAAIAAABIgBAAgAifgJIgBgBIAAAAIAAAAIABgBQAPAAAHgCQAIgBAKABQALABAJgBIAOgBIAHABQALAAAJgCIAAAAQAJgEAIABQAJAAAHgGIANgJIAAAAIABAAIAAABIABABIgBAAIgBABIgLAIQgGAEgGABIgGABQgHAAgJADQgJADgMgBQgLgBgKABQgJABgLgBQgKAAgHABQgHABgQABIAAAAIAAgBgAAZgQIgDgBQgGgFgBgGIgCgIIgBgJIgCgWIgBgVIgBgTIgBgSIgBgTIgCgXIgCgVIAAAAQAAgJABgKIABgBIAAAAIABAAIAAABIABABIgBAHIAAALIAAAAIABAVIABANIABAKIACATIABASIABATIABAVIACAVIACASQACAGAHAEIABABIgBABIAAABIAAAAIgBgBgAgMghIAAAAIgBgBIAAgBIACgSIABgVIAAgUQABgJgCgLQgCgLAFgKIAAAAIACgEQADgHAAgIQABgKgCgKIAAAAQgCgKABgLIABgBIAAAAIABAAIAAABIABAAQgBALABAJQACAKAAALQgBALgFAJIAAAAIAAACQgEAIABAKIABAHIABANIgBAUIgBAWIgBARIgBABIAAABIgBAAgAgEjEIgBgBQgEgKABgLIAAAAIAEgSIAAgBQACgHABgNIABgQIAAAAIAAgBIAAgBIABAAQAAAAAAAAQABAAAAAAQAAAAAAABQAAAAAAABIABAFIABASIABAUIAAAAQABAKAAAKIgBABIgBABIgBgBIAAgBQABgKgBgKIgBgUIgBgQIgBAJQAAALgBAHIgBADIgDASIAAAAQgBAJADAJIABACIAAABIgBABIgBAAIAAAAg");
	this.shape.setTransform(-0.0492,0.4729);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFED").s().p("AgGCKIAAAAIABAAIAAgBIgBgRIgCgNIgCgdIAAgBIADgWQACgNgDgIIgFgJIAAgLIgKAAIgIgCIgUgBIgTgBIgBAAIAAABIAAAAIgBAAIAAgBIgBAAIgUgBIgTgBIAAAAIgSgBIgKAAIgbgBIgHgCQgNgEgHADIgFABIgggBIgWgCIgBAAIAAAAIgBAAIgBAAIAAAAIAMgBQAMAAAKgBQALgBAJAAQAKABAKgBIAUgCIABAAIAAgBIAAAAIABAAIAAAAIAAABIABAAQAPAAAHgCQAIgBAKABQALABAJgBQAJgBAMABQAMABAIgDQAJgDAIAAIAGgBIAWgBIAAgMIACgBIAAgBIAAgBIgBAAIAAAAIAAgBIAAAAIABAAIAAgBIACgSIABgVIAAgVIAAgNIABgZIABgBIAAAAQAFgKAAgKQABgLgCgKQgCgKABgKIAAgBIgBAAIAAgBIABgBIAAAAIAAgCIACgoQABgHAAgKIABgJIAAAPIABAVQABAKAAAKIAAABIABAAIAAABIgBAAIAAABQgCAKABAIIAAABIABAUIACAYIACATIABARIABAUIABAVIACAVIABAKIABASIAIAAIACACIABAAIABAAIAAgBIABAAIAAAAIAAABIABAAIASABIASACQAKABAMgBIAXACQAMACAKgBIATAAIASABIABAAIAAgBIACAAIAAABIABAAQAKAAAHACIAVACIAEABIgKACIgCABIgbABIgHABIgBAAIgSABIgCAAIAAAAQgKgBgLACQgLABgKgBIgBAAIAAABIAAAAIgCAAIAAgBIAAAAQgNgFgJABIgUAEQgMADgJAAQgHAAgGACIgMABIgBAWIgCAMIAAABIAAARIAAACQABAHgCAHIgBAEIAAABIABABIAAAAIgHCRIgBAAIAAABIgBADQgBAJAAAIIAAABIABAIIgBARgAgMAfIABAEQADAIgCALIgBAGgAA8ALIAVgEQAHgBAKAEIgqACIAEgBgADhABIgBAAIAKgBIAAAAIAHgBIAKAAIAKABIgPACIgCAAIgHABIgMgCgAEOAAIgBAAIALAAIgKABgAkLAAIACAAIgCABIAAgBgAkXAAIAJAAIAAABgADTgBIgNgCIAgABIgJACIgKgBgAhOgJIgHAAIAagCQgGACgIAAIgFAAgAgFipQACAJAAALQgBAHgCAIgAAGijIgCgVIAAAAIAAgLIADAuIgBgOgAAAkXIABAJIgBAAIAAAAg");

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("rgba(255,255,237,0.808)").s().p("AgGCKIAAAAIABAAIAAgBIgBgRIgCgNIgCgdIAAgBIADgWQACgNgDgIIgFgJIAAgLIgKAAIgIgCIgUgBIgTgBIgBAAIAAABIAAAAIgBAAIAAgBIgBAAIgUgBIgTgBIAAAAIgSgBIgKAAIgbgBIgHgCQgNgEgHADIgFABIgggBIgWgCIgBAAIAAAAIgBAAIgBAAIAAAAIAMgBQAMAAAKgBQALgBAJAAQAKABAKgBIAUgCIABAAIAAgBIAAAAIABAAIAAAAIAAABIABAAQAPAAAHgCQAIgBAKABQALABAJgBQAJgBAMABQAMABAIgDQAJgDAIAAIAGgBIAWgBIAAgMIACgBIAAgBIAAgBIgBAAIAAAAIAAgBIAAAAIABAAIAAgBIACgSIABgVIAAgVIAAgNIABgZIABgBIAAAAQAFgKAAgKQABgLgCgKQgCgKABgKIAAgBIgBAAIAAgBIABgBIAAAAIAAgCIACgoQABgHAAgKIABgJIAAAPIABAVQABAKAAAKIAAABIABAAIAAABIgBAAIAAABQgCAKABAIIAAABIABAUIACAYIACATIABARIABAUIABAVIACAVIABAKIABASIAIAAIACACIABAAIABAAIAAgBIABAAIAAAAIAAABIABAAIASABIASACQAKABAMgBIAXACQAMACAKgBIATAAIASABIABAAIAAgBIACAAIAAABIABAAQAKAAAHACIAVACIAEABIgKACIgCABIgbABIgHABIgBAAIgSABIgCAAIAAAAQgKgBgLACQgLABgKgBIgBAAIAAABIAAAAIgCAAIAAgBIAAAAQgNgFgJABIgUAEQgMADgJAAQgHAAgGACIgMABIgBAWIgCAMIAAABIAAARIAAACQABAHgCAHIgBAEIAAABIABABIAAAAIgHCRIgBAAIAAABIgBADQgBAJAAAIIAAABIABAIIgBARgAgMAfIABAEQADAIgCALIgBAGgAA8ALIAVgEQAHgBAKAEIgqACIAEgBgADhABIgBAAIAKgBIAAAAIAHgBIAKAAIAKABIgPACIgCAAIgHABIgMgCgAEOAAIgBAAIALAAIgKABgAkLAAIACAAIgCABIAAgBgAkXAAIAJAAIAAABgADTgBIgNgCIAgABIgJACIgKgBgAhOgJIgHAAIAagCQgGACgIAAIgFAAgAgFipQACAJAAALQgBAHgCAIgAAGijIgCgVIAAAAIAAgLIADAuIgBgOgAAAkXIABAJIgBAAIAAAAg");

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("rgba(255,255,237,0.647)").s().p("AgGCKIAAAAIABAAIAAgBIgBgRIgCgNIgCgdIAAgBIADgWQACgNgDgIIgFgJIAAgLIgKAAIgIgCIgUgBIgTgBIgBAAIAAABIAAAAIgBAAIAAgBIgBAAIgUgBIgTgBIAAAAIgSgBIgKAAIgbgBIgHgCQgNgEgHADIgFABIgggBIgWgCIgBAAIAAAAIgBAAIgBAAIAAAAIAMgBQAMAAAKgBQALgBAJAAQAKABAKgBIAUgCIABAAIAAgBIAAAAIABAAIAAAAIAAABIABAAQAPAAAHgCQAIgBAKABQALABAJgBQAJgBAMABQAMABAIgDQAJgDAIAAIAGgBIAWgBIAAgMIACgBIAAgBIAAgBIgBAAIAAAAIAAgBIAAAAIABAAIAAgBIACgSIABgVIAAgVIAAgNIABgZIABgBIAAAAQAFgKAAgKQABgLgCgKQgCgKABgKIAAgBIgBAAIAAgBIABgBIAAAAIAAgCIACgoQABgHAAgKIABgJIAAAPIABAVQABAKAAAKIAAABIABAAIAAABIgBAAIAAABQgCAKABAIIAAABIABAUIACAYIACATIABARIABAUIABAVIACAVIABAKIABASIAIAAIACACIABAAIABAAIAAgBIABAAIAAAAIAAABIABAAIASABIASACQAKABAMgBIAXACQAMACAKgBIATAAIASABIABAAIAAgBIACAAIAAABIABAAQAKAAAHACIAVACIAEABIgKACIgCABIgbABIgHABIgBAAIgSABIgCAAIAAAAQgKgBgLACQgLABgKgBIgBAAIAAABIAAAAIgCAAIAAgBIAAAAQgNgFgJABIgUAEQgMADgJAAQgHAAgGACIgMABIgBAWIgCAMIAAABIAAARIAAACQABAHgCAHIgBAEIAAABIABABIAAAAIgHCRIgBAAIAAABIgBADQgBAJAAAIIAAABIABAIIgBARgAgMAfIABAEQADAIgCALIgBAGgAA8ALIAVgEQAHgBAKAEIgqACIAEgBgADhABIgBAAIAKgBIAAAAIAHgBIAKAAIAKABIgPACIgCAAIgHABIgMgCgAEOAAIgBAAIALAAIgKABgAkLAAIACAAIgCABIAAgBgAkXAAIAJAAIAAABgADTgBIgNgCIAgABIgJACIgKgBgAhOgJIgHAAIAagCQgGACgIAAIgFAAgAgFipQACAJAAALQgBAHgCAIgAAGijIgCgVIAAAAIAAgLIADAuIgBgOgAAAkXIABAJIgBAAIAAAAg");

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("rgba(255,255,237,0.486)").s().p("AgGCKIAAAAIABAAIAAgBIgBgRIgCgNIgCgdIAAgBIADgWQACgNgDgIIgFgJIAAgLIgKAAIgIgCIgUgBIgTgBIgBAAIAAABIAAAAIgBAAIAAgBIgBAAIgUgBIgTgBIAAAAIgSgBIgKAAIgbgBIgHgCQgNgEgHADIgFABIgggBIgWgCIgBAAIAAAAIgBAAIgBAAIAAAAIAMgBQAMAAAKgBQALgBAJAAQAKABAKgBIAUgCIABAAIAAgBIAAAAIABAAIAAAAIAAABIABAAQAPAAAHgCQAIgBAKABQALABAJgBQAJgBAMABQAMABAIgDQAJgDAIAAIAGgBIAWgBIAAgMIACgBIAAgBIAAgBIgBAAIAAAAIAAgBIAAAAIABAAIAAgBIACgSIABgVIAAgVIAAgNIABgZIABgBIAAAAQAFgKAAgKQABgLgCgKQgCgKABgKIAAgBIgBAAIAAgBIABgBIAAAAIAAgCIACgoQABgHAAgKIABgJIAAAPIABAVQABAKAAAKIAAABIABAAIAAABIgBAAIAAABQgCAKABAIIAAABIABAUIACAYIACATIABARIABAUIABAVIACAVIABAKIABASIAIAAIACACIABAAIABAAIAAgBIABAAIAAAAIAAABIABAAIASABIASACQAKABAMgBIAXACQAMACAKgBIATAAIASABIABAAIAAgBIACAAIAAABIABAAQAKAAAHACIAVACIAEABIgKACIgCABIgbABIgHABIgBAAIgSABIgCAAIAAAAQgKgBgLACQgLABgKgBIgBAAIAAABIAAAAIgCAAIAAgBIAAAAQgNgFgJABIgUAEQgMADgJAAQgHAAgGACIgMABIgBAWIgCAMIAAABIAAARIAAACQABAHgCAHIgBAEIAAABIABABIAAAAIgHCRIgBAAIAAABIgBADQgBAJAAAIIAAABIABAIIgBARgAgMAfIABAEQADAIgCALIgBAGgAA8ALIAVgEQAHgBAKAEIgqACIAEgBgADhABIgBAAIAKgBIAAAAIAHgBIAKAAIAKABIgPACIgCAAIgHABIgMgCgAEOAAIgBAAIALAAIgKABgAkLAAIACAAIgCABIAAgBgAkXAAIAJAAIAAABgADTgBIgNgCIAgABIgJACIgKgBgAhOgJIgHAAIAagCQgGACgIAAIgFAAgAgFipQACAJAAALQgBAHgCAIgAAGijIgCgVIAAAAIAAgLIADAuIgBgOgAAAkXIABAJIgBAAIAAAAg");

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("rgba(255,255,237,0.31)").s().p("AgGCKIAAAAIABAAIAAgBIgBgRIgCgNIgCgdIAAgBIADgWQACgNgDgIIgFgJIAAgLIgKAAIgIgCIgUgBIgTgBIgBAAIAAABIAAAAIgBAAIAAgBIgBAAIgUgBIgTgBIAAAAIgSgBIgKAAIgbgBIgHgCQgNgEgHADIgFABIgggBIgWgCIgBAAIAAAAIgBAAIgBAAIAAAAIAMgBQAMAAAKgBQALgBAJAAQAKABAKgBIAUgCIABAAIAAgBIAAAAIABAAIAAAAIAAABIABAAQAPAAAHgCQAIgBAKABQALABAJgBQAJgBAMABQAMABAIgDQAJgDAIAAIAGgBIAWgBIAAgMIACgBIAAgBIAAgBIgBAAIAAAAIAAgBIAAAAIABAAIAAgBIACgSIABgVIAAgVIAAgNIABgZIABgBIAAAAQAFgKAAgKQABgLgCgKQgCgKABgKIAAgBIgBAAIAAgBIABgBIAAAAIAAgCIACgoQABgHAAgKIABgJIAAAPIABAVQABAKAAAKIAAABIABAAIAAABIgBAAIAAABQgCAKABAIIAAABIABAUIACAYIACATIABARIABAUIABAVIACAVIABAKIABASIAIAAIACACIABAAIABAAIAAgBIABAAIAAAAIAAABIABAAIASABIASACQAKABAMgBIAXACQAMACAKgBIATAAIASABIABAAIAAgBIACAAIAAABIABAAQAKAAAHACIAVACIAEABIgKACIgCABIgbABIgHABIgBAAIgSABIgCAAIAAAAQgKgBgLACQgLABgKgBIgBAAIAAABIAAAAIgCAAIAAgBIAAAAQgNgFgJABIgUAEQgMADgJAAQgHAAgGACIgMABIgBAWIgCAMIAAABIAAARIAAACQABAHgCAHIgBAEIAAABIABABIAAAAIgHCRIgBAAIAAABIgBADQgBAJAAAIIAAABIABAIIgBARgAgMAfIABAEQADAIgCALIgBAGgAA8ALIAVgEQAHgBAKAEIgqACIAEgBgADhABIgBAAIAKgBIAAAAIAHgBIAKAAIAKABIgPACIgCAAIgHABIgMgCgAEOAAIgBAAIALAAIgKABgAkLAAIACAAIgCABIAAgBgAkXAAIAJAAIAAABgADTgBIgNgCIAgABIgJACIgKgBgAhOgJIgHAAIAagCQgGACgIAAIgFAAgAgFipQACAJAAALQgBAHgCAIgAAGijIgCgVIAAAAIAAgLIADAuIgBgOgAAAkXIABAJIgBAAIAAAAg");

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("rgba(255,255,237,0.11)").s().p("AgGCKIAAAAIABAAIAAgBIgBgRIgCgNIgCgdIAAgBIADgWQACgNgDgIIgFgJIAAgLIgKAAIgIgCIgUgBIgTgBIgBAAIAAABIAAAAIgBAAIAAgBIgBAAIgUgBIgTgBIAAAAIgSgBIgKAAIgbgBIgHgCQgNgEgHADIgFABIgggBIgWgCIgBAAIAAAAIgBAAIgBAAIAAAAIAMgBQAMAAAKgBQALgBAJAAQAKABAKgBIAUgCIABAAIAAgBIAAAAIABAAIAAAAIAAABIABAAQAPAAAHgCQAIgBAKABQALABAJgBQAJgBAMABQAMABAIgDQAJgDAIAAIAGgBIAWgBIAAgMIACgBIAAgBIAAgBIgBAAIAAAAIAAgBIAAAAIABAAIAAgBIACgSIABgVIAAgVIAAgNIABgZIABgBIAAAAQAFgKAAgKQABgLgCgKQgCgKABgKIAAgBIgBAAIAAgBIABgBIAAAAIAAgCIACgoQABgHAAgKIABgJIAAAPIABAVQABAKAAAKIAAABIABAAIAAABIgBAAIAAABQgCAKABAIIAAABIABAUIACAYIACATIABARIABAUIABAVIACAVIABAKIABASIAIAAIACACIABAAIABAAIAAgBIABAAIAAAAIAAABIABAAIASABIASACQAKABAMgBIAXACQAMACAKgBIATAAIASABIABAAIAAgBIACAAIAAABIABAAQAKAAAHACIAVACIAEABIgKACIgCABIgbABIgHABIgBAAIgSABIgCAAIAAAAQgKgBgLACQgLABgKgBIgBAAIAAABIAAAAIgCAAIAAgBIAAAAQgNgFgJABIgUAEQgMADgJAAQgHAAgGACIgMABIgBAWIgCAMIAAABIAAARIAAACQABAHgCAHIgBAEIAAABIABABIAAAAIgHCRIgBAAIAAABIgBADQgBAJAAAIIAAABIABAIIgBARgAgMAfIABAEQADAIgCALIgBAGgAA8ALIAVgEQAHgBAKAEIgqACIAEgBgADhABIgBAAIAKgBIAAAAIAHgBIAKAAIAKABIgPACIgCAAIgHABIgMgCgAEOAAIgBAAIALAAIgKABgAkLAAIACAAIgCABIAAgBgAkXAAIAJAAIAAABgADTgBIgNgCIAgABIgJACIgKgBgAhOgJIgHAAIAagCQgGACgIAAIgFAAgAgFipQACAJAAALQgBAHgCAIgAAGijIgCgVIAAAAIAAgLIADAuIgBgOgAAAkXIABAJIgBAAIAAAAg");

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("rgba(255,255,237,0)").s().p("AgGCKIAAAAIABAAIAAgBIgBgRIgCgNIgCgdIAAgBIADgWQACgNgDgIIgFgJIAAgLIgKAAIgIgCIgUgBIgTgBIgBAAIAAABIAAAAIgBAAIAAgBIgBAAIgUgBIgTgBIAAAAIgSgBIgKAAIgbgBIgHgCQgNgEgHADIgFABIgggBIgWgCIgBAAIAAAAIgBAAIgBAAIAAAAIAMgBQAMAAAKgBQALgBAJAAQAKABAKgBIAUgCIABAAIAAgBIAAAAIABAAIAAAAIAAABIABAAQAPAAAHgCQAIgBAKABQALABAJgBQAJgBAMABQAMABAIgDQAJgDAIAAIAGgBIAWgBIAAgMIACgBIAAgBIAAgBIgBAAIAAAAIAAgBIAAAAIABAAIAAgBIACgSIABgVIAAgVIAAgNIABgZIABgBIAAAAQAFgKAAgKQABgLgCgKQgCgKABgKIAAgBIgBAAIAAgBIABgBIAAAAIAAgCIACgoQABgHAAgKIABgJIAAAPIABAVQABAKAAAKIAAABIABAAIAAABIgBAAIAAABQgCAKABAIIAAABIABAUIACAYIACATIABARIABAUIABAVIACAVIABAKIABASIAIAAIACACIABAAIABAAIAAgBIABAAIAAAAIAAABIABAAIASABIASACQAKABAMgBIAXACQAMACAKgBIATAAIASABIABAAIAAgBIACAAIAAABIABAAQAKAAAHACIAVACIAEABIgKACIgCABIgbABIgHABIgBAAIgSABIgCAAIAAAAQgKgBgLACQgLABgKgBIgBAAIAAABIAAAAIgCAAIAAgBIAAAAQgNgFgJABIgUAEQgMADgJAAQgHAAgGACIgMABIgBAWIgCAMIAAABIAAARIAAACQABAHgCAHIgBAEIAAABIABABIAAAAIgHCRIgBAAIAAABIgBADQgBAJAAAIIAAABIABAIIgBARgAgMAfIABAEQADAIgCALIgBAGgAA8ALIAVgEQAHgBAKAEIgqACIAEgBgADhABIgBAAIAKgBIAAAAIAHgBIAKAAIAKABIgPACIgCAAIgHABIgMgCgAEOAAIgBAAIALAAIgKABgAkLAAIACAAIgCABIAAgBgAkXAAIAJAAIAAABgADTgBIgNgCIAgABIgJACIgKgBgAhOgJIgHAAIAagCQgGACgIAAIgFAAgAgFipQACAJAAALQgBAHgCAIgAAGijIgCgVIAAAAIAAgLIADAuIgBgOgAAAkXIABAJIgBAAIAAAAg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_2},{t:this.shape}]},8).to({state:[{t:this.shape_3},{t:this.shape}]},1).to({state:[{t:this.shape_4},{t:this.shape}]},2).to({state:[{t:this.shape_5},{t:this.shape}]},1).to({state:[{t:this.shape_6},{t:this.shape}]},2).to({state:[{t:this.shape_7},{t:this.shape}]},1).to({state:[{t:this.shape_7},{t:this.shape}]},2).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-28,-28,56,56.1);


(lib.Star2Animation = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(255,255,255,0)").s().p("AACETIgBgDQADgEgBgDIgCgGIgBgJIAAgBQAAgIABgJIABgDIABgBIAAAAIABAAIAAABIABABQgDAKABAJIACAPQACAFgGAHIABgBgAgGCGIAAAAIgBgBIAAgBIgBgQIgDgVIAAgBIgBgWIACgQIABgGQACgMgDgHIgCgEIgFgLIAAABQgDgGgLgBIgUgBIgTgBIgBgBIAAgBIAAAAIABgBIABAAIASACIAUAAIAIACQAGACACAEIAAAAIADAFIAEAKQADAIgCAMIgCAWIAAABIAAAVIABAJIACANIACAQIgBABIAAABIgBAAgAAKBUIAAAAIgBgBIAAgBIACgEQACgHgBgIIAAgBIgBgSIAAAAIACgMIACgGQACgLAHgFIADgBQAFgDAHAAQAKAAALgCIAVgEQAJgBAMAEIABABIAAABIAAAAIgBABIgBAAIgCgBQgKgEgIABIgUAEIgEABQgKACgIAAQgIAAgGADQgFAFgDAJIgDASIAAATQACALgEAJIgBABIAAAAIgBAAgAhJAIIgUgBIgTgBIgSgBIgUABQgMAAgNgEIgEgBIgMgBIgCABQgHADgLgBQgKAAgJgCQgIgBgPAAIgBgBIAAgBIAAAAIABgBIAAAAIAWACIACAAQAIABAKABQAHAAAFgBIAFgBQAIgDAMAEIAHACQAJABAIAAIAKAAIAKAAIASAAIAAAAIATABIAUABIABABIABAAIgBABIAAABIgBAAgABpAGIgBgBIAAAAIAAgBIABgBIABAAQAJABALgBQAMgBAJAAIABAAIACAAQAIABAIgBIABgBIABAAIAIAAIAJABQAJABAIgDIACAAIALgDIgEAAIgVgEQgIgBgKAAIgBgBIAAAAIAAgBIAAgBIABAAQALAAAHACIAIABIANACQAMACAIgCIACgBIABAAQAKgDAHACIANACIAAAAIAFABIABABIAAABIAAAAIgBABIgBABIgBgBIAAgBIAAAAIAAAAIgBABIgBABIgSABQgMABgKgBIgFAAIgGAAIgJABQgKAFgKgCQgKgBgJABQgJACgKgBIAAAAQgJgBgLACIgMAAIgKAAgADxgGIgHACIAAAAIgKABIACABIALABIAIgBIABAAIAQgCIgLgBIgBAAIgFgBIgEAAgAkAAAIgEgCIgBAAIAAAAIgFABQgBAAAAAAQgBAAAAgBQgBAAAAAAQAAgBAAAAIAAgBIABgCIADAAIAFABQAHgBAKAAQALAAAKgCQALgBAJAAIABAAQAKABAJgBIAUgCIABAAIABABIAAAAIgBABIAAABIgUACQgKABgLgBQgJgBgKACQgKACgMgBIgNABIABAAIAAABIABAAIAAABIgBABIgBAAIAAAAgAkLgDIABAAIABAAIgBgBIgBABgACogIIgRgBIgTAAQgKAAgNgCIgXgBQgMAAgKgBIgSgBIgSgBIgBgBIAAgBIAAAAIABgBIAAAAIASABIASACQAKABAMgBIAYACQAMACAKgBIATAAIARABIABABIABAAIAAABIgBAAIAAABIgBAAgAifgJIgBgBIAAAAIAAAAIABgBQAPAAAHgCQAIgBAKABQALABAJgBIAOgBIAHABQALAAAJgCIAAAAQAJgEAIABQAJAAAHgGIANgJIAAAAIABAAIAAABIABABIgBAAIgBABIgLAIQgGAEgGABIgGABQgHAAgJADQgJADgMgBQgLgBgKABQgJABgLgBQgKAAgHABQgHABgQABIAAAAIAAgBgAAZgQIgDgBQgGgFgBgGIgCgIIgBgJIgCgWIgBgVIgBgTIgBgSIgBgTIgCgXIgCgVIAAAAQAAgJABgKIABgBIAAAAIABAAIAAABIABABIgBAHIAAALIAAAAIABAVIABANIABAKIACATIABASIABATIABAVIACAVIACASQACAGAHAEIABABIgBABIAAABIAAAAIgBgBgAgMghIAAAAIgBgBIAAgBIACgSIABgVIAAgUQABgJgCgLQgCgLAFgKIAAAAIACgEQADgHAAgIQABgKgCgKIAAAAQgCgKABgLIABgBIAAAAIABAAIAAABIABAAQgBALABAJQACAKAAALQgBALgFAJIAAAAIAAACQgEAIABAKIABAHIABANIgBAUIgBAWIgBARIgBABIAAABIgBAAgAgEjEIgBgBQgEgKABgLIAAAAIAEgSIAAgBQACgHABgNIABgQIAAAAIAAgBIAAgBIABAAQAAAAAAAAQABAAAAAAQAAAAAAABQAAAAAAABIABAFIABASIABAUIAAAAQABAKAAAKIgBABIgBABIgBgBIAAgBQABgKgBgKIgBgUIgBgQIgBAJQAAALgBAHIgBADIgDASIAAAAQgBAJADAJIABACIAAABIgBABIgBAAIAAAAg");
	this.shape.setTransform(-0.0492,0.4729);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFED").s().p("AgGCKIAAAAIABAAIAAgBIgBgRIgCgNIgCgdIAAgBIADgWQACgNgDgIIgFgJIAAgLIgKAAIgIgCIgUgBIgTgBIgBAAIAAABIAAAAIgBAAIAAgBIgBAAIgUgBIgTgBIAAAAIgSgBIgKAAIgbgBIgHgCQgNgEgHADIgFABIgggBIgWgCIgBAAIAAAAIgBAAIgBAAIAAAAIAMgBQAMAAAKgBQALgBAJAAQAKABAKgBIAUgCIABAAIAAgBIAAAAIABAAIAAAAIAAABIABAAQAPAAAHgCQAIgBAKABQALABAJgBQAJgBAMABQAMABAIgDQAJgDAIAAIAGgBIAWgBIAAgMIACgBIAAgBIAAgBIgBAAIAAAAIAAgBIAAAAIABAAIAAgBIACgSIABgVIAAgVIAAgNIABgZIABgBIAAAAQAFgKAAgKQABgLgCgKQgCgKABgKIAAgBIgBAAIAAgBIABgBIAAAAIAAgCIACgoQABgHAAgKIABgJIAAAPIABAVQABAKAAAKIAAABIABAAIAAABIgBAAIAAABQgCAKABAIIAAABIABAUIACAYIACATIABARIABAUIABAVIACAVIABAKIABASIAIAAIACACIABAAIABAAIAAgBIABAAIAAAAIAAABIABAAIASABIASACQAKABAMgBIAXACQAMACAKgBIATAAIASABIABAAIAAgBIACAAIAAABIABAAQAKAAAHACIAVACIAEABIgKACIgCABIgbABIgHABIgBAAIgSABIgCAAIAAAAQgKgBgLACQgLABgKgBIgBAAIAAABIAAAAIgCAAIAAgBIAAAAQgNgFgJABIgUAEQgMADgJAAQgHAAgGACIgMABIgBAWIgCAMIAAABIAAARIAAACQABAHgCAHIgBAEIAAABIABABIAAAAIgHCRIgBAAIAAABIgBADQgBAJAAAIIAAABIABAIIgBARgAgMAfIABAEQADAIgCALIgBAGgAA8ALIAVgEQAHgBAKAEIgqACIAEgBgADhABIgBAAIAKgBIAAAAIAHgBIAKAAIAKABIgPACIgCAAIgHABIgMgCgAEOAAIgBAAIALAAIgKABgAkLAAIACAAIgCABIAAgBgAkXAAIAJAAIAAABgADTgBIgNgCIAgABIgJACIgKgBgAhOgJIgHAAIAagCQgGACgIAAIgFAAgAgFipQACAJAAALQgBAHgCAIgAAGijIgCgVIAAAAIAAgLIADAuIgBgOgAAAkXIABAJIgBAAIAAAAg");

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("rgba(255,255,237,0.808)").s().p("AgGCKIAAAAIABAAIAAgBIgBgRIgCgNIgCgdIAAgBIADgWQACgNgDgIIgFgJIAAgLIgKAAIgIgCIgUgBIgTgBIgBAAIAAABIAAAAIgBAAIAAgBIgBAAIgUgBIgTgBIAAAAIgSgBIgKAAIgbgBIgHgCQgNgEgHADIgFABIgggBIgWgCIgBAAIAAAAIgBAAIgBAAIAAAAIAMgBQAMAAAKgBQALgBAJAAQAKABAKgBIAUgCIABAAIAAgBIAAAAIABAAIAAAAIAAABIABAAQAPAAAHgCQAIgBAKABQALABAJgBQAJgBAMABQAMABAIgDQAJgDAIAAIAGgBIAWgBIAAgMIACgBIAAgBIAAgBIgBAAIAAAAIAAgBIAAAAIABAAIAAgBIACgSIABgVIAAgVIAAgNIABgZIABgBIAAAAQAFgKAAgKQABgLgCgKQgCgKABgKIAAgBIgBAAIAAgBIABgBIAAAAIAAgCIACgoQABgHAAgKIABgJIAAAPIABAVQABAKAAAKIAAABIABAAIAAABIgBAAIAAABQgCAKABAIIAAABIABAUIACAYIACATIABARIABAUIABAVIACAVIABAKIABASIAIAAIACACIABAAIABAAIAAgBIABAAIAAAAIAAABIABAAIASABIASACQAKABAMgBIAXACQAMACAKgBIATAAIASABIABAAIAAgBIACAAIAAABIABAAQAKAAAHACIAVACIAEABIgKACIgCABIgbABIgHABIgBAAIgSABIgCAAIAAAAQgKgBgLACQgLABgKgBIgBAAIAAABIAAAAIgCAAIAAgBIAAAAQgNgFgJABIgUAEQgMADgJAAQgHAAgGACIgMABIgBAWIgCAMIAAABIAAARIAAACQABAHgCAHIgBAEIAAABIABABIAAAAIgHCRIgBAAIAAABIgBADQgBAJAAAIIAAABIABAIIgBARgAgMAfIABAEQADAIgCALIgBAGgAA8ALIAVgEQAHgBAKAEIgqACIAEgBgADhABIgBAAIAKgBIAAAAIAHgBIAKAAIAKABIgPACIgCAAIgHABIgMgCgAEOAAIgBAAIALAAIgKABgAkLAAIACAAIgCABIAAgBgAkXAAIAJAAIAAABgADTgBIgNgCIAgABIgJACIgKgBgAhOgJIgHAAIAagCQgGACgIAAIgFAAgAgFipQACAJAAALQgBAHgCAIgAAGijIgCgVIAAAAIAAgLIADAuIgBgOgAAAkXIABAJIgBAAIAAAAg");

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("rgba(255,255,237,0.647)").s().p("AgGCKIAAAAIABAAIAAgBIgBgRIgCgNIgCgdIAAgBIADgWQACgNgDgIIgFgJIAAgLIgKAAIgIgCIgUgBIgTgBIgBAAIAAABIAAAAIgBAAIAAgBIgBAAIgUgBIgTgBIAAAAIgSgBIgKAAIgbgBIgHgCQgNgEgHADIgFABIgggBIgWgCIgBAAIAAAAIgBAAIgBAAIAAAAIAMgBQAMAAAKgBQALgBAJAAQAKABAKgBIAUgCIABAAIAAgBIAAAAIABAAIAAAAIAAABIABAAQAPAAAHgCQAIgBAKABQALABAJgBQAJgBAMABQAMABAIgDQAJgDAIAAIAGgBIAWgBIAAgMIACgBIAAgBIAAgBIgBAAIAAAAIAAgBIAAAAIABAAIAAgBIACgSIABgVIAAgVIAAgNIABgZIABgBIAAAAQAFgKAAgKQABgLgCgKQgCgKABgKIAAgBIgBAAIAAgBIABgBIAAAAIAAgCIACgoQABgHAAgKIABgJIAAAPIABAVQABAKAAAKIAAABIABAAIAAABIgBAAIAAABQgCAKABAIIAAABIABAUIACAYIACATIABARIABAUIABAVIACAVIABAKIABASIAIAAIACACIABAAIABAAIAAgBIABAAIAAAAIAAABIABAAIASABIASACQAKABAMgBIAXACQAMACAKgBIATAAIASABIABAAIAAgBIACAAIAAABIABAAQAKAAAHACIAVACIAEABIgKACIgCABIgbABIgHABIgBAAIgSABIgCAAIAAAAQgKgBgLACQgLABgKgBIgBAAIAAABIAAAAIgCAAIAAgBIAAAAQgNgFgJABIgUAEQgMADgJAAQgHAAgGACIgMABIgBAWIgCAMIAAABIAAARIAAACQABAHgCAHIgBAEIAAABIABABIAAAAIgHCRIgBAAIAAABIgBADQgBAJAAAIIAAABIABAIIgBARgAgMAfIABAEQADAIgCALIgBAGgAA8ALIAVgEQAHgBAKAEIgqACIAEgBgADhABIgBAAIAKgBIAAAAIAHgBIAKAAIAKABIgPACIgCAAIgHABIgMgCgAEOAAIgBAAIALAAIgKABgAkLAAIACAAIgCABIAAgBgAkXAAIAJAAIAAABgADTgBIgNgCIAgABIgJACIgKgBgAhOgJIgHAAIAagCQgGACgIAAIgFAAgAgFipQACAJAAALQgBAHgCAIgAAGijIgCgVIAAAAIAAgLIADAuIgBgOgAAAkXIABAJIgBAAIAAAAg");

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("rgba(255,255,237,0.486)").s().p("AgGCKIAAAAIABAAIAAgBIgBgRIgCgNIgCgdIAAgBIADgWQACgNgDgIIgFgJIAAgLIgKAAIgIgCIgUgBIgTgBIgBAAIAAABIAAAAIgBAAIAAgBIgBAAIgUgBIgTgBIAAAAIgSgBIgKAAIgbgBIgHgCQgNgEgHADIgFABIgggBIgWgCIgBAAIAAAAIgBAAIgBAAIAAAAIAMgBQAMAAAKgBQALgBAJAAQAKABAKgBIAUgCIABAAIAAgBIAAAAIABAAIAAAAIAAABIABAAQAPAAAHgCQAIgBAKABQALABAJgBQAJgBAMABQAMABAIgDQAJgDAIAAIAGgBIAWgBIAAgMIACgBIAAgBIAAgBIgBAAIAAAAIAAgBIAAAAIABAAIAAgBIACgSIABgVIAAgVIAAgNIABgZIABgBIAAAAQAFgKAAgKQABgLgCgKQgCgKABgKIAAgBIgBAAIAAgBIABgBIAAAAIAAgCIACgoQABgHAAgKIABgJIAAAPIABAVQABAKAAAKIAAABIABAAIAAABIgBAAIAAABQgCAKABAIIAAABIABAUIACAYIACATIABARIABAUIABAVIACAVIABAKIABASIAIAAIACACIABAAIABAAIAAgBIABAAIAAAAIAAABIABAAIASABIASACQAKABAMgBIAXACQAMACAKgBIATAAIASABIABAAIAAgBIACAAIAAABIABAAQAKAAAHACIAVACIAEABIgKACIgCABIgbABIgHABIgBAAIgSABIgCAAIAAAAQgKgBgLACQgLABgKgBIgBAAIAAABIAAAAIgCAAIAAgBIAAAAQgNgFgJABIgUAEQgMADgJAAQgHAAgGACIgMABIgBAWIgCAMIAAABIAAARIAAACQABAHgCAHIgBAEIAAABIABABIAAAAIgHCRIgBAAIAAABIgBADQgBAJAAAIIAAABIABAIIgBARgAgMAfIABAEQADAIgCALIgBAGgAA8ALIAVgEQAHgBAKAEIgqACIAEgBgADhABIgBAAIAKgBIAAAAIAHgBIAKAAIAKABIgPACIgCAAIgHABIgMgCgAEOAAIgBAAIALAAIgKABgAkLAAIACAAIgCABIAAgBgAkXAAIAJAAIAAABgADTgBIgNgCIAgABIgJACIgKgBgAhOgJIgHAAIAagCQgGACgIAAIgFAAgAgFipQACAJAAALQgBAHgCAIgAAGijIgCgVIAAAAIAAgLIADAuIgBgOgAAAkXIABAJIgBAAIAAAAg");

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("rgba(255,255,237,0.31)").s().p("AgGCKIAAAAIABAAIAAgBIgBgRIgCgNIgCgdIAAgBIADgWQACgNgDgIIgFgJIAAgLIgKAAIgIgCIgUgBIgTgBIgBAAIAAABIAAAAIgBAAIAAgBIgBAAIgUgBIgTgBIAAAAIgSgBIgKAAIgbgBIgHgCQgNgEgHADIgFABIgggBIgWgCIgBAAIAAAAIgBAAIgBAAIAAAAIAMgBQAMAAAKgBQALgBAJAAQAKABAKgBIAUgCIABAAIAAgBIAAAAIABAAIAAAAIAAABIABAAQAPAAAHgCQAIgBAKABQALABAJgBQAJgBAMABQAMABAIgDQAJgDAIAAIAGgBIAWgBIAAgMIACgBIAAgBIAAgBIgBAAIAAAAIAAgBIAAAAIABAAIAAgBIACgSIABgVIAAgVIAAgNIABgZIABgBIAAAAQAFgKAAgKQABgLgCgKQgCgKABgKIAAgBIgBAAIAAgBIABgBIAAAAIAAgCIACgoQABgHAAgKIABgJIAAAPIABAVQABAKAAAKIAAABIABAAIAAABIgBAAIAAABQgCAKABAIIAAABIABAUIACAYIACATIABARIABAUIABAVIACAVIABAKIABASIAIAAIACACIABAAIABAAIAAgBIABAAIAAAAIAAABIABAAIASABIASACQAKABAMgBIAXACQAMACAKgBIATAAIASABIABAAIAAgBIACAAIAAABIABAAQAKAAAHACIAVACIAEABIgKACIgCABIgbABIgHABIgBAAIgSABIgCAAIAAAAQgKgBgLACQgLABgKgBIgBAAIAAABIAAAAIgCAAIAAgBIAAAAQgNgFgJABIgUAEQgMADgJAAQgHAAgGACIgMABIgBAWIgCAMIAAABIAAARIAAACQABAHgCAHIgBAEIAAABIABABIAAAAIgHCRIgBAAIAAABIgBADQgBAJAAAIIAAABIABAIIgBARgAgMAfIABAEQADAIgCALIgBAGgAA8ALIAVgEQAHgBAKAEIgqACIAEgBgADhABIgBAAIAKgBIAAAAIAHgBIAKAAIAKABIgPACIgCAAIgHABIgMgCgAEOAAIgBAAIALAAIgKABgAkLAAIACAAIgCABIAAgBgAkXAAIAJAAIAAABgADTgBIgNgCIAgABIgJACIgKgBgAhOgJIgHAAIAagCQgGACgIAAIgFAAgAgFipQACAJAAALQgBAHgCAIgAAGijIgCgVIAAAAIAAgLIADAuIgBgOgAAAkXIABAJIgBAAIAAAAg");

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("rgba(255,255,237,0.11)").s().p("AgGCKIAAAAIABAAIAAgBIgBgRIgCgNIgCgdIAAgBIADgWQACgNgDgIIgFgJIAAgLIgKAAIgIgCIgUgBIgTgBIgBAAIAAABIAAAAIgBAAIAAgBIgBAAIgUgBIgTgBIAAAAIgSgBIgKAAIgbgBIgHgCQgNgEgHADIgFABIgggBIgWgCIgBAAIAAAAIgBAAIgBAAIAAAAIAMgBQAMAAAKgBQALgBAJAAQAKABAKgBIAUgCIABAAIAAgBIAAAAIABAAIAAAAIAAABIABAAQAPAAAHgCQAIgBAKABQALABAJgBQAJgBAMABQAMABAIgDQAJgDAIAAIAGgBIAWgBIAAgMIACgBIAAgBIAAgBIgBAAIAAAAIAAgBIAAAAIABAAIAAgBIACgSIABgVIAAgVIAAgNIABgZIABgBIAAAAQAFgKAAgKQABgLgCgKQgCgKABgKIAAgBIgBAAIAAgBIABgBIAAAAIAAgCIACgoQABgHAAgKIABgJIAAAPIABAVQABAKAAAKIAAABIABAAIAAABIgBAAIAAABQgCAKABAIIAAABIABAUIACAYIACATIABARIABAUIABAVIACAVIABAKIABASIAIAAIACACIABAAIABAAIAAgBIABAAIAAAAIAAABIABAAIASABIASACQAKABAMgBIAXACQAMACAKgBIATAAIASABIABAAIAAgBIACAAIAAABIABAAQAKAAAHACIAVACIAEABIgKACIgCABIgbABIgHABIgBAAIgSABIgCAAIAAAAQgKgBgLACQgLABgKgBIgBAAIAAABIAAAAIgCAAIAAgBIAAAAQgNgFgJABIgUAEQgMADgJAAQgHAAgGACIgMABIgBAWIgCAMIAAABIAAARIAAACQABAHgCAHIgBAEIAAABIABABIAAAAIgHCRIgBAAIAAABIgBADQgBAJAAAIIAAABIABAIIgBARgAgMAfIABAEQADAIgCALIgBAGgAA8ALIAVgEQAHgBAKAEIgqACIAEgBgADhABIgBAAIAKgBIAAAAIAHgBIAKAAIAKABIgPACIgCAAIgHABIgMgCgAEOAAIgBAAIALAAIgKABgAkLAAIACAAIgCABIAAgBgAkXAAIAJAAIAAABgADTgBIgNgCIAgABIgJACIgKgBgAhOgJIgHAAIAagCQgGACgIAAIgFAAgAgFipQACAJAAALQgBAHgCAIgAAGijIgCgVIAAAAIAAgLIADAuIgBgOgAAAkXIABAJIgBAAIAAAAg");

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("rgba(255,255,237,0)").s().p("AgGCKIAAAAIABAAIAAgBIgBgRIgCgNIgCgdIAAgBIADgWQACgNgDgIIgFgJIAAgLIgKAAIgIgCIgUgBIgTgBIgBAAIAAABIAAAAIgBAAIAAgBIgBAAIgUgBIgTgBIAAAAIgSgBIgKAAIgbgBIgHgCQgNgEgHADIgFABIgggBIgWgCIgBAAIAAAAIgBAAIgBAAIAAAAIAMgBQAMAAAKgBQALgBAJAAQAKABAKgBIAUgCIABAAIAAgBIAAAAIABAAIAAAAIAAABIABAAQAPAAAHgCQAIgBAKABQALABAJgBQAJgBAMABQAMABAIgDQAJgDAIAAIAGgBIAWgBIAAgMIACgBIAAgBIAAgBIgBAAIAAAAIAAgBIAAAAIABAAIAAgBIACgSIABgVIAAgVIAAgNIABgZIABgBIAAAAQAFgKAAgKQABgLgCgKQgCgKABgKIAAgBIgBAAIAAgBIABgBIAAAAIAAgCIACgoQABgHAAgKIABgJIAAAPIABAVQABAKAAAKIAAABIABAAIAAABIgBAAIAAABQgCAKABAIIAAABIABAUIACAYIACATIABARIABAUIABAVIACAVIABAKIABASIAIAAIACACIABAAIABAAIAAgBIABAAIAAAAIAAABIABAAIASABIASACQAKABAMgBIAXACQAMACAKgBIATAAIASABIABAAIAAgBIACAAIAAABIABAAQAKAAAHACIAVACIAEABIgKACIgCABIgbABIgHABIgBAAIgSABIgCAAIAAAAQgKgBgLACQgLABgKgBIgBAAIAAABIAAAAIgCAAIAAgBIAAAAQgNgFgJABIgUAEQgMADgJAAQgHAAgGACIgMABIgBAWIgCAMIAAABIAAARIAAACQABAHgCAHIgBAEIAAABIABABIAAAAIgHCRIgBAAIAAABIgBADQgBAJAAAIIAAABIABAIIgBARgAgMAfIABAEQADAIgCALIgBAGgAA8ALIAVgEQAHgBAKAEIgqACIAEgBgADhABIgBAAIAKgBIAAAAIAHgBIAKAAIAKABIgPACIgCAAIgHABIgMgCgAEOAAIgBAAIALAAIgKABgAkLAAIACAAIgCABIAAgBgAkXAAIAJAAIAAABgADTgBIgNgCIAgABIgJACIgKgBgAhOgJIgHAAIAagCQgGACgIAAIgFAAgAgFipQACAJAAALQgBAHgCAIgAAGijIgCgVIAAAAIAAgLIADAuIgBgOgAAAkXIABAJIgBAAIAAAAg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_2},{t:this.shape}]},6).to({state:[{t:this.shape_3},{t:this.shape}]},2).to({state:[{t:this.shape_4},{t:this.shape}]},1).to({state:[{t:this.shape_5},{t:this.shape}]},2).to({state:[{t:this.shape_6},{t:this.shape}]},1).to({state:[{t:this.shape_7},{t:this.shape}]},2).to({state:[{t:this.shape_7},{t:this.shape}]},1).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-28,-28,56,56.1);


(lib.Star1Animation = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(255,255,255,0)").s().p("AACETIgBgDQADgEgBgDIgCgGIgBgJIAAgBQAAgIABgJIABgDIABgBIAAAAIABAAIAAABIABABQgDAKABAJIACAPQACAFgGAHIABgBgAgGCGIAAAAIgBgBIAAgBIgBgQIgDgVIAAgBIgBgWIACgQIABgGQACgMgDgHIgCgEIgFgLIAAABQgDgGgLgBIgUgBIgTgBIgBgBIAAgBIAAAAIABgBIABAAIASACIAUAAIAIACQAGACACAEIAAAAIADAFIAEAKQADAIgCAMIgCAWIAAABIAAAVIABAJIACANIACAQIgBABIAAABIgBAAgAAKBUIAAAAIgBgBIAAgBIACgEQACgHgBgIIAAgBIgBgSIAAAAIACgMIACgGQACgLAHgFIADgBQAFgDAHAAQAKAAALgCIAVgEQAJgBAMAEIABABIAAABIAAAAIgBABIgBAAIgCgBQgKgEgIABIgUAEIgEABQgKACgIAAQgIAAgGADQgFAFgDAJIgDASIAAATQACALgEAJIgBABIAAAAIgBAAgAhJAIIgUgBIgTgBIgSgBIgUABQgMAAgNgEIgEgBIgMgBIgCABQgHADgLgBQgKAAgJgCQgIgBgPAAIgBgBIAAgBIAAAAIABgBIAAAAIAWACIACAAQAIABAKABQAHAAAFgBIAFgBQAIgDAMAEIAHACQAJABAIAAIAKAAIAKAAIASAAIAAAAIATABIAUABIABABIABAAIgBABIAAABIgBAAgABpAGIgBgBIAAAAIAAgBIABgBIABAAQAJABALgBQAMgBAJAAIABAAIACAAQAIABAIgBIABgBIABAAIAIAAIAJABQAJABAIgDIACAAIALgDIgEAAIgVgEQgIgBgKAAIgBgBIAAAAIAAgBIAAgBIABAAQALAAAHACIAIABIANACQAMACAIgCIACgBIABAAQAKgDAHACIANACIAAAAIAFABIABABIAAABIAAAAIgBABIgBABIgBgBIAAgBIAAAAIAAAAIgBABIgBABIgSABQgMABgKgBIgFAAIgGAAIgJABQgKAFgKgCQgKgBgJABQgJACgKgBIAAAAQgJgBgLACIgMAAIgKAAgADxgGIgHACIAAAAIgKABIACABIALABIAIgBIABAAIAQgCIgLgBIgBAAIgFgBIgEAAgAkAAAIgEgCIgBAAIAAAAIgFABQgBAAAAAAQgBAAAAgBQgBAAAAAAQAAgBAAAAIAAgBIABgCIADAAIAFABQAHgBAKAAQALAAAKgCQALgBAJAAIABAAQAKABAJgBIAUgCIABAAIABABIAAAAIgBABIAAABIgUACQgKABgLgBQgJgBgKACQgKACgMgBIgNABIABAAIAAABIABAAIAAABIgBABIgBAAIAAAAgAkLgDIABAAIABAAIgBgBIgBABgACogIIgRgBIgTAAQgKAAgNgCIgXgBQgMAAgKgBIgSgBIgSgBIgBgBIAAgBIAAAAIABgBIAAAAIASABIASACQAKABAMgBIAYACQAMACAKgBIATAAIARABIABABIABAAIAAABIgBAAIAAABIgBAAgAifgJIgBgBIAAAAIAAAAIABgBQAPAAAHgCQAIgBAKABQALABAJgBIAOgBIAHABQALAAAJgCIAAAAQAJgEAIABQAJAAAHgGIANgJIAAAAIABAAIAAABIABABIgBAAIgBABIgLAIQgGAEgGABIgGABQgHAAgJADQgJADgMgBQgLgBgKABQgJABgLgBQgKAAgHABQgHABgQABIAAAAIAAgBgAAZgQIgDgBQgGgFgBgGIgCgIIgBgJIgCgWIgBgVIgBgTIgBgSIgBgTIgCgXIgCgVIAAAAQAAgJABgKIABgBIAAAAIABAAIAAABIABABIgBAHIAAALIAAAAIABAVIABANIABAKIACATIABASIABATIABAVIACAVIACASQACAGAHAEIABABIgBABIAAABIAAAAIgBgBgAgMghIAAAAIgBgBIAAgBIACgSIABgVIAAgUQABgJgCgLQgCgLAFgKIAAAAIACgEQADgHAAgIQABgKgCgKIAAAAQgCgKABgLIABgBIAAAAIABAAIAAABIABAAQgBALABAJQACAKAAALQgBALgFAJIAAAAIAAACQgEAIABAKIABAHIABANIgBAUIgBAWIgBARIgBABIAAABIgBAAgAgEjEIgBgBQgEgKABgLIAAAAIAEgSIAAgBQACgHABgNIABgQIAAAAIAAgBIAAgBIABAAQAAAAAAAAQABAAAAAAQAAAAAAABQAAAAAAABIABAFIABASIABAUIAAAAQABAKAAAKIgBABIgBABIgBgBIAAgBQABgKgBgKIgBgUIgBgQIgBAJQAAALgBAHIgBADIgDASIAAAAQgBAJADAJIABACIAAABIgBABIgBAAIAAAAg");
	this.shape.setTransform(-0.0492,0.4729);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFED").s().p("AgGCKIAAAAIABAAIAAgBIgBgRIgCgNIgCgdIAAgBIADgWQACgNgDgIIgFgJIAAgLIgKAAIgIgCIgUgBIgTgBIgBAAIAAABIAAAAIgBAAIAAgBIgBAAIgUgBIgTgBIAAAAIgSgBIgKAAIgbgBIgHgCQgNgEgHADIgFABIgggBIgWgCIgBAAIAAAAIgBAAIgBAAIAAAAIAMgBQAMAAAKgBQALgBAJAAQAKABAKgBIAUgCIABAAIAAgBIAAAAIABAAIAAAAIAAABIABAAQAPAAAHgCQAIgBAKABQALABAJgBQAJgBAMABQAMABAIgDQAJgDAIAAIAGgBIAWgBIAAgMIACgBIAAgBIAAgBIgBAAIAAAAIAAgBIAAAAIABAAIAAgBIACgSIABgVIAAgVIAAgNIABgZIABgBIAAAAQAFgKAAgKQABgLgCgKQgCgKABgKIAAgBIgBAAIAAgBIABgBIAAAAIAAgCIACgoQABgHAAgKIABgJIAAAPIABAVQABAKAAAKIAAABIABAAIAAABIgBAAIAAABQgCAKABAIIAAABIABAUIACAYIACATIABARIABAUIABAVIACAVIABAKIABASIAIAAIACACIABAAIABAAIAAgBIABAAIAAAAIAAABIABAAIASABIASACQAKABAMgBIAXACQAMACAKgBIATAAIASABIABAAIAAgBIACAAIAAABIABAAQAKAAAHACIAVACIAEABIgKACIgCABIgbABIgHABIgBAAIgSABIgCAAIAAAAQgKgBgLACQgLABgKgBIgBAAIAAABIAAAAIgCAAIAAgBIAAAAQgNgFgJABIgUAEQgMADgJAAQgHAAgGACIgMABIgBAWIgCAMIAAABIAAARIAAACQABAHgCAHIgBAEIAAABIABABIAAAAIgHCRIgBAAIAAABIgBADQgBAJAAAIIAAABIABAIIgBARgAgMAfIABAEQADAIgCALIgBAGgAA8ALIAVgEQAHgBAKAEIgqACIAEgBgADhABIgBAAIAKgBIAAAAIAHgBIAKAAIAKABIgPACIgCAAIgHABIgMgCgAEOAAIgBAAIALAAIgKABgAkLAAIACAAIgCABIAAgBgAkXAAIAJAAIAAABgADTgBIgNgCIAgABIgJACIgKgBgAhOgJIgHAAIAagCQgGACgIAAIgFAAgAgFipQACAJAAALQgBAHgCAIgAAGijIgCgVIAAAAIAAgLIADAuIgBgOgAAAkXIABAJIgBAAIAAAAg");

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("rgba(255,255,237,0.808)").s().p("AgGCKIAAAAIABAAIAAgBIgBgRIgCgNIgCgdIAAgBIADgWQACgNgDgIIgFgJIAAgLIgKAAIgIgCIgUgBIgTgBIgBAAIAAABIAAAAIgBAAIAAgBIgBAAIgUgBIgTgBIAAAAIgSgBIgKAAIgbgBIgHgCQgNgEgHADIgFABIgggBIgWgCIgBAAIAAAAIgBAAIgBAAIAAAAIAMgBQAMAAAKgBQALgBAJAAQAKABAKgBIAUgCIABAAIAAgBIAAAAIABAAIAAAAIAAABIABAAQAPAAAHgCQAIgBAKABQALABAJgBQAJgBAMABQAMABAIgDQAJgDAIAAIAGgBIAWgBIAAgMIACgBIAAgBIAAgBIgBAAIAAAAIAAgBIAAAAIABAAIAAgBIACgSIABgVIAAgVIAAgNIABgZIABgBIAAAAQAFgKAAgKQABgLgCgKQgCgKABgKIAAgBIgBAAIAAgBIABgBIAAAAIAAgCIACgoQABgHAAgKIABgJIAAAPIABAVQABAKAAAKIAAABIABAAIAAABIgBAAIAAABQgCAKABAIIAAABIABAUIACAYIACATIABARIABAUIABAVIACAVIABAKIABASIAIAAIACACIABAAIABAAIAAgBIABAAIAAAAIAAABIABAAIASABIASACQAKABAMgBIAXACQAMACAKgBIATAAIASABIABAAIAAgBIACAAIAAABIABAAQAKAAAHACIAVACIAEABIgKACIgCABIgbABIgHABIgBAAIgSABIgCAAIAAAAQgKgBgLACQgLABgKgBIgBAAIAAABIAAAAIgCAAIAAgBIAAAAQgNgFgJABIgUAEQgMADgJAAQgHAAgGACIgMABIgBAWIgCAMIAAABIAAARIAAACQABAHgCAHIgBAEIAAABIABABIAAAAIgHCRIgBAAIAAABIgBADQgBAJAAAIIAAABIABAIIgBARgAgMAfIABAEQADAIgCALIgBAGgAA8ALIAVgEQAHgBAKAEIgqACIAEgBgADhABIgBAAIAKgBIAAAAIAHgBIAKAAIAKABIgPACIgCAAIgHABIgMgCgAEOAAIgBAAIALAAIgKABgAkLAAIACAAIgCABIAAgBgAkXAAIAJAAIAAABgADTgBIgNgCIAgABIgJACIgKgBgAhOgJIgHAAIAagCQgGACgIAAIgFAAgAgFipQACAJAAALQgBAHgCAIgAAGijIgCgVIAAAAIAAgLIADAuIgBgOgAAAkXIABAJIgBAAIAAAAg");

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("rgba(255,255,237,0.647)").s().p("AgGCKIAAAAIABAAIAAgBIgBgRIgCgNIgCgdIAAgBIADgWQACgNgDgIIgFgJIAAgLIgKAAIgIgCIgUgBIgTgBIgBAAIAAABIAAAAIgBAAIAAgBIgBAAIgUgBIgTgBIAAAAIgSgBIgKAAIgbgBIgHgCQgNgEgHADIgFABIgggBIgWgCIgBAAIAAAAIgBAAIgBAAIAAAAIAMgBQAMAAAKgBQALgBAJAAQAKABAKgBIAUgCIABAAIAAgBIAAAAIABAAIAAAAIAAABIABAAQAPAAAHgCQAIgBAKABQALABAJgBQAJgBAMABQAMABAIgDQAJgDAIAAIAGgBIAWgBIAAgMIACgBIAAgBIAAgBIgBAAIAAAAIAAgBIAAAAIABAAIAAgBIACgSIABgVIAAgVIAAgNIABgZIABgBIAAAAQAFgKAAgKQABgLgCgKQgCgKABgKIAAgBIgBAAIAAgBIABgBIAAAAIAAgCIACgoQABgHAAgKIABgJIAAAPIABAVQABAKAAAKIAAABIABAAIAAABIgBAAIAAABQgCAKABAIIAAABIABAUIACAYIACATIABARIABAUIABAVIACAVIABAKIABASIAIAAIACACIABAAIABAAIAAgBIABAAIAAAAIAAABIABAAIASABIASACQAKABAMgBIAXACQAMACAKgBIATAAIASABIABAAIAAgBIACAAIAAABIABAAQAKAAAHACIAVACIAEABIgKACIgCABIgbABIgHABIgBAAIgSABIgCAAIAAAAQgKgBgLACQgLABgKgBIgBAAIAAABIAAAAIgCAAIAAgBIAAAAQgNgFgJABIgUAEQgMADgJAAQgHAAgGACIgMABIgBAWIgCAMIAAABIAAARIAAACQABAHgCAHIgBAEIAAABIABABIAAAAIgHCRIgBAAIAAABIgBADQgBAJAAAIIAAABIABAIIgBARgAgMAfIABAEQADAIgCALIgBAGgAA8ALIAVgEQAHgBAKAEIgqACIAEgBgADhABIgBAAIAKgBIAAAAIAHgBIAKAAIAKABIgPACIgCAAIgHABIgMgCgAEOAAIgBAAIALAAIgKABgAkLAAIACAAIgCABIAAgBgAkXAAIAJAAIAAABgADTgBIgNgCIAgABIgJACIgKgBgAhOgJIgHAAIAagCQgGACgIAAIgFAAgAgFipQACAJAAALQgBAHgCAIgAAGijIgCgVIAAAAIAAgLIADAuIgBgOgAAAkXIABAJIgBAAIAAAAg");

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("rgba(255,255,237,0.486)").s().p("AgGCKIAAAAIABAAIAAgBIgBgRIgCgNIgCgdIAAgBIADgWQACgNgDgIIgFgJIAAgLIgKAAIgIgCIgUgBIgTgBIgBAAIAAABIAAAAIgBAAIAAgBIgBAAIgUgBIgTgBIAAAAIgSgBIgKAAIgbgBIgHgCQgNgEgHADIgFABIgggBIgWgCIgBAAIAAAAIgBAAIgBAAIAAAAIAMgBQAMAAAKgBQALgBAJAAQAKABAKgBIAUgCIABAAIAAgBIAAAAIABAAIAAAAIAAABIABAAQAPAAAHgCQAIgBAKABQALABAJgBQAJgBAMABQAMABAIgDQAJgDAIAAIAGgBIAWgBIAAgMIACgBIAAgBIAAgBIgBAAIAAAAIAAgBIAAAAIABAAIAAgBIACgSIABgVIAAgVIAAgNIABgZIABgBIAAAAQAFgKAAgKQABgLgCgKQgCgKABgKIAAgBIgBAAIAAgBIABgBIAAAAIAAgCIACgoQABgHAAgKIABgJIAAAPIABAVQABAKAAAKIAAABIABAAIAAABIgBAAIAAABQgCAKABAIIAAABIABAUIACAYIACATIABARIABAUIABAVIACAVIABAKIABASIAIAAIACACIABAAIABAAIAAgBIABAAIAAAAIAAABIABAAIASABIASACQAKABAMgBIAXACQAMACAKgBIATAAIASABIABAAIAAgBIACAAIAAABIABAAQAKAAAHACIAVACIAEABIgKACIgCABIgbABIgHABIgBAAIgSABIgCAAIAAAAQgKgBgLACQgLABgKgBIgBAAIAAABIAAAAIgCAAIAAgBIAAAAQgNgFgJABIgUAEQgMADgJAAQgHAAgGACIgMABIgBAWIgCAMIAAABIAAARIAAACQABAHgCAHIgBAEIAAABIABABIAAAAIgHCRIgBAAIAAABIgBADQgBAJAAAIIAAABIABAIIgBARgAgMAfIABAEQADAIgCALIgBAGgAA8ALIAVgEQAHgBAKAEIgqACIAEgBgADhABIgBAAIAKgBIAAAAIAHgBIAKAAIAKABIgPACIgCAAIgHABIgMgCgAEOAAIgBAAIALAAIgKABgAkLAAIACAAIgCABIAAgBgAkXAAIAJAAIAAABgADTgBIgNgCIAgABIgJACIgKgBgAhOgJIgHAAIAagCQgGACgIAAIgFAAgAgFipQACAJAAALQgBAHgCAIgAAGijIgCgVIAAAAIAAgLIADAuIgBgOgAAAkXIABAJIgBAAIAAAAg");

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("rgba(255,255,237,0.31)").s().p("AgGCKIAAAAIABAAIAAgBIgBgRIgCgNIgCgdIAAgBIADgWQACgNgDgIIgFgJIAAgLIgKAAIgIgCIgUgBIgTgBIgBAAIAAABIAAAAIgBAAIAAgBIgBAAIgUgBIgTgBIAAAAIgSgBIgKAAIgbgBIgHgCQgNgEgHADIgFABIgggBIgWgCIgBAAIAAAAIgBAAIgBAAIAAAAIAMgBQAMAAAKgBQALgBAJAAQAKABAKgBIAUgCIABAAIAAgBIAAAAIABAAIAAAAIAAABIABAAQAPAAAHgCQAIgBAKABQALABAJgBQAJgBAMABQAMABAIgDQAJgDAIAAIAGgBIAWgBIAAgMIACgBIAAgBIAAgBIgBAAIAAAAIAAgBIAAAAIABAAIAAgBIACgSIABgVIAAgVIAAgNIABgZIABgBIAAAAQAFgKAAgKQABgLgCgKQgCgKABgKIAAgBIgBAAIAAgBIABgBIAAAAIAAgCIACgoQABgHAAgKIABgJIAAAPIABAVQABAKAAAKIAAABIABAAIAAABIgBAAIAAABQgCAKABAIIAAABIABAUIACAYIACATIABARIABAUIABAVIACAVIABAKIABASIAIAAIACACIABAAIABAAIAAgBIABAAIAAAAIAAABIABAAIASABIASACQAKABAMgBIAXACQAMACAKgBIATAAIASABIABAAIAAgBIACAAIAAABIABAAQAKAAAHACIAVACIAEABIgKACIgCABIgbABIgHABIgBAAIgSABIgCAAIAAAAQgKgBgLACQgLABgKgBIgBAAIAAABIAAAAIgCAAIAAgBIAAAAQgNgFgJABIgUAEQgMADgJAAQgHAAgGACIgMABIgBAWIgCAMIAAABIAAARIAAACQABAHgCAHIgBAEIAAABIABABIAAAAIgHCRIgBAAIAAABIgBADQgBAJAAAIIAAABIABAIIgBARgAgMAfIABAEQADAIgCALIgBAGgAA8ALIAVgEQAHgBAKAEIgqACIAEgBgADhABIgBAAIAKgBIAAAAIAHgBIAKAAIAKABIgPACIgCAAIgHABIgMgCgAEOAAIgBAAIALAAIgKABgAkLAAIACAAIgCABIAAgBgAkXAAIAJAAIAAABgADTgBIgNgCIAgABIgJACIgKgBgAhOgJIgHAAIAagCQgGACgIAAIgFAAgAgFipQACAJAAALQgBAHgCAIgAAGijIgCgVIAAAAIAAgLIADAuIgBgOgAAAkXIABAJIgBAAIAAAAg");

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("rgba(255,255,237,0.11)").s().p("AgGCKIAAAAIABAAIAAgBIgBgRIgCgNIgCgdIAAgBIADgWQACgNgDgIIgFgJIAAgLIgKAAIgIgCIgUgBIgTgBIgBAAIAAABIAAAAIgBAAIAAgBIgBAAIgUgBIgTgBIAAAAIgSgBIgKAAIgbgBIgHgCQgNgEgHADIgFABIgggBIgWgCIgBAAIAAAAIgBAAIgBAAIAAAAIAMgBQAMAAAKgBQALgBAJAAQAKABAKgBIAUgCIABAAIAAgBIAAAAIABAAIAAAAIAAABIABAAQAPAAAHgCQAIgBAKABQALABAJgBQAJgBAMABQAMABAIgDQAJgDAIAAIAGgBIAWgBIAAgMIACgBIAAgBIAAgBIgBAAIAAAAIAAgBIAAAAIABAAIAAgBIACgSIABgVIAAgVIAAgNIABgZIABgBIAAAAQAFgKAAgKQABgLgCgKQgCgKABgKIAAgBIgBAAIAAgBIABgBIAAAAIAAgCIACgoQABgHAAgKIABgJIAAAPIABAVQABAKAAAKIAAABIABAAIAAABIgBAAIAAABQgCAKABAIIAAABIABAUIACAYIACATIABARIABAUIABAVIACAVIABAKIABASIAIAAIACACIABAAIABAAIAAgBIABAAIAAAAIAAABIABAAIASABIASACQAKABAMgBIAXACQAMACAKgBIATAAIASABIABAAIAAgBIACAAIAAABIABAAQAKAAAHACIAVACIAEABIgKACIgCABIgbABIgHABIgBAAIgSABIgCAAIAAAAQgKgBgLACQgLABgKgBIgBAAIAAABIAAAAIgCAAIAAgBIAAAAQgNgFgJABIgUAEQgMADgJAAQgHAAgGACIgMABIgBAWIgCAMIAAABIAAARIAAACQABAHgCAHIgBAEIAAABIABABIAAAAIgHCRIgBAAIAAABIgBADQgBAJAAAIIAAABIABAIIgBARgAgMAfIABAEQADAIgCALIgBAGgAA8ALIAVgEQAHgBAKAEIgqACIAEgBgADhABIgBAAIAKgBIAAAAIAHgBIAKAAIAKABIgPACIgCAAIgHABIgMgCgAEOAAIgBAAIALAAIgKABgAkLAAIACAAIgCABIAAgBgAkXAAIAJAAIAAABgADTgBIgNgCIAgABIgJACIgKgBgAhOgJIgHAAIAagCQgGACgIAAIgFAAgAgFipQACAJAAALQgBAHgCAIgAAGijIgCgVIAAAAIAAgLIADAuIgBgOgAAAkXIABAJIgBAAIAAAAg");

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("rgba(255,255,237,0)").s().p("AgGCKIAAAAIABAAIAAgBIgBgRIgCgNIgCgdIAAgBIADgWQACgNgDgIIgFgJIAAgLIgKAAIgIgCIgUgBIgTgBIgBAAIAAABIAAAAIgBAAIAAgBIgBAAIgUgBIgTgBIAAAAIgSgBIgKAAIgbgBIgHgCQgNgEgHADIgFABIgggBIgWgCIgBAAIAAAAIgBAAIgBAAIAAAAIAMgBQAMAAAKgBQALgBAJAAQAKABAKgBIAUgCIABAAIAAgBIAAAAIABAAIAAAAIAAABIABAAQAPAAAHgCQAIgBAKABQALABAJgBQAJgBAMABQAMABAIgDQAJgDAIAAIAGgBIAWgBIAAgMIACgBIAAgBIAAgBIgBAAIAAAAIAAgBIAAAAIABAAIAAgBIACgSIABgVIAAgVIAAgNIABgZIABgBIAAAAQAFgKAAgKQABgLgCgKQgCgKABgKIAAgBIgBAAIAAgBIABgBIAAAAIAAgCIACgoQABgHAAgKIABgJIAAAPIABAVQABAKAAAKIAAABIABAAIAAABIgBAAIAAABQgCAKABAIIAAABIABAUIACAYIACATIABARIABAUIABAVIACAVIABAKIABASIAIAAIACACIABAAIABAAIAAgBIABAAIAAAAIAAABIABAAIASABIASACQAKABAMgBIAXACQAMACAKgBIATAAIASABIABAAIAAgBIACAAIAAABIABAAQAKAAAHACIAVACIAEABIgKACIgCABIgbABIgHABIgBAAIgSABIgCAAIAAAAQgKgBgLACQgLABgKgBIgBAAIAAABIAAAAIgCAAIAAgBIAAAAQgNgFgJABIgUAEQgMADgJAAQgHAAgGACIgMABIgBAWIgCAMIAAABIAAARIAAACQABAHgCAHIgBAEIAAABIABABIAAAAIgHCRIgBAAIAAABIgBADQgBAJAAAIIAAABIABAIIgBARgAgMAfIABAEQADAIgCALIgBAGgAA8ALIAVgEQAHgBAKAEIgqACIAEgBgADhABIgBAAIAKgBIAAAAIAHgBIAKAAIAKABIgPACIgCAAIgHABIgMgCgAEOAAIgBAAIALAAIgKABgAkLAAIACAAIgCABIAAgBgAkXAAIAJAAIAAABgADTgBIgNgCIAgABIgJACIgKgBgAhOgJIgHAAIAagCQgGACgIAAIgFAAgAgFipQACAJAAALQgBAHgCAIgAAGijIgCgVIAAAAIAAgLIADAuIgBgOgAAAkXIABAJIgBAAIAAAAg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_2},{t:this.shape}]},2).to({state:[{t:this.shape_3},{t:this.shape}]},1).to({state:[{t:this.shape_4},{t:this.shape}]},2).to({state:[{t:this.shape_5},{t:this.shape}]},1).to({state:[{t:this.shape_6},{t:this.shape}]},2).to({state:[{t:this.shape_7},{t:this.shape}]},1).to({state:[{t:this.shape_7},{t:this.shape}]},2).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-28,-28,56,56.1);


(lib.sinalscene = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Lips_NewsGuy
	this.instance = new lib.CachedBmp_88();
	this.instance.setTransform(459.1,-368.2,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_89();
	this.instance_1.setTransform(459.1,-367.7,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_4();
	this.instance_2.setTransform(459.1,-367.25,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_5();
	this.instance_3.setTransform(459.1,-366.4,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_6();
	this.instance_4.setTransform(459.1,-365.6,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_90();
	this.instance_5.setTransform(459.1,-366.85,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_91();
	this.instance_6.setTransform(459.1,-368.15,0.5,0.5);

	this.instance_7 = new lib.CachedBmp_92();
	this.instance_7.setTransform(459.1,-367.7,0.5,0.5);

	this.instance_8 = new lib.CachedBmp_93();
	this.instance_8.setTransform(459.1,-367.2,0.5,0.5);

	this.instance_9 = new lib.CachedBmp_94();
	this.instance_9.setTransform(459.1,-366.35,0.5,0.5);

	this.instance_10 = new lib.CachedBmp_95();
	this.instance_10.setTransform(459.1,-365.55,0.5,0.5);

	this.instance_11 = new lib.CachedBmp_96();
	this.instance_11.setTransform(459.1,-366.8,0.5,0.5);

	this.instance_12 = new lib.CachedBmp_97();
	this.instance_12.setTransform(459.1,-368.15,0.5,0.5);

	this.instance_13 = new lib.CachedBmp_98();
	this.instance_13.setTransform(459.1,-367.7,0.5,0.5);

	this.instance_14 = new lib.CachedBmp_99();
	this.instance_14.setTransform(459.1,-367.2,0.5,0.5);

	this.instance_15 = new lib.CachedBmp_100();
	this.instance_15.setTransform(459.1,-366.35,0.5,0.5);

	this.instance_16 = new lib.CachedBmp_101();
	this.instance_16.setTransform(459.1,-365.55,0.5,0.5);

	this.instance_17 = new lib.CachedBmp_102();
	this.instance_17.setTransform(459.1,-366.8,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},3).to({state:[{t:this.instance_2}]},8).to({state:[{t:this.instance_3}]},3).to({state:[{t:this.instance_4}]},3).to({state:[{t:this.instance_5}]},3).to({state:[{t:this.instance_6}]},2).to({state:[{t:this.instance_7}]},3).to({state:[{t:this.instance_8}]},3).to({state:[{t:this.instance_9}]},3).to({state:[{t:this.instance_10}]},3).to({state:[{t:this.instance_11}]},3).to({state:[{t:this.instance_12}]},2).to({state:[{t:this.instance_13}]},3).to({state:[{t:this.instance_14}]},3).to({state:[{t:this.instance_15}]},3).to({state:[{t:this.instance_16}]},3).to({state:[{t:this.instance_17}]},3).wait(2));

	// flash0_ai
	this.instance_18 = new lib.CachedBmp_103();
	this.instance_18.setTransform(-141.4,-258.5,0.5,0.5);

	this.instance_19 = new lib.CachedBmp_104();
	this.instance_19.setTransform(-141.95,-258.8,0.5,0.5);

	this.instance_20 = new lib.CachedBmp_105();
	this.instance_20.setTransform(-142.2,-259.9,0.5,0.5);

	this.instance_21 = new lib.CachedBmp_106();
	this.instance_21.setTransform(-142.2,-260.15,0.5,0.5);

	this.instance_22 = new lib.CachedBmp_107();
	this.instance_22.setTransform(-142.2,-260.15,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_18}]},21).to({state:[{t:this.instance_19}]},7).to({state:[{t:this.instance_20}]},7).to({state:[{t:this.instance_21}]},7).to({state:[{t:this.instance_22}]},7).wait(7));

	// flash0_ai
	this.instance_23 = new lib.CachedBmp_120();
	this.instance_23.setTransform(-706.95,-477.75,0.5,0.5);

	this.text = new cjs.Text("\nMusic video by Billie Eilish performing bad guy. © 2019 Darkroom/Interscope Records", "20px 'Tw Cen MT'");
	this.text.lineHeight = 24;
	this.text.lineWidth = 729;
	this.text.parent = this;
	this.text.setTransform(-515.75,-40.65);
	this.text.shadow = new cjs.Shadow("rgba(0,0,0,1)",3,3,4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text},{t:this.instance_23}]}).wait(56));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-706.9,-477.7,1414,954.5);


(lib.Scene_1_House_Text = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// House_Text
	this.text = new cjs.Text("da-vinci\n family", "10px 'Snap ITC'", "#FFFFFF");
	this.text.textAlign = "center";
	this.text.lineHeight = 15;
	this.text.lineWidth = 94;
	this.text.parent = this;
	this.text.setTransform(629.8,425.7,1.5278,1.5728);
	this.text.shadow = new cjs.Shadow("rgba(0,0,0,1)",4,4,4);
	this.text._off = true;

	this.timeline.addTween(cjs.Tween.get(this.text).wait(572).to({_off:false},0).wait(58));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Mona_Lisa_BG = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_10();
	this.instance.setTransform(-263.15,-249.35,0.3172,0.3172);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-263.1,-249.3,526.2,499.6);


(lib.House = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_113();
	this.instance.setTransform(-396.05,-374.25,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-396,-374.2,792,748.5);


(lib.GalleryBG = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.flash0ai();
	this.instance.setTransform(0,0,0.4502,0.4502);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.GalleryBG, new cjs.Rectangle(0,0,4043.7,515.5), null);


(lib.Path_15 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#18152D").s().p("EhdtBDBQnVAAmti2Qmeivk/k/QlAlAivmeQi1mtAAnVMAAAg95QAAnVC1mtQCvmeFAlAQE/k/GeivQGti2HVAAMC7bAAAQHVAAGtC2QGeCvE/E/QFAFACvGeQC1GtAAHVMAAAA95QAAHVi1GtQivGelAFAQk/E/meCvQmtC2nVAAg");
	this.shape.setTransform(830.525,428.85);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_15, new cjs.Rectangle(0,0,1661.1,857.7), null);


(lib.Path = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#18152D").s().p("EhdtBDAQnVAAmti1QmeivlAlAQk/k/ivmeQi2mtAAnVMAAAg95QAAnVC2mtQCvmeE/k/QFAlAGeivQGti1HVAAMC7bAAAQHWAAGsC1QGeCvFAFAQE/E/CvGeQC1GtABHVMAAAA95QgBHVi1GtQivGek/E/QlAFAmeCvQmsC1nWAAg");
	this.shape.setTransform(830.55,428.825);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path, new cjs.Rectangle(0,0,1661.1,857.7), null);


(lib.MonaLisaEntranceLeo = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_11();
	this.instance.setTransform(-69.1,-242.55,0.0616,0.0616);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-69.1,-242.5,135.89999999999998,485.1);


(lib.Body = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_62();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,191.5,311.5);


(lib.Side_View_Leo = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_61();
	this.instance.setTransform(-36.7,-193.2,0.2389,0.2389);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-36.7,-193.2,73.6,386.5);


(lib.singlecloud = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_9();
	this.instance.setTransform(-261.9,-142.3,0.4318,0.4318);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-261.9,-142.3,523.8,284.6);


(lib.Camerarecording = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// camera
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(255,0,0,0.8)").s().p("AhpBqQgsgsAAg+QAAg9AsgsQAsgsA9AAQA+AAAsAsQAsAsAAA9QAAA+gsAsQgsAsg+AAQg9AAgsgsg");
	this.shape.setTransform(82.7,78.6);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(255,0,0,0.4)").s().p("AhpBqQgsgsAAg+QAAg9AsgsQAsgsA9AAQA+AAAsAsQAsAsAAA9QAAA+gsAsQgsAsg+AAQg9AAgsgsg");
	this.shape_1.setTransform(82.7,78.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},15).wait(12));

	// BG
	this.instance = new lib.BG();
	this.instance.setTransform(-10,-10,0.358,0.3597);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(3).to({x:-11,y:-11},0).wait(3).to({x:-12,y:-12},0).wait(3).to({x:-11,y:-11},0).wait(3).to({x:-10,y:-10},0).wait(3).to({x:-9,y:-9},0).wait(3).to({x:-8,y:-8},0).wait(3).to({x:-9,y:-9},0).wait(3).to({x:-10,y:-10},0).wait(3));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-12,-12,1304,744);


(lib.___Camera___ = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		this.visible = false;
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(2));

	// cameraBoundary
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("rgba(0,0,0,0)").ss(2,1,1,3,true).p("EAq+AfQMhV7AAAMAAAg+fMBV7AAAg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-641,-361,1282,722);


(lib.replay = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.text = new cjs.Text("AGAIN", "96px 'Ravie'", "#FFFFFF");
	this.text.lineHeight = 130;
	this.text.lineWidth = 429;
	this.text.parent = this;
	this.text.setTransform(-63.15,-54.2);

	this.text_1 = new cjs.Text("LETS DRAW", "58px 'Ravie'", "#FFFFFF");
	this.text_1.lineHeight = 79;
	this.text_1.lineWidth = 475;
	this.text_1.parent = this;
	this.text_1.setTransform(-100.35,-117.5);

	this.instance = new lib.CachedBmp_156();
	this.instance.setTransform(-389.3,-275.2,0.5,0.5);

	this.instance_1 = new lib.Path_15();
	this.instance_1.setTransform(59.1,-20.3,0.3883,0.3883,0,0,0,831.2,429.2);
	this.instance_1.alpha = 0.8008;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance},{t:this.text_1},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.replay, new cjs.Rectangle(-389.3,-275.2,770.6,563.5), null);


(lib.PuppetShape_54 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_6("synched",0);
	this.instance.setTransform(0,0,1,1,0,0,0,-7,1.7);

	this.instance_1 = new lib.CachedBmp_87();
	this.instance_1.setTransform(-53.8,-315.45,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-72.7,-315.4,157.4,420.4);


(lib.PuppetShape_50 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_6("synched",0);
	this.instance.setTransform(0,0,1,1,0,0,0,-7,1.7);

	this.instance_1 = new lib.CachedBmp_86();
	this.instance_1.setTransform(-57.7,-105.35,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-72.7,-106,170,215.2);


(lib.PuppetShape_49 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_6("synched",0);
	this.instance.setTransform(0,0,1,1,0,0,0,-7,1.7);

	this.instance_1 = new lib.CachedBmp_79();
	this.instance_1.setTransform(-55.75,-105.35,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-72.7,-106,168,216.2);


(lib.PuppetShape_48 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_6("synched",0);
	this.instance.setTransform(0,0,1,1,0,0,0,-7,1.7);

	this.instance_1 = new lib.CachedBmp_78();
	this.instance_1.setTransform(-68.8,-105.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-72.7,-106,165.9,211);


(lib.PuppetShape_47 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_6("synched",0);
	this.instance.setTransform(0,0,1,1,0,0,0,-7,1.7);

	this.instance_1 = new lib.CachedBmp_77();
	this.instance_1.setTransform(-50.5,-105.25,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-72.7,-106,164.2,211);


(lib.PuppetShape_46 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_6("synched",0);
	this.instance.setTransform(0,0,1,1,0,0,0,-7,1.7);

	this.instance_1 = new lib.CachedBmp_76();
	this.instance_1.setTransform(-66.25,-105.2,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-72.7,-106,162,211);


(lib.PuppetShape_45 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_6("synched",0);
	this.instance.setTransform(0,0,1,1,0,0,0,-7,1.7);

	this.instance_1 = new lib.CachedBmp_75();
	this.instance_1.setTransform(-70.1,-105.1,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-72.7,-106,160.10000000000002,211.9);


(lib.PuppetShape_44 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_6("synched",0);
	this.instance.setTransform(0,0,1,1,0,0,0,-7,1.7);

	this.instance_1 = new lib.CachedBmp_74();
	this.instance_1.setTransform(-72.9,-104.95,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-72.9,-106,159,213.1);


(lib.PuppetShape_43 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_6("synched",0);
	this.instance.setTransform(0,0,1,1,0,0,0,-7,1.7);

	this.instance_1 = new lib.CachedBmp_73();
	this.instance_1.setTransform(-70.4,-104.85,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-72.7,-106,157.8,213.7);


(lib.PuppetShape_42 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_6("synched",0);
	this.instance.setTransform(0,0,1,1,0,0,0,-7,1.7);

	this.instance_1 = new lib.CachedBmp_72();
	this.instance_1.setTransform(-68.1,-104.75,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-72.7,-106,156.10000000000002,219.8);


(lib.PuppetShape_41 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_6("synched",0);
	this.instance.setTransform(0,0,1,1,0,0,0,-7,1.7);

	this.instance_1 = new lib.CachedBmp_71();
	this.instance_1.setTransform(-78.7,-104.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-78.7,-106,160,215.4);


(lib.PuppetShape_40 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_6("synched",0);
	this.instance.setTransform(0,0,1,1,0,0,0,-7,1.7);

	this.instance_1 = new lib.CachedBmp_70();
	this.instance_1.setTransform(-65.8,-104.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-72.7,-106,152.5,215);


(lib.PuppetShape_39 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_6("synched",0);
	this.instance.setTransform(0,0,1,1,0,0,0,-7,1.7);

	this.instance_1 = new lib.CachedBmp_69();
	this.instance_1.setTransform(-80.7,-104.4,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-80.7,-106,160.5,216.1);


(lib.PuppetShape_38 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_6("synched",0);
	this.instance.setTransform(0,0,1,1,0,0,0,-7,1.7);

	this.instance_1 = new lib.CachedBmp_68();
	this.instance_1.setTransform(-83.8,-104.4,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-83.8,-106,163.6,221.1);


(lib.PuppetShape_37 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_6("synched",0);
	this.instance.setTransform(0,0,1,1,0,0,0,-7,1.7);

	this.instance_1 = new lib.CachedBmp_67();
	this.instance_1.setTransform(-86.05,-104.25,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-86,-106,165.8,219.3);


(lib.PuppetShape_36 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_6("synched",0);
	this.instance.setTransform(0,0,1,1,0,0,0,-7,1.7);

	this.instance_1 = new lib.CachedBmp_66();
	this.instance_1.setTransform(-81.5,-104.15,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-81.5,-106,161.3,217.4);


(lib.PuppetShape_35 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_2("synched",0);

	this.instance_1 = new lib.BMP_6ee24740_86fe_4ffc_9fe7_bf090fb4ef91();
	this.instance_1.setTransform(1.3,-1.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-1.4,261.3,980.4);


(lib.PuppetShape_34 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_2("synched",0);

	this.instance_1 = new lib.BMP_dd6b41c0_5568_4f07_bbc3_661edbd3dc5b();
	this.instance_1.setTransform(4.1,-3.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-3.6,264.1,982.6);


(lib.PuppetShape_33 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_2("synched",0);

	this.instance_1 = new lib.BMP_8092a444_8ce5_4664_9679_9f4d5a5aa692();
	this.instance_1.setTransform(-0.75,0.35);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.7,0,261.7,979);


(lib.PuppetShape_32 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_2("synched",0);

	this.instance_1 = new lib.BMP_823c1e00_6031_405e_bf46_eb255521357a();
	this.instance_1.setTransform(-1.95,0.2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.9,0,262.9,979);


(lib.PuppetShape_31 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_2("synched",0);

	this.instance_1 = new lib.BMP_3ba5c8f2_04b4_4b2b_a252_36f5c7ab6eb4();
	this.instance_1.setTransform(0,1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(33));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,261,979);


(lib.PuppetShape_30 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_44();
	this.instance_1.setTransform(-72.15,-118.85,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-72.1,-118.8,138.2,238);


(lib.PuppetShape_29 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_43();
	this.instance_1.setTransform(-72.15,-118.85,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-72.1,-118.8,138.2,238);


(lib.PuppetShape_28 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_42();
	this.instance_1.setTransform(-72.15,-118.85,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-72.1,-118.8,138.2,236);


(lib.PuppetShape_27copy = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_41();
	this.instance_1.setTransform(-72.15,-118.8,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-72.1,-118.8,138.2,239.5);


(lib.PuppetShape_27 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_40();
	this.instance_1.setTransform(-72.15,-118.8,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-72.1,-118.8,138.2,239.5);


(lib.PuppetShape_26 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_39();
	this.instance_1.setTransform(-72.15,-118.8,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-72.1,-118.8,138.2,239.5);


(lib.PuppetShape_25 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_38();
	this.instance_1.setTransform(-72.15,-118.8,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-72.1,-118.8,138.2,239.5);


(lib.PuppetShape_24 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_37();
	this.instance_1.setTransform(-72.15,-118.8,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-72.1,-118.8,138.2,236);


(lib.PuppetShape_23 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_36();
	this.instance_1.setTransform(-74.85,-119.85,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-74.8,-119.8,140.89999999999998,236);


(lib.PuppetShape_22 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_35();
	this.instance_1.setTransform(-74.15,-121.8,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-74.1,-121.8,140.2,237.5);


(lib.PuppetShape_21 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_34();
	this.instance_1.setTransform(-70.6,-120.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-70.6,-120.3,136.7,236.5);


(lib.PuppetShape_20 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_33();
	this.instance_1.setTransform(-70.4,-119.25,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-70.4,-119.2,136.5,235.5);


(lib.PuppetShape_19 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_32();
	this.instance_1.setTransform(-70.3,-119.35,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-70.3,-119.3,136.39999999999998,234);


(lib.PuppetShape_18 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_31();
	this.instance_1.setTransform(-70,-119.85,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-70,-119.8,136.1,234.5);


(lib.PuppetShape_17 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_30();
	this.instance_1.setTransform(-70.2,-119.45,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-70.2,-119.4,136.3,234);


(lib.PuppetShape_16 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_29();
	this.instance_1.setTransform(-70.3,-120.1,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-70.3,-120.1,136.39999999999998,233.7);


(lib.PuppetShape_15 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_28();
	this.instance_1.setTransform(-70.4,-119.85,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-70.4,-119.8,136.5,233.39999999999998);


(lib.PuppetShape_14 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_27();
	this.instance_1.setTransform(-71.7,-121.1,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-71.7,-121.1,137.8,234.7);


(lib.PuppetShape_13 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_26();
	this.instance_1.setTransform(-74,-121.8,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-74,-121.8,140.1,235.39999999999998);


(lib.PuppetShape_12 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_25();
	this.instance_1.setTransform(-69.95,-120.15,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-69.9,-120.1,136,233.7);


(lib.PuppetShape_11 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_24();
	this.instance_1.setTransform(-67.7,-119.05,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-67.7,-119,133.8,232.6);


(lib.PuppetShape_10 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_23();
	this.instance_1.setTransform(-67.7,-119.35,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-67.7,-119.3,133.8,232.89999999999998);


(lib.PuppetShape_9 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_22();
	this.instance_1.setTransform(-67.8,-117.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-67.8,-117.5,133.89999999999998,231.1);


(lib.PuppetShape_8 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_21();
	this.instance_1.setTransform(-67.7,-118.45,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-67.7,-118.4,133.8,232);


(lib.PuppetShape_7 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_20();
	this.instance_1.setTransform(-67.7,-118.25,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-67.7,-118.2,133.8,232);


(lib.PuppetShape_6 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_19();
	this.instance_1.setTransform(-67.75,-118.7,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-67.7,-118.7,134,232.5);


(lib.PuppetShape_5 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_18();
	this.instance_1.setTransform(-65.75,-122.65,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-65.9,-122.6,132.2,236.2);


(lib.PuppetShape_4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_17();
	this.instance_1.setTransform(-63.6,-114.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-65.9,-114.9,132,228.5);


(lib.PuppetShape_3copy = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_16();
	this.instance_1.setTransform(-65.75,-113.35,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-65.9,-113.4,132.2,227.10000000000002);


(lib.PuppetShape_3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_15();
	this.instance_1.setTransform(-72.15,-119,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-72.1,-119,138.2,236);


(lib.PuppetShape_2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.CachedBmp_14();
	this.instance_1.setTransform(-72.15,-118.8,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-72.1,-118.8,138.2,236);


(lib.PuppetShape_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.WarpedAsset_6("synched",0);
	this.instance.setTransform(0,0,1,1,0,0,0,-7,1.7);

	this.instance_1 = new lib.CachedBmp_65();
	this.instance_1.setTransform(-81.8,-104.2,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(750));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-81.8,-106,161.6,218.3);


(lib.play = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.text = new cjs.Text("PLAY", "96px 'Ravie'", "#E1E0D7");
	this.text.lineHeight = 130;
	this.text.lineWidth = 347;
	this.text.parent = this;
	this.text.setTransform(-191.55,-74.05);

	this.instance = new lib.Path();
	this.instance.setTransform(0.05,0,0.4277,0.3658,0,0,0,830.6,428.9);
	this.instance.alpha = 0.8008;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.play, new cjs.Rectangle(-355.2,-156.9,710.4,313.8), null);


(lib.handup = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.PuppetShape_54("synched",1,false);
	this.instance.setTransform(-38,172.75,1,1,6.9746);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-84.6,-146.9,169,274.4);


(lib.StaticIntro = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Body("synched",0);
	this.instance.setTransform(0.5,-110.55,1,1,0,0,0,95.7,155.8);

	this.instance_1 = new lib.PuppetShape_27copy("synched",1,false);
	this.instance_1.setTransform(9.15,145.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-95.2,-266.3,191.5,532.6);


(lib.Man = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Shirt
	this.instance = new lib.Body("synched",0);
	this.instance.setTransform(95.7,155.8,1,1,0,0,0,95.7,155.8);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(60));

	// Legs
	this.instance_1 = new lib.PuppetShape_3copy("synched",1,false);
	this.instance_1.setTransform(104.35,411.95);

	this.instance_2 = new lib.PuppetShape_4("synched",1,false);
	this.instance_2.setTransform(104.35,411.95);

	this.instance_3 = new lib.PuppetShape_5("synched",1,false);
	this.instance_3.setTransform(104.35,411.95);

	this.instance_4 = new lib.PuppetShape_6("synched",1,false);
	this.instance_4.setTransform(104.35,411.95);

	this.instance_5 = new lib.PuppetShape_7("synched",1,false);
	this.instance_5.setTransform(104.35,411.95);

	this.instance_6 = new lib.PuppetShape_8("synched",1,false);
	this.instance_6.setTransform(104.35,411.95);

	this.instance_7 = new lib.PuppetShape_9("synched",1,false);
	this.instance_7.setTransform(104.35,411.95);

	this.instance_8 = new lib.PuppetShape_10("synched",1,false);
	this.instance_8.setTransform(104.35,411.95);

	this.instance_9 = new lib.PuppetShape_11("synched",1,false);
	this.instance_9.setTransform(104.35,411.95);

	this.instance_10 = new lib.PuppetShape_12("synched",1,false);
	this.instance_10.setTransform(104.35,411.95);

	this.instance_11 = new lib.PuppetShape_13("synched",1,false);
	this.instance_11.setTransform(104.35,411.95);

	this.instance_12 = new lib.PuppetShape_14("synched",1,false);
	this.instance_12.setTransform(104.35,411.95);

	this.instance_13 = new lib.PuppetShape_15("synched",1,false);
	this.instance_13.setTransform(104.35,411.95);

	this.instance_14 = new lib.PuppetShape_16("synched",1,false);
	this.instance_14.setTransform(104.35,411.95);

	this.instance_15 = new lib.PuppetShape_17("synched",1,false);
	this.instance_15.setTransform(104.35,411.95);

	this.instance_16 = new lib.PuppetShape_18("synched",1,false);
	this.instance_16.setTransform(104.35,411.95);

	this.instance_17 = new lib.PuppetShape_19("synched",1,false);
	this.instance_17.setTransform(104.35,411.95);

	this.instance_18 = new lib.PuppetShape_20("synched",1,false);
	this.instance_18.setTransform(104.35,411.95);

	this.instance_19 = new lib.PuppetShape_21("synched",1,false);
	this.instance_19.setTransform(104.35,411.95);

	this.instance_20 = new lib.PuppetShape_22("synched",1,false);
	this.instance_20.setTransform(104.35,411.95);

	this.instance_21 = new lib.PuppetShape_23("synched",1,false);
	this.instance_21.setTransform(104.35,411.95);

	this.instance_22 = new lib.PuppetShape_24("synched",1,false);
	this.instance_22.setTransform(104.35,411.95);

	this.instance_23 = new lib.PuppetShape_25("synched",1,false);
	this.instance_23.setTransform(104.35,411.95);

	this.instance_24 = new lib.PuppetShape_26("synched",1,false);
	this.instance_24.setTransform(104.35,411.95);

	this.instance_25 = new lib.PuppetShape_27("synched",1,false);
	this.instance_25.setTransform(104.35,411.95);

	this.instance_26 = new lib.PuppetShape_2("synched",1,false);
	this.instance_26.setTransform(104.35,411.95);

	this.instance_27 = new lib.PuppetShape_3("synched",1,false);
	this.instance_27.setTransform(104.35,411.95);

	this.instance_28 = new lib.PuppetShape_28("synched",1,false);
	this.instance_28.setTransform(104.35,411.95);

	this.instance_29 = new lib.PuppetShape_29("synched",1,false);
	this.instance_29.setTransform(104.35,411.95);

	this.instance_30 = new lib.PuppetShape_30("synched",1,false);
	this.instance_30.setTransform(104.35,411.95);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1}]}).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},2).to({state:[{t:this.instance_4}]},2).to({state:[{t:this.instance_5}]},2).to({state:[{t:this.instance_6}]},2).to({state:[{t:this.instance_7}]},2).to({state:[{t:this.instance_8}]},2).to({state:[{t:this.instance_9}]},2).to({state:[{t:this.instance_10}]},2).to({state:[{t:this.instance_11}]},2).to({state:[{t:this.instance_12}]},2).to({state:[{t:this.instance_13}]},2).to({state:[{t:this.instance_14}]},2).to({state:[{t:this.instance_15}]},2).to({state:[{t:this.instance_16}]},2).to({state:[{t:this.instance_17}]},2).to({state:[{t:this.instance_18}]},2).to({state:[{t:this.instance_19}]},2).to({state:[{t:this.instance_20}]},2).to({state:[{t:this.instance_21}]},2).to({state:[{t:this.instance_22}]},2).to({state:[{t:this.instance_23}]},2).to({state:[{t:this.instance_24}]},2).to({state:[{t:this.instance_25}]},2).to({state:[{t:this.instance_26}]},2).to({state:[{t:this.instance_27}]},2).to({state:[{t:this.instance_28}]},2).to({state:[{t:this.instance_29}]},2).to({state:[{t:this.instance_30}]},2).wait(3));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,191.5,532.7);


(lib.backview = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.MonaLisaEntranceLeo("synched",0);
	this.instance.setTransform(659.95,606.5,2.5656,1.6728,0,0,0,1.1,0.2);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(479.9,200.4,348.5,811.5);


(lib.Walking_Camera_View = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.PuppetShape_31("synched",1,false);
	this.instance.setTransform(36.9,138.4,0.2828,0.2828,0,0,0,130.5,489.4);

	this.instance_1 = new lib.PuppetShape_32("synched",1,false);
	this.instance_1.setTransform(36.9,138.4,0.2828,0.2828,0,0,0,130.5,489.4);

	this.instance_2 = new lib.PuppetShape_33("synched",1,false);
	this.instance_2.setTransform(36.9,138.4,0.2828,0.2828,0,0,0,130.5,489.4);

	this.instance_3 = new lib.PuppetShape_34("synched",1,false);
	this.instance_3.setTransform(36.9,138.4,0.2828,0.2828,0,0,0,130.5,489.4);

	this.instance_4 = new lib.PuppetShape_35("synched",1,false);
	this.instance_4.setTransform(36.9,138.4,0.2828,0.2828,0,0,0,130.5,489.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},4).to({state:[{t:this.instance_2}]},4).to({state:[{t:this.instance_3}]},4).to({state:[{t:this.instance_4}]},4).wait(3));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.5,-1,75.2,277.6);


(lib.Leo_walking_Side = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Side_View_Leo("synched",0);
	this.instance.setTransform(-0.05,0.2,2.0931,2.0931,0,0,0,0,0.1);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regY:0,rotation:0.2778,x:-0.049,y:0},0).wait(1).to({rotation:0.5556,x:-0.048},0).wait(1).to({rotation:0.8335,x:-0.047},0).wait(1).to({rotation:1.1113,x:-0.0459},0).wait(1).to({rotation:1.3891,x:-0.0449,y:0.0001},0).wait(1).to({rotation:1.6669,x:-0.0439},0).wait(1).to({rotation:1.9447,x:-0.0429},0).wait(1).to({rotation:2.2225,x:-0.0419,y:0.0002},0).wait(1).to({rotation:2.5004,x:-0.0409},0).wait(1).to({rotation:2.7782,x:-0.0399},0).wait(1).to({rotation:3.056,x:-0.0388,y:0.0003},0).wait(1).to({rotation:3.3338,x:-0.0378,y:0.0004},0).wait(1).to({rotation:3.6116,x:-0.0368},0).wait(1).to({rotation:3.8894,x:-0.0358,y:0.0005},0).wait(1).to({rotation:4.1673,x:-0.0348,y:0.0006},0).wait(1).to({rotation:3.8872,x:-0.0358,y:0.0005},0).wait(1).to({rotation:3.6071,x:-0.0368,y:0.0004},0).wait(1).to({rotation:3.327,x:-0.0379},0).wait(1).to({rotation:3.0469,x:-0.0389,y:0.0003},0).wait(1).to({rotation:2.7669,x:-0.0399,y:0.0002},0).wait(1).to({rotation:2.4868,x:-0.0409},0).wait(1).to({rotation:2.2067,x:-0.0419},0).wait(1).to({rotation:1.9266,x:-0.043,y:0.0001},0).wait(1).to({rotation:1.6465,x:-0.044},0).wait(1).to({rotation:1.3665,x:-0.045},0).wait(1).to({rotation:1.0864,x:-0.046,y:0},0).wait(1).to({rotation:0.8063,x:-0.0471},0).wait(1).to({rotation:0.5262,x:-0.0481},0).wait(1).to({rotation:0.2461,x:-0.0491},0).wait(1).to({rotation:-0.0339,x:-0.0501},0).wait(1).to({rotation:-0.0339},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-106,-408.8,212.4,818);


(lib.CloudsGroup = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.singlecloud("synched",0);
	this.instance.setTransform(684.55,181.9,0.5951,0.5951,0,0,180,-0.1,0);

	this.instance_1 = new lib.singlecloud("synched",0);
	this.instance_1.setTransform(1718.15,265.2,0.6704,0.6704,0,0,180);

	this.instance_2 = new lib.singlecloud("synched",0);
	this.instance_2.setTransform(1383.25,164.8,1.1578,1.1578);

	this.instance_3 = new lib.singlecloud("synched",0);
	this.instance_3.setTransform(303.3,199.6,1.1578,1.1578);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.CloudsGroup, new cjs.Rectangle(0.1,0,1893.6000000000001,364.3), null);


(lib.Scene_1_Side_View_Man = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Side_View_Man
	this.instance = new lib.Leo_walking_Side();
	this.instance.setTransform(180.1,740);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(120).to({_off:false},0).wait(1).to({regX:0.1,regY:0.1,x:181.8,y:740.1},0).wait(1).to({x:183.45},0).wait(1).to({x:185.1},0).wait(1).to({x:186.75},0).wait(1).to({x:188.4},0).wait(1).to({x:190.05},0).wait(1).to({x:191.7},0).wait(1).to({x:193.35},0).wait(1).to({x:195},0).wait(1).to({x:196.65},0).wait(1).to({x:198.3},0).wait(1).to({x:199.95},0).wait(1).to({x:201.6},0).wait(1).to({x:203.25},0).wait(1).to({x:204.9},0).wait(1).to({x:206.55},0).wait(1).to({x:208.2},0).wait(1).to({x:209.85},0).wait(1).to({x:211.5},0).wait(1).to({x:213.15},0).wait(1).to({x:214.8},0).wait(1).to({x:216.45},0).wait(1).to({x:218.1},0).wait(1).to({x:219.75},0).wait(1).to({x:221.4},0).wait(1).to({x:223},0).wait(1).to({x:224.65},0).wait(1).to({x:226.3},0).wait(1).to({x:227.95},0).wait(1).to({x:229.6},0).wait(1).to({x:231.25},0).wait(1).to({x:232.9},0).wait(1).to({x:234.55},0).wait(1).to({x:236.2},0).wait(1).to({x:237.85},0).wait(1).to({x:239.5},0).wait(1).to({x:241.15},0).wait(1).to({x:242.8},0).wait(1).to({x:244.45},0).wait(1).to({x:246.1},0).wait(1).to({x:247.75},0).wait(1).to({x:249.4},0).wait(1).to({x:251.05},0).wait(1).to({x:252.7},0).wait(1).to({x:254.35},0).wait(1).to({x:256},0).wait(1).to({x:257.65},0).wait(1).to({x:259.3},0).wait(1).to({x:260.95},0).wait(1).to({x:262.6},0).wait(1).to({x:264.2},0).wait(1).to({x:265.85},0).wait(1).to({x:267.5},0).wait(1).to({x:269.15},0).wait(1).to({x:270.8},0).wait(1).to({x:272.45},0).wait(1).to({x:274.1},0).wait(1).to({x:275.75},0).wait(1).to({x:277.4},0).wait(1).to({x:279.05},0).wait(1).to({x:280.7},0).wait(1).to({x:282.35},0).wait(1).to({x:284},0).wait(1).to({x:285.65},0).wait(1).to({x:287.3},0).wait(1).to({x:288.95},0).wait(1).to({x:290.6},0).wait(1).to({x:292.25},0).wait(1).to({x:293.9},0).wait(1).to({x:295.55},0).wait(1).to({x:297.2},0).wait(1).to({x:298.85},0).wait(1).to({x:300.5},0).wait(1).to({x:302.15},0).wait(1).to({x:303.8},0).wait(1).to({x:305.45},0).wait(1).to({x:307.05},0).wait(1).to({x:308.7},0).wait(1).to({x:310.35},0).wait(1).to({x:312},0).wait(1).to({x:313.65},0).wait(1).to({x:315.3},0).wait(1).to({x:316.95},0).wait(1).to({x:318.6},0).wait(1).to({x:320.25},0).wait(1).to({x:321.9},0).wait(1).to({x:323.55},0).wait(1).to({x:325.2},0).wait(1).to({x:326.85},0).wait(1).to({x:328.5},0).wait(1).to({x:330.15},0).wait(1).to({x:331.8},0).wait(1).to({x:333.45},0).wait(1).to({x:335.1},0).wait(1).to({x:336.75},0).wait(1).to({x:338.4},0).wait(1).to({x:340.05},0).wait(1).to({x:341.7},0).wait(1).to({x:343.35},0).wait(1).to({x:345},0).wait(1).to({x:346.65},0).wait(1).to({x:348.25},0).wait(1).to({x:349.9},0).wait(1).to({x:351.55},0).wait(1).to({x:353.2},0).wait(1).to({x:354.85},0).wait(1).to({x:356.5},0).wait(1).to({x:358.15},0).wait(1).to({x:359.8},0).wait(1).to({x:361.45},0).wait(1).to({x:363.1},0).wait(1).to({x:364.75},0).wait(1).to({x:366.4},0).wait(1).to({x:368.05},0).wait(1).to({x:369.7},0).wait(1).to({x:371.35},0).wait(1).to({x:373},0).wait(1).to({x:374.65},0).wait(1).to({x:376.3},0).wait(1).to({x:377.95},0).wait(1).to({x:379.6},0).wait(1).to({x:381.25},0).wait(1).to({x:382.9},0).wait(1).to({x:384.55},0).wait(1).to({x:386.2},0).wait(1).to({x:387.85},0).wait(1).to({x:389.5},0).to({_off:true},1).wait(79));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Leo = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Leo
	this.instance = new lib.StaticIntro("synched",0);
	this.instance.setTransform(701.15,441.15,1,1,0,0,0,0.5,0);

	this.instance_1 = new lib.Man();
	this.instance_1.setTransform(654.85,477,1,1,0,0,0,57.2,302.2);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance_1}]},15).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(16).to({_off:false},0).wait(1).to({regX:95.8,regY:266.3,scaleX:0.9922,scaleY:0.9922,x:691.15,y:442.65},0).wait(1).to({scaleX:0.9843,scaleY:0.9843,x:688.9,y:444.25},0).wait(1).to({scaleX:0.9765,scaleY:0.9765,x:686.65,y:445.9},0).wait(1).to({scaleX:0.9686,scaleY:0.9686,x:684.35,y:447.5},0).wait(1).to({scaleX:0.9608,scaleY:0.9608,x:682.1,y:449.1},0).wait(1).to({scaleX:0.9529,scaleY:0.9529,x:679.85,y:450.7},0).wait(1).to({scaleX:0.9451,scaleY:0.9451,x:677.55,y:452.35},0).wait(1).to({scaleX:0.9372,scaleY:0.9372,x:675.3,y:453.95},0).wait(1).to({scaleX:0.9294,scaleY:0.9294,x:673.05,y:455.5},0).wait(1).to({scaleX:0.9216,scaleY:0.9216,x:670.75,y:457.1},0).wait(1).to({scaleX:0.9137,scaleY:0.9137,x:668.5,y:458.7},0).wait(1).to({scaleX:0.9059,scaleY:0.9059,x:666.25,y:460.35},0).wait(1).to({scaleX:0.898,scaleY:0.898,x:664,y:461.95},0).wait(1).to({scaleX:0.8902,scaleY:0.8902,x:661.7,y:463.55},0).wait(1).to({scaleX:0.8823,scaleY:0.8823,x:659.45,y:465.15},0).wait(1).to({scaleX:0.8745,scaleY:0.8745,x:657.2,y:466.8},0).wait(1).to({scaleX:0.8667,scaleY:0.8667,x:654.9,y:468.35},0).wait(1).to({scaleX:0.8588,scaleY:0.8588,x:652.6,y:469.95},0).wait(1).to({scaleX:0.851,scaleY:0.851,x:650.35,y:471.55},0).wait(1).to({scaleX:0.8431,scaleY:0.8431,x:648.05,y:473.15},0).wait(1).to({scaleX:0.8353,scaleY:0.8353,x:645.8,y:474.8},0).wait(1).to({scaleX:0.8274,scaleY:0.8274,x:643.55,y:476.4},0).wait(1).to({scaleX:0.8196,scaleY:0.8196,x:641.3,y:478},0).wait(1).to({scaleX:0.8117,scaleY:0.8117,x:639,y:479.6},0).wait(1).to({scaleX:0.8039,scaleY:0.8039,x:636.75,y:481.2},0).wait(1).to({scaleX:0.7961,scaleY:0.7961,x:634.5,y:482.8},0).wait(1).to({scaleX:0.7882,scaleY:0.7882,x:632.2,y:484.4},0).wait(1).to({scaleX:0.7804,scaleY:0.7804,x:629.95,y:486},0).wait(1).to({scaleX:0.7725,scaleY:0.7725,x:627.7,y:487.6},0).wait(1).to({scaleX:0.7647,scaleY:0.7647,x:625.4,y:489.25},0).wait(1).to({scaleX:0.7568,scaleY:0.7568,x:623.15,y:490.85},0).wait(1).to({scaleX:0.749,scaleY:0.749,x:620.9,y:492.45},0).wait(1).to({scaleX:0.7412,scaleY:0.7412,x:618.65,y:494},0).wait(1).to({scaleX:0.7333,scaleY:0.7333,x:616.35,y:495.65},0).wait(1).to({scaleX:0.7255,scaleY:0.7255,x:614.1,y:497.25},0).wait(1).to({scaleX:0.7176,scaleY:0.7176,x:611.85,y:498.85},0).wait(1).to({scaleX:0.7098,scaleY:0.7098,x:609.55,y:500.45},0).wait(1).to({scaleX:0.7019,scaleY:0.7019,x:607.3,y:502.05},0).wait(1).to({scaleX:0.6941,scaleY:0.6941,x:605.05,y:503.7},0).wait(1).to({scaleX:0.6862,scaleY:0.6862,x:602.75,y:505.3},0).wait(1).to({scaleX:0.6784,scaleY:0.6784,x:600.5,y:506.85},0).wait(1).to({scaleX:0.6706,scaleY:0.6706,x:598.25,y:508.45},0).wait(1).to({scaleX:0.6627,scaleY:0.6627,x:596,y:510.1},0).wait(1).to({scaleX:0.6549,scaleY:0.6549,x:593.7,y:511.7},0).wait(1).to({scaleX:0.647,scaleY:0.647,x:591.45,y:513.3},0).wait(1).to({scaleX:0.6392,scaleY:0.6392,x:589.2,y:514.9},0).wait(1).to({scaleX:0.6313,scaleY:0.6313,x:586.9,y:516.5},0).wait(1).to({scaleX:0.6235,scaleY:0.6235,x:584.65,y:518.15},0).wait(1).to({scaleX:0.6156,scaleY:0.6156,x:582.4,y:519.7},0).wait(1).to({scaleX:0.6078,scaleY:0.6078,x:580.1,y:521.3},0).wait(1).to({scaleX:0.6,scaleY:0.6,x:577.85,y:522.9},0).wait(1).to({scaleX:0.5921,scaleY:0.5921,x:575.55,y:524.55},0).wait(1).to({scaleX:0.5843,scaleY:0.5843,x:573.3,y:526.15},0).wait(1).to({scaleX:0.5764,scaleY:0.5764,x:571,y:527.75},0).wait(1).to({scaleX:0.5686,scaleY:0.5686,x:568.75,y:529.35},0).wait(1).to({scaleX:0.5607,scaleY:0.5607,x:566.5,y:530.95},0).wait(1).to({scaleX:0.5529,scaleY:0.5529,x:564.2,y:532.6},0).wait(1).to({scaleX:0.5451,scaleY:0.5451,x:561.95,y:534.15},0).wait(1).to({scaleX:0.5372,scaleY:0.5372,x:559.7,y:535.75},0).wait(1).to({scaleX:0.5294,scaleY:0.5294,x:557.4,y:537.35},0).wait(1).to({scaleX:0.5215,scaleY:0.5215,x:555.15,y:539},0).wait(1).to({scaleX:0.5137,scaleY:0.5137,x:552.9,y:540.6},0).wait(1).to({scaleX:0.5058,scaleY:0.5058,x:550.65,y:542.2},0).wait(1).to({scaleX:0.498,scaleY:0.498,x:548.35,y:543.8},0).wait(1).to({scaleX:0.4901,scaleY:0.4901,x:546.1,y:545.45},0).wait(1).to({scaleX:0.4823,scaleY:0.4823,x:543.85,y:547},0).wait(1).to({scaleX:0.4745,scaleY:0.4745,x:541.55,y:548.6},0).wait(1).to({scaleX:0.4666,scaleY:0.4666,x:539.3,y:550.2},0).wait(1).to({scaleX:0.4588,scaleY:0.4588,x:537.05,y:551.8},0).wait(1).to({scaleX:0.4509,scaleY:0.4509,x:534.75,y:553.45},0).wait(1).to({scaleX:0.4431,scaleY:0.4431,x:532.5,y:555.05},0).wait(1).to({scaleX:0.4352,scaleY:0.4352,x:530.25,y:556.65},0).wait(1).to({scaleX:0.4274,scaleY:0.4274,x:528,y:558.25},0).wait(1).to({scaleX:0.4196,scaleY:0.4196,x:525.7,y:559.8},0).wait(1).to({scaleX:0.4117,scaleY:0.4117,x:523.45,y:561.45},0).wait(1).to({scaleX:0.4039,scaleY:0.4039,x:521.2,y:563.05},0).wait(1).to({scaleX:0.396,scaleY:0.396,x:518.9,y:564.65},0).wait(1).to({scaleX:0.3882,scaleY:0.3882,x:516.65,y:566.25},0).wait(1).to({scaleX:0.3803,scaleY:0.3803,x:514.4,y:567.9},0).wait(1).to({scaleX:0.3725,scaleY:0.3725,x:512.1,y:569.5},0).wait(1).to({scaleX:0.3646,scaleY:0.3646,x:509.85,y:571.1},0).wait(1).to({scaleX:0.3568,scaleY:0.3568,x:507.6,y:572.65},0).wait(1).to({scaleX:0.349,scaleY:0.349,x:505.35,y:574.3},0).wait(1).to({scaleX:0.3411,scaleY:0.3411,x:503.05,y:575.9},0).wait(1).to({scaleX:0.3333,scaleY:0.3333,x:500.8,y:577.5},0).wait(1).to({scaleX:0.3254,scaleY:0.3254,x:498.5,y:579.1},0).wait(1).to({scaleX:0.3233,scaleY:0.3233,x:497.6,y:577.25},0).wait(1).to({scaleX:0.3213,scaleY:0.3213,x:496.65,y:575.4},0).wait(1).to({scaleX:0.3192,scaleY:0.3192,x:495.7,y:573.55},0).wait(1).to({scaleX:0.3171,scaleY:0.3171,x:494.75,y:571.7},0).wait(1).to({scaleX:0.315,scaleY:0.315,x:493.8,y:569.85},0).wait(1).to({scaleX:0.313,scaleY:0.313,x:492.9,y:568.05},0).wait(1).to({scaleX:0.3109,scaleY:0.3109,x:491.95,y:566.2},0).wait(1).to({scaleX:0.3088,scaleY:0.3088,x:491,y:564.35},0).wait(1).to({scaleX:0.3067,scaleY:0.3067,x:490.05,y:562.45},0).wait(1).to({scaleX:0.3046,scaleY:0.3046,x:489.1,y:560.6},0).wait(1).to({scaleX:0.3026,scaleY:0.3026,x:488.15,y:558.75},0).wait(1).to({scaleX:0.3005,scaleY:0.3005,x:487.25,y:556.9},0).wait(1).to({scaleX:0.2984,scaleY:0.2984,x:486.3,y:555.05},0).wait(1).to({scaleX:0.2963,scaleY:0.2963,x:485.35,y:553.2},0).wait(1).to({scaleX:0.2942,scaleY:0.2942,x:484.4,y:551.35},0).wait(1).to({scaleX:0.2922,scaleY:0.2922,x:483.45,y:549.5},0).wait(1).to({scaleX:0.2901,scaleY:0.2901,x:482.5,y:547.7},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Hand_ = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Hand_
	this.instance = new lib.PuppetShape_1("synched",1,false);
	this.instance.setTransform(755.6,542.6);

	this.instance_1 = new lib.PuppetShape_36("synched",1,false);
	this.instance_1.setTransform(755.55,539.45);

	this.instance_2 = new lib.PuppetShape_37("synched",1,false);
	this.instance_2.setTransform(754.85,539.1);

	this.instance_3 = new lib.PuppetShape_38("synched",1,false);
	this.instance_3.setTransform(754.8,537.9);

	this.instance_4 = new lib.PuppetShape_39("synched",1,false);
	this.instance_4.setTransform(754.4,539.05);

	this.instance_5 = new lib.PuppetShape_40("synched",1,false);
	this.instance_5.setTransform(753.25,537.85);

	this.instance_6 = new lib.PuppetShape_41("synched",1,false);
	this.instance_6.setTransform(754.7,541.05);

	this.instance_7 = new lib.PuppetShape_42("synched",1,false);
	this.instance_7.setTransform(752.85,537.1);

	this.instance_8 = new lib.PuppetShape_43("synched",1,false);
	this.instance_8.setTransform(752.45,539);

	this.instance_9 = new lib.PuppetShape_44("synched",1,false);
	this.instance_9.setTransform(751.65,538.25);

	this.instance_10 = new lib.PuppetShape_45("synched",1,false);
	this.instance_10.setTransform(751.3,537.1);

	this.instance_11 = new lib.PuppetShape_46("synched",1,false);
	this.instance_11.setTransform(750.15,536.7);

	this.instance_12 = new lib.PuppetShape_47("synched",1,false);
	this.instance_12.setTransform(750.15,536.7);

	this.instance_13 = new lib.PuppetShape_48("synched",1,false);
	this.instance_13.setTransform(750.15,536.7);

	this.instance_14 = new lib.PuppetShape_49("synched",1,false);
	this.instance_14.setTransform(750.15,536.7);

	this.instance_15 = new lib.PuppetShape_50("synched",1,false);
	this.instance_15.setTransform(750.15,536.7);

	this.instance_16 = new lib.handup("synched",0);
	this.instance_16.setTransform(794.1,450.85,1,1,0,0,0,-0.4,17.8);
	this.instance_16._off = true;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},390).to({state:[{t:this.instance_1}]},3).to({state:[{t:this.instance_2}]},3).to({state:[{t:this.instance_3}]},3).to({state:[{t:this.instance_4}]},3).to({state:[{t:this.instance_5}]},3).to({state:[{t:this.instance_6}]},3).to({state:[{t:this.instance_7}]},3).to({state:[{t:this.instance_8}]},3).to({state:[{t:this.instance_9}]},3).to({state:[{t:this.instance_10}]},3).to({state:[{t:this.instance_11}]},3).to({state:[{t:this.instance_12}]},3).to({state:[{t:this.instance_13}]},3).to({state:[{t:this.instance_14}]},3).to({state:[{t:this.instance_15}]},3).to({state:[{t:this.instance_16}]},28).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).to({state:[{t:this.instance_16}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance_16).wait(463).to({_off:false},0).wait(1).to({regX:-19.3,regY:69,x:775.15,y:500.95},0).wait(1).to({x:775.1,y:499.9},0).wait(1).to({x:775.05,y:498.85},0).wait(1).to({x:775,y:497.8},0).wait(1).to({y:496.75},0).wait(1).to({x:774.95,y:495.7},0).wait(1).to({x:774.9,y:494.65},0).wait(1).to({x:774.85,y:493.6},0).wait(1).to({y:492.55},0).wait(1).to({x:774.8,y:491.5},0).wait(1).to({x:774.75,y:490.45},0).wait(1).to({x:774.7,y:489.4},0).wait(1).to({x:774.65,y:488.35},0).wait(1).to({y:487.3},0).wait(1).to({x:774.6,y:486.25},0).wait(1).to({x:774.55,y:485.2},0).wait(1).to({x:774.5,y:484.15},0).wait(1).to({y:483.1},0).wait(1).to({x:774.45,y:482.05},0).wait(1).to({x:774.4,y:481},0).wait(1).to({x:774.35,y:479.95},0).wait(1).to({x:774.3,y:478.9},0).wait(1).to({y:477.85},0).wait(1).to({x:774.25,y:476.8},0).wait(1).to({x:774.2,y:475.7},0).wait(1).to({x:774.15,y:474.65},0).wait(1).to({y:473.6},0).wait(1).to({x:774.1,y:472.55},0).wait(1).to({x:774.05,y:471.5},0).wait(1).to({x:774,y:470.45},0).wait(1).to({x:773.95,y:469.4},0).wait(1).to({y:468.35},0).wait(1).to({x:773.9,y:467.3},0).wait(1).to({x:773.85,y:466.25},0).wait(1).to({x:773.8,y:465.2},0).wait(1).to({y:464.15},0).wait(1).to({x:773.75,y:463.1},0).wait(1).to({x:773.7,y:462.05},0).wait(1).to({x:773.65,y:461},0).wait(1).to({x:773.6,y:459.95},0).wait(1).to({y:458.9},0).wait(1).to({x:773.55,y:457.85},0).wait(1).to({x:773.5,y:456.8},0).wait(1).to({x:773.45,y:455.75},0).wait(1).to({y:454.7},0).wait(1).to({x:773.4,y:453.65},0).wait(1).to({x:773.35,y:452.6},0).wait(1).to({x:773.3,y:451.55},0).wait(1).to({x:773.25,y:450.5},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Drawing = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Drawing
	this.instance = new lib.MonaLisaEntranceLeo("synched",0);
	this.instance.setTransform(664.5,1458,8.1141,5.5872,0,0,0,1.2,1);
	this.instance._off = true;

	this.instance_1 = new lib.backview("synched",0);
	this.instance_1.setTransform(657.3,605.3,1,1,0,0,0,657.2,606.1);

	this.instance_2 = new lib.CachedBmp_1();
	this.instance_2.setTransform(477.45,199.75,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},316).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).wait(123));
	this.timeline.addTween(cjs.Tween.get(this.instance).wait(316).to({_off:false},0).wait(1).to({regX:-1.2,regY:0,scaleX:8.037,scaleY:5.5329,rotation:0.0515,x:645.1,y:1440.6},0).wait(1).to({scaleX:7.96,scaleY:5.4785,rotation:0.103,x:645.25,y:1428.8},0).wait(1).to({scaleX:7.883,scaleY:5.4242,rotation:0.1546,x:645.4,y:1416.95},0).wait(1).to({scaleX:7.8059,scaleY:5.3698,rotation:0.2061,x:645.5,y:1405.2},0).wait(1).to({scaleX:7.729,scaleY:5.3155,rotation:0.2576,x:645.65,y:1393.4},0).wait(1).to({scaleX:7.6519,scaleY:5.2611,rotation:0.3091,x:645.75,y:1381.6},0).wait(1).to({scaleX:7.5749,scaleY:5.2068,rotation:0.3606,x:645.9,y:1369.85},0).wait(1).to({scaleX:7.4978,scaleY:5.1524,rotation:0.4122,x:646,y:1358.05},0).wait(1).to({scaleX:7.4208,scaleY:5.0981,rotation:0.4637,x:646.15,y:1346.25},0).wait(1).to({scaleX:7.3437,scaleY:5.0437,rotation:0.5152,x:646.3,y:1334.45},0).wait(1).to({scaleX:7.2667,scaleY:4.9893,rotation:0.5667,x:646.4,y:1322.65},0).wait(1).to({scaleX:7.1896,scaleY:4.9349,rotation:0.6182,x:646.5,y:1310.85},0).wait(1).to({scaleX:7.1124,scaleY:4.8805,rotation:0.6698,x:646.65,y:1299.1},0).wait(1).to({scaleX:7.0354,scaleY:4.8262,rotation:0.7213,x:646.8,y:1287.3},0).wait(1).to({scaleX:6.9583,scaleY:4.7717,rotation:0.7728,x:646.9,y:1275.55},0).wait(1).to({scaleX:6.8813,scaleY:4.7175,rotation:0.6822,x:647.05,y:1263.75},0).wait(1).to({scaleX:6.8043,scaleY:4.6631,rotation:0.5915,x:647.15,y:1252},0).wait(1).to({scaleX:6.7272,scaleY:4.6087,rotation:0.5009,x:647.3,y:1240.3},0).wait(1).to({scaleX:6.6502,scaleY:4.5544,rotation:0.4102,x:647.35,y:1228.5},0).wait(1).to({scaleX:6.5731,scaleY:4.5,rotation:0.3196,x:647.5,y:1216.75},0).wait(1).to({scaleX:6.4961,scaleY:4.4456,rotation:0.2289,x:647.6,y:1205},0).wait(1).to({scaleX:6.4189,scaleY:4.3912,rotation:0.1383,x:647.75,y:1193.3},0).wait(1).to({scaleX:6.3418,scaleY:4.3368,rotation:0.0476,x:647.85,y:1181.5},0).wait(1).to({scaleX:6.2647,scaleY:4.2824,rotation:-0.043,x:648,y:1169.75},0).wait(1).to({scaleX:6.1878,scaleY:4.2281,rotation:-0.1337,x:648.05,y:1158},0).wait(1).to({scaleX:6.1108,scaleY:4.1738,rotation:-0.2243,x:648.2,y:1146.25},0).wait(1).to({scaleX:6.0337,scaleY:4.1194,rotation:-0.3149,x:648.3,y:1134.5},0).wait(1).to({scaleX:5.9566,scaleY:4.0651,rotation:-0.4056,x:648.45,y:1122.75},0).wait(1).to({scaleX:5.8796,scaleY:4.0107,rotation:-0.4962,x:648.55,y:1111},0).wait(1).to({scaleX:5.8025,scaleY:3.9563,rotation:-0.5869,x:648.7,y:1099.2},0).wait(1).to({scaleX:5.7255,scaleY:3.902,rotation:-0.6775,x:648.8,y:1087.5},0).wait(1).to({scaleX:5.6484,scaleY:3.8476,rotation:-0.6051,x:648.9,y:1075.65},0).wait(1).to({scaleX:5.5713,scaleY:3.7932,rotation:-0.5327,x:649.05,y:1063.85},0).wait(1).to({scaleX:5.4943,scaleY:3.7389,rotation:-0.4602,x:649.15,y:1052.1},0).wait(1).to({scaleX:5.4172,scaleY:3.6845,rotation:-0.3878,x:649.3,y:1040.3},0).wait(1).to({scaleX:5.3401,scaleY:3.6301,rotation:-0.3154,x:649.45,y:1028.5},0).wait(1).to({scaleX:5.2631,scaleY:3.5758,rotation:-0.2429,x:649.6,y:1016.75},0).wait(1).to({scaleX:5.186,scaleY:3.5214,rotation:-0.1705,x:649.7,y:1004.9},0).wait(1).to({scaleX:5.1089,scaleY:3.4669,rotation:-0.0981,x:649.8,y:993.1},0).wait(1).to({scaleX:5.0318,scaleY:3.4126,rotation:-0.0257,x:649.95,y:981.35},0).wait(1).to({scaleX:4.9548,scaleY:3.3582,rotation:0.0468,x:650.1,y:969.55},0).wait(1).to({scaleX:4.8778,scaleY:3.3039,rotation:0.1192,x:650.2,y:957.75},0).wait(1).to({scaleX:4.8007,scaleY:3.2495,rotation:0.1916,x:650.35,y:946},0).wait(1).to({scaleX:4.7237,scaleY:3.1952,rotation:0.2641,x:650.5,y:934.15},0).wait(1).to({scaleX:4.6467,scaleY:3.1408,rotation:0.3365,x:650.55,y:922.35},0).wait(1).to({scaleX:4.5696,scaleY:3.0865,rotation:0.4089,x:650.7,y:910.6},0).wait(1).to({scaleX:4.4925,scaleY:3.0321,rotation:0.4813,x:650.85,y:898.8},0).wait(1).to({scaleX:4.4154,scaleY:2.9777,rotation:0.5538,x:650.95,y:887},0).wait(1).to({scaleX:4.3384,scaleY:2.9233,rotation:0.6262,x:651.1,y:875.25},0).wait(1).to({scaleX:4.2613,scaleY:2.869,rotation:0.6986,x:651.25,y:863.45},0).wait(1).to({scaleX:4.1842,scaleY:2.8146,rotation:0.7711,x:651.4,y:851.7},0).wait(1).to({scaleX:4.1072,scaleY:2.7602,rotation:0.7343,x:651.45,y:839.9},0).wait(1).to({scaleX:4.0301,scaleY:2.7059,rotation:0.6976,x:651.6,y:828.15},0).wait(1).to({scaleX:3.9531,scaleY:2.6515,rotation:0.6609,x:651.7,y:816.35},0).wait(1).to({scaleX:3.876,scaleY:2.5971,rotation:0.6242,x:651.85,y:804.6},0).wait(1).to({scaleX:3.799,scaleY:2.5428,rotation:0.5875,x:651.95,y:792.8},0).wait(1).to({scaleX:3.7219,scaleY:2.4884,rotation:0.5508,x:652.1,y:781.05},0).wait(1).to({scaleX:3.6449,scaleY:2.434,rotation:0.514,x:652.25,y:769.25},0).wait(1).to({scaleX:3.5678,scaleY:2.3797,rotation:0.4773,x:652.3,y:757.5},0).wait(1).to({scaleX:3.4907,scaleY:2.3253,rotation:0.4406,x:652.45,y:745.75},0).wait(1).to({scaleX:3.4137,scaleY:2.2709,rotation:0.4039,x:652.55,y:733.95},0).wait(1).to({scaleX:3.3366,scaleY:2.2166,rotation:0.3672,x:652.7,y:722.2},0).wait(1).to({scaleX:3.2595,scaleY:2.1622,rotation:0.3305,x:652.85,y:710.45},0).wait(1).to({scaleX:3.1825,scaleY:2.1078,rotation:0.2937,x:652.95,y:698.7},0).wait(1).to({scaleX:3.1055,scaleY:2.0535,rotation:0.257,x:653.05,y:686.9},0).wait(1).to({scaleX:3.0284,scaleY:1.9991,rotation:0.2203,x:653.15,y:675.15},0).wait(1).to({scaleX:2.9513,scaleY:1.9447,rotation:0.1836,x:653.3,y:663.35},0).wait(1).to({scaleX:2.8743,scaleY:1.8904,rotation:0.1469,x:653.45,y:651.6},0).wait(1).to({scaleX:2.7972,scaleY:1.836,rotation:0.1102,x:653.55,y:639.8},0).wait(1).to({scaleX:2.7201,scaleY:1.7816,rotation:0.0734,x:653.7,y:628.05},0).wait(1).to({scaleX:2.643,scaleY:1.7272,rotation:0.0367,x:653.8,y:616.25},0).wait(1).to({scaleX:2.566,scaleY:1.6729,rotation:0,x:653.9,y:604.5},0).to({_off:true},1).wait(124));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_Camera_View_Man = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Camera_View_Man
	this.instance = new lib.Walking_Camera_View("synched",0);
	this.instance.setTransform(512.9,499.4,1,1,0,0,0,36.9,138.4);
	this.instance.alpha = 0.6914;
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(248).to({_off:false},0).wait(1).to({regX:37.1,regY:137.9,x:516.95,y:497.15,alpha:0.69,startPosition:1},0).wait(1).to({x:520.85,y:495.45,startPosition:2},0).wait(1).to({x:524.75,y:493.75,startPosition:3},0).wait(1).to({x:528.65,y:492.05,startPosition:4},0).wait(1).to({x:532.55,y:490.3,startPosition:5},0).wait(1).to({x:536.45,y:488.6,startPosition:6},0).wait(1).to({x:540.35,y:486.9,startPosition:7},0).wait(1).to({x:544.2,y:485.2,startPosition:8},0).wait(1).to({x:548.1,y:483.45,startPosition:9},0).wait(1).to({x:552,y:481.75,startPosition:10},0).wait(1).to({x:555.9,y:480.05,startPosition:11},0).wait(1).to({x:559.8,y:478.35,startPosition:12},0).wait(1).to({x:563.7,y:476.65,startPosition:13},0).wait(1).to({x:567.6,y:474.9,startPosition:14},0).wait(1).to({x:571.45,y:473.2,startPosition:15},0).wait(1).to({x:575.35,y:471.5,startPosition:16},0).wait(1).to({x:579.25,y:469.8,startPosition:17},0).wait(1).to({x:583.15,y:468.05,startPosition:18},0).wait(1).to({x:587.05,y:466.35,startPosition:0},0).wait(1).to({x:590.95,y:464.65,startPosition:1},0).wait(1).to({x:594.85,y:462.95,startPosition:2},0).wait(1).to({x:598.75,y:461.25,startPosition:3},0).wait(1).to({x:602.6,y:459.5,startPosition:4},0).wait(1).to({x:606.5,y:457.8,startPosition:5},0).wait(1).to({x:610.4,y:456.1,startPosition:6},0).wait(1).to({x:614.3,y:454.4,startPosition:7},0).wait(1).to({x:618.2,y:452.65,startPosition:8},0).wait(1).to({x:622.1,y:450.95,startPosition:9},0).wait(1).to({x:626,y:449.25,startPosition:10},0).wait(1).to({x:629.85,y:447.55,startPosition:11},0).wait(1).to({x:633.75,y:445.85,startPosition:12},0).wait(1).to({x:637.65,y:444.1,startPosition:13},0).wait(1).to({x:641.55,y:442.4,startPosition:14},0).wait(1).to({x:645.45,y:440.7,startPosition:15},0).wait(1).to({x:649.35,y:439,startPosition:16},0).wait(1).to({x:653.25,y:437.25,startPosition:17},0).wait(1).to({x:657.15,y:435.55,startPosition:18},0).wait(1).to({x:661,y:433.85,startPosition:0},0).wait(1).to({x:664.9,y:432.15,startPosition:1},0).wait(1).to({x:668.8,y:430.45,startPosition:2},0).wait(1).to({x:672.7,y:428.7,startPosition:3},0).wait(1).to({x:676.6,y:427,startPosition:4},0).wait(1).to({x:680.5,y:425.3,startPosition:5},0).wait(1).to({x:684.4,y:423.6,startPosition:6},0).wait(1).to({x:688.25,y:421.85,startPosition:7},0).wait(1).to({x:692.15,y:420.15,startPosition:8},0).wait(1).to({x:696.05,y:418.45,startPosition:9},0).wait(1).to({x:699.95,y:416.75,startPosition:10},0).wait(1).to({x:703.85,y:415.05,startPosition:11},0).wait(1).to({x:707.75,y:413.3,startPosition:12},0).wait(1).to({x:711.65,y:411.6,startPosition:13},0).wait(1).to({x:715.55,y:409.9,startPosition:14},0).wait(1).to({x:719.4,y:408.2,startPosition:15},0).wait(1).to({x:723.3,y:406.45,startPosition:16},0).wait(1).to({x:727.2,y:404.75,startPosition:17},0).wait(1).to({x:731.1,y:403.05,startPosition:18},0).wait(1).to({x:735,y:401.35,startPosition:0},0).wait(1).to({x:738.9,y:399.65,startPosition:1},0).wait(1).to({x:742.8,y:397.9,startPosition:2},0).wait(1).to({x:746.65,y:396.2,startPosition:3},0).wait(1).to({x:750.55,y:394.5,startPosition:4},0).wait(1).to({x:754.45,y:392.8,startPosition:5},0).wait(1).to({x:758.35,y:391.05,startPosition:6},0).wait(1).to({x:762.25,y:389.35,startPosition:7},0).wait(1).to({x:766.15,y:387.65,startPosition:8},0).wait(1).to({x:770.05,y:385.95,startPosition:9},0).wait(1).to({x:773.95,y:384.25,startPosition:10},0).to({_off:true},1).wait(427));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.Scene_1_ACTIONS = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// ACTIONS
	this.start = new lib.play();
	this.start.name = "start";
	this.start.setTransform(621.35,398.05);

	this.replay = new lib.replay();
	this.replay.name = "replay";
	this.replay.setTransform(607.8,333.35,1,1,0,0,0,-5.4,-3.5);
	new cjs.ButtonHelper(this.replay, 0, 1, 1);

	this.text = new cjs.Text("\nMusic video by Billie Eilish performing bad guy. © 2019 Darkroom/Interscope Records", "20px 'Tw Cen MT'");
	this.text.lineHeight = 24;
	this.text.lineWidth = 729;
	this.text.parent = this;
	this.text.setTransform(6.95,652.45);
	this.text.shadow = new cjs.Shadow("rgba(0,0,0,1)",3,3,4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.start}]}).to({state:[]},1).to({state:[{t:this.text},{t:this.replay}]},752).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


(lib.MUSEMBG = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Stars
	this.instance = new lib.Star3Animation();
	this.instance.setTransform(63,131.05,0.4044,0.4044);

	this.instance_1 = new lib.Star3Animation();
	this.instance_1.setTransform(857.55,248.1,0.4044,0.4044);

	this.instance_2 = new lib.Star3Animation();
	this.instance_2.setTransform(834.95,282.6,0.4044,0.4044);

	this.instance_3 = new lib.Star3Animation();
	this.instance_3.setTransform(439,14.55,1.2099,1.2099);

	this.instance_4 = new lib.Star3Animation();
	this.instance_4.setTransform(598.25,131.05,0.4044,0.4044);

	this.instance_5 = new lib.Star1Animation();
	this.instance_5.setTransform(34.25,152.25,0.6214,0.6214,0,0,0,-0.1,0);

	this.instance_6 = new lib.Star3Animation();
	this.instance_6.setTransform(801.05,248.7,1.2099,1.2099);

	this.instance_7 = new lib.Star2Animation();
	this.instance_7.setTransform(383.55,-15.8,0.7696,0.7696);

	this.instance_8 = new lib.Star1Animation();
	this.instance_8.setTransform(626.25,150.35,1,0.6893);

	this.instance_9 = new lib.Star3Animation();
	this.instance_9.setTransform(11.3,27.7,0.4044,0.4044);

	this.instance_10 = new lib.Star1Animation();
	this.instance_10.setTransform(-109.7,65.85,0.6214,0.6214,0,0,0,-0.1,0);

	this.instance_11 = new lib.Star2Animation();
	this.instance_11.setTransform(1095.85,58.55,0.3613,0.3613);

	this.instance_12 = new lib.Star1Animation();
	this.instance_12.setTransform(947.3,51,0.9392,0.9392,0,0,0,-10,6.5);

	this.instance_13 = new lib.Star3Animation();
	this.instance_13.setTransform(-91.85,-4.3,1.8839,1.8839);

	this.instance_14 = new lib.Star2Animation();
	this.instance_14.setTransform(-39.1,46.6,0.7696,0.7696);

	this.instance_15 = new lib.Star1Animation();
	this.instance_15.setTransform(-11.1,-24.65);

	this.instance_16 = new lib.Star3Animation();
	this.instance_16.setTransform(983.5,-18.7,0.8732,0.8732);

	this.instance_17 = new lib.Star2Animation();
	this.instance_17.setTransform(1021.6,39.7,0.4875,0.4875);

	this.instance_18 = new lib.Star1Animation();
	this.instance_18.setTransform(1066.15,-0.8,1.4214,1.4214);

	this.instance_19 = new lib.Star2Animation();
	this.instance_19.setTransform(1021.6,39.7,0.4875,0.4875);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_18},{t:this.instance_17,p:{scaleX:0.4875,scaleY:0.4875,x:1021.6,y:39.7}},{t:this.instance_16},{t:this.instance_15},{t:this.instance_14,p:{scaleX:0.7696,scaleY:0.7696,x:-39.1,y:46.6}},{t:this.instance_13,p:{scaleX:1.8839,scaleY:1.8839,x:-91.85,y:-4.3}},{t:this.instance_12},{t:this.instance_11,p:{scaleX:0.3613,scaleY:0.3613,x:1095.85,y:58.55}},{t:this.instance_10},{t:this.instance_9,p:{scaleX:0.4044,scaleY:0.4044,x:11.3,y:27.7}},{t:this.instance_8},{t:this.instance_7,p:{regX:0,regY:0,scaleX:0.7696,scaleY:0.7696,x:383.55,y:-15.8}},{t:this.instance_6,p:{scaleX:1.2099,scaleY:1.2099,x:801.05,y:248.7}},{t:this.instance_5},{t:this.instance_4,p:{scaleX:0.4044,scaleY:0.4044,x:598.25,y:131.05}},{t:this.instance_3,p:{scaleX:1.2099,scaleY:1.2099,x:439,y:14.55}},{t:this.instance_2,p:{scaleX:0.4044,scaleY:0.4044,x:834.95,y:282.6}},{t:this.instance_1},{t:this.instance}]}).to({state:[{t:this.instance_18},{t:this.instance_19},{t:this.instance_13,p:{scaleX:0.8732,scaleY:0.8732,x:983.5,y:-18.7}},{t:this.instance_15},{t:this.instance_17,p:{scaleX:0.7696,scaleY:0.7696,x:-39.1,y:46.6}},{t:this.instance_9,p:{scaleX:1.8839,scaleY:1.8839,x:-91.85,y:-4.3}},{t:this.instance_12},{t:this.instance_14,p:{scaleX:0.3613,scaleY:0.3613,x:1095.85,y:58.55}},{t:this.instance_10},{t:this.instance_6,p:{scaleX:0.4044,scaleY:0.4044,x:11.3,y:27.7}},{t:this.instance_8},{t:this.instance_11,p:{scaleX:0.7696,scaleY:0.7696,x:383.55,y:-15.8}},{t:this.instance_4,p:{scaleX:1.2099,scaleY:1.2099,x:801.05,y:248.7}},{t:this.instance_5},{t:this.instance_3,p:{scaleX:0.4044,scaleY:0.4044,x:598.25,y:131.05}},{t:this.instance_2,p:{scaleX:1.2099,scaleY:1.2099,x:439,y:14.55}},{t:this.instance_1},{t:this.instance},{t:this.instance_7,p:{regX:2.8,regY:2.2,scaleX:1,scaleY:1,x:841.45,y:288.7}}]},12).wait(108));

	// Musem
	this.instance_20 = new lib.CachedBmp_12();
	this.instance_20.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_20).wait(120));

	// Clouds
	this.instance_21 = new lib.CloudsGroup();
	this.instance_21.setTransform(347.4,162.85,1,1,0,0,0,946.9,182.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_21).wait(1).to({x:348.2},0).wait(1).to({x:349},0).wait(1).to({x:349.8},0).wait(1).to({x:350.55},0).wait(1).to({x:351.35},0).wait(1).to({x:352.15},0).wait(1).to({x:352.9},0).wait(1).to({x:353.7},0).wait(1).to({x:354.5},0).wait(1).to({x:355.25},0).wait(1).to({x:356.05},0).wait(1).to({x:356.85},0).wait(1).to({x:357.6},0).wait(1).to({x:358.4},0).wait(1).to({x:359.2},0).wait(1).to({x:359.95},0).wait(1).to({x:360.75},0).wait(1).to({x:361.55},0).wait(1).to({x:362.3},0).wait(1).to({x:363.1},0).wait(1).to({x:363.9},0).wait(1).to({x:364.65},0).wait(1).to({x:365.45},0).wait(1).to({x:366.25},0).wait(1).to({x:367},0).wait(1).to({x:367.8},0).wait(1).to({x:368.6},0).wait(1).to({x:369.35},0).wait(1).to({x:370.15},0).wait(1).to({x:370.95},0).wait(1).to({x:371.7},0).wait(1).to({x:372.5},0).wait(1).to({x:373.3},0).wait(1).to({x:374.05},0).wait(1).to({x:374.85},0).wait(1).to({x:375.65},0).wait(1).to({x:376.4},0).wait(1).to({x:377.2},0).wait(1).to({x:378},0).wait(1).to({x:378.75},0).wait(1).to({x:379.55},0).wait(1).to({x:380.35},0).wait(1).to({x:381.1},0).wait(1).to({x:381.9},0).wait(1).to({x:382.7},0).wait(1).to({x:383.45},0).wait(1).to({x:384.25},0).wait(1).to({x:385.05},0).wait(1).to({x:385.8},0).wait(1).to({x:386.6},0).wait(1).to({x:387.4},0).wait(1).to({x:388.15},0).wait(1).to({x:388.95},0).wait(1).to({x:389.75},0).wait(1).to({x:390.5},0).wait(1).to({x:391.3},0).wait(1).to({x:392.1},0).wait(1).to({x:392.85},0).wait(1).to({x:393.65},0).wait(1).to({x:394.45},0).wait(1).to({x:395.25},0).wait(1).to({x:396},0).wait(1).to({x:396.8},0).wait(1).to({x:397.6},0).wait(1).to({x:398.35},0).wait(1).to({x:399.15},0).wait(1).to({x:399.95},0).wait(1).to({x:400.7},0).wait(1).to({x:401.5},0).wait(1).to({x:402.3},0).wait(1).to({x:403.05},0).wait(1).to({x:403.85},0).wait(1).to({x:404.65},0).wait(1).to({x:405.4},0).wait(1).to({x:406.2},0).wait(1).to({x:407},0).wait(1).to({x:407.75},0).wait(1).to({x:408.55},0).wait(1).to({x:409.35},0).wait(1).to({x:410.1},0).wait(1).to({x:410.9},0).wait(1).to({x:411.7},0).wait(1).to({x:412.45},0).wait(1).to({x:413.25},0).wait(1).to({x:414.05},0).wait(1).to({x:414.8},0).wait(1).to({x:415.6},0).wait(1).to({x:416.4},0).wait(1).to({x:417.15},0).wait(1).to({x:417.95},0).wait(1).to({x:418.75},0).wait(1).to({x:419.5},0).wait(1).to({x:420.3},0).wait(1).to({x:421.1},0).wait(1).to({x:421.85},0).wait(1).to({x:422.65},0).wait(1).to({x:423.45},0).wait(1).to({x:424.2},0).wait(1).to({x:425},0).wait(1).to({x:425.8},0).wait(1).to({x:426.55},0).wait(1).to({x:427.35},0).wait(1).to({x:428.15},0).wait(1).to({x:428.9},0).wait(1).to({x:429.7},0).wait(1).to({x:430.5},0).wait(1).to({x:431.25},0).wait(1).to({x:432.05},0).wait(1).to({x:432.85},0).wait(1).to({x:433.6},0).wait(1).to({x:434.4},0).wait(1).to({x:435.2},0).wait(1).to({x:435.95},0).wait(1).to({x:436.75},0).wait(1).to({x:437.55},0).wait(1).to({x:438.3},0).wait(1).to({x:439.1},0).wait(1).to({x:439.9},0).wait(1).to({x:440.65},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-599.4,-57,1986.9,668);


(lib.Scene_1_BG = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// BG
	this.instance = new lib.MUSEMBG("synched",0);
	this.instance.setTransform(480.1,366.55,1,1,0,0,0,331.9,305.5);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#121026").s().p("EhkRA49MAAAhx5MDIjAAAMAAABx5g");
	this.shape.setTransform(641.825,364.525);

	this.instance_1 = new lib.GalleryBG();
	this.instance_1.setTransform(2072.8,318.7,1,1,0,0,0,2021.8,257.7);
	this.instance_1._off = true;

	this.instance_2 = new lib.Camerarecording("synched",0);
	this.instance_2.setTransform(640,360,1,1,0,0,0,640,360);

	this.instance_3 = new lib.Mona_Lisa_BG("synched",0);
	this.instance_3.setTransform(658.1,408.35,1.5762,1.5575,0,0,0,0.1,1);

	this.text = new cjs.Text("30 ", "130px 'Wide Latin'", "#FF3366");
	this.text.textAlign = "center";
	this.text.lineHeight = 162;
	this.text.lineWidth = 1019;
	this.text.parent = this;
	this.text.setTransform(658.5,113.45);
	this.text._off = true;

	this.instance_4 = new lib.House("synched",0);
	this.instance_4.setTransform(693.2,358.35);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("rgba(102,102,102,0)").ss(1,1,1).p("AhxAhIg+hBIFfAA");
	this.shape_1.setTransform(644.75,319.525);

	this.instance_5 = new lib.sinalscene("synched",0);
	this.instance_5.setTransform(554.95,487.9,1,1,0,0,0,0,-1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance}]}).to({state:[{t:this.instance_1}]},120).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},68).to({state:[{t:this.text}]},197).to({state:[{t:this.text}]},3).to({state:[{t:this.text}]},3).to({state:[{t:this.text}]},3).to({state:[{t:this.text}]},3).to({state:[{t:this.text}]},3).to({state:[{t:this.text}]},3).to({state:[{t:this.text}]},3).to({state:[{t:this.text}]},3).to({state:[{t:this.text}]},3).to({state:[{t:this.text}]},3).to({state:[{t:this.text}]},3).to({state:[{t:this.text}]},3).to({state:[{t:this.text}]},3).to({state:[{t:this.text}]},3).to({state:[{t:this.text}]},3).to({state:[{t:this.text}]},3).to({state:[{t:this.shape_1},{t:this.instance_4}]},11).to({state:[{t:this.shape_1},{t:this.instance_4},{t:this.text}]},51).to({state:[{t:this.instance_5}]},7).to({state:[{t:this.instance_5}]},122).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(120).to({_off:false},0).wait(1).to({x:2054.15,y:318.75},0).wait(1).to({x:2035.55,y:318.85},0).wait(1).to({x:2017,y:318.95},0).wait(1).to({x:1998.4,y:319.05},0).wait(1).to({x:1979.8,y:319.15},0).wait(1).to({x:1961.2,y:319.25},0).wait(1).to({x:1942.6,y:319.3},0).wait(1).to({x:1924,y:319.4},0).wait(1).to({x:1905.4,y:319.5},0).wait(1).to({x:1886.8,y:319.6},0).wait(1).to({x:1868.2,y:319.7},0).wait(1).to({x:1849.55,y:319.8},0).wait(1).to({x:1830.95,y:319.9},0).wait(1).to({x:1812.35,y:319.95},0).wait(1).to({x:1793.75,y:320.05},0).wait(1).to({x:1775.15,y:320.15},0).wait(1).to({x:1756.55,y:320.25},0).wait(1).to({x:1737.95,y:320.35},0).wait(1).to({x:1719.35,y:320.45},0).wait(1).to({x:1700.75,y:320.55},0).wait(1).to({x:1682.15,y:320.6},0).wait(1).to({x:1663.55,y:320.7},0).wait(1).to({x:1644.95,y:320.8},0).wait(1).to({x:1626.3,y:320.9},0).wait(1).to({x:1607.7,y:321},0).wait(1).to({x:1589.1,y:321.1},0).wait(1).to({x:1570.5,y:321.15},0).wait(1).to({x:1551.9,y:321.25},0).wait(1).to({x:1533.3,y:321.35},0).wait(1).to({x:1514.7,y:321.45},0).wait(1).to({x:1496.1,y:321.55},0).wait(1).to({x:1477.5,y:321.65},0).wait(1).to({x:1458.9,y:321.75},0).wait(1).to({x:1440.3,y:321.8},0).wait(1).to({x:1421.65,y:321.9},0).wait(1).to({x:1403.05,y:322},0).wait(1).to({x:1384.45,y:322.1},0).wait(1).to({x:1365.85,y:322.2},0).wait(1).to({x:1347.25,y:322.3},0).wait(1).to({x:1328.65,y:322.4},0).wait(1).to({x:1310.05,y:322.45},0).wait(1).to({x:1291.45,y:322.55},0).wait(1).to({x:1272.85,y:322.65},0).wait(1).to({x:1254.25,y:322.75},0).wait(1).to({x:1235.65,y:322.85},0).wait(1).to({x:1217.05,y:322.95},0).wait(1).to({x:1198.4,y:323},0).wait(1).to({x:1179.8,y:323.1},0).wait(1).to({x:1161.2,y:323.2},0).wait(1).to({x:1142.6,y:323.3},0).wait(1).to({x:1124,y:323.4},0).wait(1).to({x:1105.4,y:323.5},0).wait(1).to({x:1086.8,y:323.6},0).wait(1).to({x:1068.2,y:323.65},0).wait(1).to({x:1049.6,y:323.75},0).wait(1).to({x:1031,y:323.85},0).wait(1).to({x:1012.4,y:323.95},0).wait(1).to({x:993.75,y:324.05},0).wait(1).to({x:975.15,y:324.15},0).wait(1).to({x:956.55,y:324.25},0).wait(1).to({x:937.95,y:324.3},0).wait(1).to({x:919.35,y:324.4},0).wait(1).to({x:900.75,y:324.5},0).wait(1).to({x:882.15,y:324.6},0).wait(1).to({x:863.55,y:324.7},0).wait(1).to({x:844.95,y:324.8},0).wait(1).to({x:826.35,y:324.85},0).wait(1).to({x:807.75,y:324.95},0).wait(1).to({x:789.15,y:325.05},0).wait(1).to({x:770.5,y:325.15},0).wait(1).to({x:751.9,y:325.25},0).wait(1).to({x:733.3,y:325.35},0).wait(1).to({x:714.7,y:325.45},0).wait(1).to({x:696.1,y:325.5},0).wait(1).to({x:677.5,y:325.6},0).wait(1).to({x:658.9,y:325.7},0).wait(1).to({x:640.3,y:325.8},0).wait(1).to({x:621.7,y:325.9},0).wait(1).to({x:603.1,y:326},0).wait(1).to({x:584.5,y:326.1},0).wait(1).to({x:565.85,y:326.15},0).wait(1).to({x:547.25,y:326.25},0).wait(1).to({x:528.65,y:326.35},0).wait(1).to({x:510.05,y:326.45},0).wait(1).to({x:491.45,y:326.55},0).wait(1).to({x:472.85,y:326.65},0).wait(1).to({x:454.25,y:326.7},0).wait(1).to({x:435.65,y:326.8},0).wait(1).to({x:417.05,y:326.9},0).wait(1).to({x:398.45,y:327},0).wait(1).to({x:379.85,y:327.1},0).wait(1).to({x:361.25,y:327.2},0).wait(1).to({x:342.6,y:327.3},0).wait(1).to({x:324,y:327.35},0).wait(1).to({x:305.4,y:327.45},0).wait(1).to({x:286.8,y:327.55},0).wait(1).to({x:268.2,y:327.65},0).wait(1).to({x:249.6,y:327.75},0).wait(1).to({x:231,y:327.85},0).wait(1).to({x:212.4,y:327.95},0).wait(1).to({x:193.8,y:328},0).wait(1).to({x:175.2,y:328.1},0).wait(1).to({x:156.6,y:328.2},0).wait(1).to({x:137.95,y:328.3},0).wait(1).to({x:119.35,y:328.4},0).wait(1).to({x:100.75,y:328.5},0).wait(1).to({x:82.15,y:328.55},0).wait(1).to({x:63.55,y:328.65},0).wait(1).to({x:44.95,y:328.75},0).wait(1).to({x:26.35,y:328.85},0).wait(1).to({x:7.75,y:328.95},0).wait(1).to({x:-10.85,y:329.05},0).wait(1).to({x:-29.45,y:329.15},0).wait(1).to({x:-48.05,y:329.2},0).wait(1).to({x:-66.65,y:329.3},0).wait(1).to({x:-85.3,y:329.4},0).wait(1).to({x:-103.9,y:329.5},0).wait(1).to({x:-122.5,y:329.6},0).wait(1).to({x:-141.1,y:329.7},0).wait(1).to({x:-159.7,y:329.8},0).wait(1).to({x:-178.3,y:329.85},0).wait(1).to({x:-196.9,y:329.95},0).wait(1).to({x:-215.5,y:330.05},0).wait(1).to({x:-234.1,y:330.15},0).wait(1).to({x:-252.7,y:330.25},0).wait(1).to({x:-271.3,y:330.35},0).wait(1).to({x:-289.95,y:330.45},0).to({_off:true},1).wait(505));
	this.timeline.addTween(cjs.Tween.get(this.text).wait(513).to({_off:false},0).wait(6).to({text:"30 \nM "},0).wait(3).to({text:"30 \nMi "},0).wait(3).to({text:"30 \nMin "},0).wait(3).to({text:"30 \nMinu "},0).wait(3).to({text:"30 \nMinut "},0).wait(3).to({text:"30 Minute"},0).wait(3).to({text:"30 Minutes"},0).wait(3).to({text:"30 Minutes\nL"},0).wait(3).to({text:"30 Minutes\nLa"},0).wait(3).to({text:"30 Minutes\nLat"},0).wait(3).to({text:"30 Minutes\nLate"},0).wait(3).to({text:"30 Minutes\nLater"},0).wait(3).to({text:"30 Minutes\nLater."},0).wait(3).to({text:"30 Minutes\nLater.."},0).wait(3).to({text:"30 Minutes\nLater..."},0).to({_off:true},11).wait(51).to({_off:false,scaleX:1.5278,scaleY:1.5728,x:629.8,y:425.7,text:"da-vinci\n family",font:"10px 'Snap ITC'",color:"#FFFFFF",lineHeight:14.85,lineWidth:94},0).to({_off:true},7).wait(123));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();


// stage content:
(lib.anitamalinsky = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0,1,751,752,753];
	this.streamSoundSymbolsList[0] = [{id:"Sound_Badguy",startFrame:0,endFrame:751,loop:0,offset:0}];
	this.___GetDepth___ = function(obj) {
		var depth = obj.depth;
		var cameraObj = this.___camera___instance;
		if(cameraObj && cameraObj.depth && obj.isAttachedToCamera)
		{
			depth += depth + cameraObj.depth;
		}
		return depth;
		}
	this.___needSorting___ = function() {
		for (var i = 0; i < this.numChildren - 1; i++)
		{
			var prevDepth = this.___GetDepth___(this.getChildAt(i));
			var nextDepth = this.___GetDepth___(this.getChildAt(i + 1));
			if (prevDepth < nextDepth)
				return true;
		}
		return false;
	}
	this.___sortFunction___ = function(obj1, obj2) {
		return (this.exportRoot.___GetDepth___(obj2) - this.exportRoot.___GetDepth___(obj1));
	}
	this.on('tick', function (event){
		var curTimeline = event.currentTarget;
		if (curTimeline.___needSorting___()){
			this.sortChildren(curTimeline.___sortFunction___);
		}
	});

	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
		var soundInstance = playSound("Sound_Badguy",-1);
		this.InsertIntoSoundStreamData(soundInstance,0,751,0);
		this.start = this.ACTIONS.start;
		var self=this;
		self.stop();
		
		self.start.addEventListener("click",StartPlaying);
		
		function StartPlaying()
		{
			self.gotoAndPlay(1);
		}
		
		createjs.Sound.registerSound("/sounds/Sound_Badguy", "Bad");
		createjs.Sound.play("Bad");
	}
	this.frame_1 = function() {
		this.start = undefined;
	}
	this.frame_751 = function() {
		playSound("Sound_Badguy");
	}
	this.frame_752 = function() {
		createjs.Sound.stop();
	}
	this.frame_753 = function() {
		this.replay = this.ACTIONS.replay;
		this.___loopingOver___ = true;
		var self=this;
		self.stop();
		
		self.replay.addEventListener("click",playagain);
		
		function playagain()
		{
			self.gotoAndPlay(1);
		}
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(750).call(this.frame_751).wait(1).call(this.frame_752).wait(1).call(this.frame_753).wait(1));

	// Camera
	this.___camera___instance = new lib.___Camera___();
	this.___camera___instance.name = "___camera___instance";
	this.___camera___instance.setTransform(640,360);
	this.___camera___instance.depth = 0;
	this.___camera___instance.visible = false;

	this.timeline.addTween(cjs.Tween.get(this.___camera___instance).wait(104).to({regX:1,regY:1.2,scaleX:0.3241,scaleY:0.3241,x:487.7,y:519.95},0).wait(16).to({regX:1.4,regY:1.6,scaleX:1,scaleY:1,x:641.3,y:360.65},0).wait(264).to({regY:0},0).wait(1).to({regX:0,scaleX:0.9796,scaleY:0.9796,x:640.6186,y:363.5971},0).wait(1).to({scaleX:0.9593,scaleY:0.9593,x:641.3372,y:366.5441},0).wait(1).to({scaleX:0.939,scaleY:0.939,x:642.0558,y:369.4912},0).wait(1).to({scaleX:0.9187,scaleY:0.9187,x:642.7744,y:372.4382},0).wait(1).to({scaleX:0.8984,scaleY:0.8984,x:643.4929,y:375.3853},0).wait(1).to({scaleX:0.8781,scaleY:0.8781,x:644.2115,y:378.3324},0).wait(1).to({scaleX:0.8578,scaleY:0.8578,x:644.9301,y:381.2794},0).wait(1).to({scaleX:0.8375,scaleY:0.8375,x:645.6487,y:384.2265},0).wait(1).to({scaleX:0.8172,scaleY:0.8172,x:646.3673,y:387.1735},0).wait(1).to({scaleX:0.7969,scaleY:0.7969,x:647.0859,y:390.1206},0).wait(1).to({scaleX:0.7766,scaleY:0.7766,x:647.8045,y:393.0676},0).wait(1).to({scaleX:0.7563,scaleY:0.7563,x:648.5231,y:396.0147},0).wait(1).to({scaleX:0.736,scaleY:0.736,x:649.2416,y:398.9618},0).wait(1).to({scaleX:0.7157,scaleY:0.7157,x:649.9602,y:401.9088},0).wait(1).to({scaleX:0.6954,scaleY:0.6954,x:650.6788,y:404.8559},0).wait(1).to({scaleX:0.6751,scaleY:0.6751,x:651.3974,y:407.8029},0).wait(1).to({scaleX:0.6548,scaleY:0.6548,x:652.116,y:410.75},0).wait(34).to({regX:0.2,regY:0.1,scaleX:0.6535,scaleY:0.6535,x:652.4,y:409.65,visible:true},0).wait(1).to({regX:0,regY:0,scaleX:0.6437,scaleY:0.6437,x:651.9701,y:400.9397},0).wait(1).to({scaleX:0.6338,scaleY:0.6338,x:651.6903,y:392.2793},0).wait(1).to({scaleX:0.624,scaleY:0.624,x:651.4104,y:383.619},0).wait(1).to({scaleX:0.6141,scaleY:0.6141,x:651.1305,y:374.9586},0).wait(1).to({scaleX:0.6042,scaleY:0.6042,x:650.8507,y:366.2983},0).wait(1).to({scaleX:0.5944,scaleY:0.5944,x:650.5708,y:357.6379},0).wait(1).to({scaleX:0.5845,scaleY:0.5845,x:650.2909,y:348.9776},0).wait(1).to({scaleX:0.5746,scaleY:0.5746,x:650.0111,y:340.3172},0).wait(1).to({scaleX:0.5648,scaleY:0.5648,x:649.7312,y:331.6569},0).wait(1).to({scaleX:0.5549,scaleY:0.5549,x:649.4513,y:322.9965},0).wait(1).to({scaleX:0.545,scaleY:0.545,x:649.1715,y:314.3362},0).wait(1).to({scaleX:0.5352,scaleY:0.5352,x:648.8916,y:305.6758},0).wait(1).to({scaleX:0.5253,scaleY:0.5253,x:648.6117,y:297.0155},0).wait(1).to({scaleX:0.5154,scaleY:0.5154,x:648.3318,y:288.3551},0).wait(1).to({scaleX:0.5056,scaleY:0.5056,x:648.052,y:279.6948},0).wait(1).to({scaleX:0.4957,scaleY:0.4957,x:647.7721,y:271.0345},0).wait(1).to({scaleX:0.4858,scaleY:0.4858,x:647.4922,y:262.3741},0).wait(1).to({scaleX:0.476,scaleY:0.476,x:647.2124,y:253.7138},0).wait(1).to({scaleX:0.4661,scaleY:0.4661,x:646.9325,y:245.0534},0).wait(1).to({scaleX:0.4562,scaleY:0.4562,x:646.6526,y:236.3931},0).wait(1).to({scaleX:0.4464,scaleY:0.4464,x:646.3728,y:227.7327},0).wait(1).to({scaleX:0.4365,scaleY:0.4365,x:646.0929,y:219.0724},0).wait(1).to({scaleX:0.4266,scaleY:0.4266,x:645.813,y:210.412},0).wait(1).to({scaleX:0.4167,scaleY:0.4167,x:645.5332,y:201.7517},0).wait(1).to({scaleX:0.4069,scaleY:0.4069,x:645.2533,y:193.0913},0).wait(1).to({scaleX:0.397,scaleY:0.397,x:644.9734,y:184.431},0).wait(1).to({scaleX:0.3871,scaleY:0.3871,x:644.6936,y:175.7706},0).wait(51).to({scaleX:1,scaleY:1,x:639.5404,y:359.6095},0).wait(10).to({_off:true},1).wait(48).to({_off:false,regX:0.6,regY:0.7,scaleX:0.6033,scaleY:0.6033,x:677.4,y:433.65},0).wait(1).to({regX:0,regY:0,x:677.05,y:433.25},0).wait(1).to({scaleX:0.5923,scaleY:0.5923,x:675.97,y:433.5272},0).wait(1).to({scaleX:0.5813,scaleY:0.5813,x:674.8899,y:433.8043},0).wait(1).to({scaleX:0.5703,scaleY:0.5703,x:673.8099,y:434.0815},0).wait(1).to({scaleX:0.5592,scaleY:0.5592,x:672.7298,y:434.3587},0).wait(1).to({scaleX:0.5482,scaleY:0.5482,x:671.6498,y:434.6358},0).wait(1).to({scaleX:0.5372,scaleY:0.5372,x:670.5697,y:434.913},0).wait(1).to({scaleX:0.5261,scaleY:0.5261,x:669.4897,y:435.1902},0).wait(1).to({scaleX:0.5151,scaleY:0.5151,x:668.4096,y:435.4674},0).wait(1).to({scaleX:0.5041,scaleY:0.5041,x:667.3296,y:435.7445},0).wait(1).to({scaleX:0.4931,scaleY:0.4931,x:666.2495,y:436.0217},0).wait(1).to({scaleX:0.482,scaleY:0.482,x:665.1695,y:436.2989},0).wait(1).to({scaleX:0.471,scaleY:0.471,x:664.0894,y:436.576},0).wait(1).to({scaleX:0.46,scaleY:0.46,x:663.0094,y:436.8532},0).wait(1).to({scaleX:0.4489,scaleY:0.4489,x:661.9293,y:437.1304},0).wait(1).to({scaleX:0.4379,scaleY:0.4379,x:660.8493,y:437.4075},0).wait(1).to({scaleX:0.4269,scaleY:0.4269,x:659.7692,y:437.6847},0).wait(1).to({scaleX:0.4158,scaleY:0.4158,x:658.6892,y:437.9619},0).wait(1).to({scaleX:0.4048,scaleY:0.4048,x:657.6091,y:438.239},0).wait(1).to({scaleX:0.3938,scaleY:0.3938,x:656.5291,y:438.5162},0).wait(1).to({scaleX:0.3828,scaleY:0.3828,x:655.449,y:438.7934},0).wait(1).to({scaleX:0.3717,scaleY:0.3717,x:654.369,y:439.0706},0).wait(1).to({scaleX:0.3607,scaleY:0.3607,x:653.2889,y:439.3477},0).wait(1).to({scaleX:0.3497,scaleY:0.3497,x:652.2089,y:439.6249},0).wait(1).to({scaleX:0.3386,scaleY:0.3386,x:651.1288,y:439.9021},0).wait(1).to({scaleX:0.3276,scaleY:0.3276,x:650.0488,y:440.1792},0).wait(1).to({scaleX:0.3166,scaleY:0.3166,x:648.9687,y:440.4564},0).wait(1).to({scaleX:0.3056,scaleY:0.3056,x:647.8887,y:440.7336},0).wait(1).to({scaleX:0.2945,scaleY:0.2945,x:646.8086,y:441.0107},0).wait(1).to({scaleX:0.2835,scaleY:0.2835,x:645.7286,y:441.2879},0).wait(1).to({scaleX:0.2725,scaleY:0.2725,x:644.6486,y:441.5651},0).wait(1).to({scaleX:0.2614,scaleY:0.2614,x:643.5685,y:441.8422},0).wait(1).to({scaleX:0.2504,scaleY:0.2504,x:642.4885,y:442.1194},0).wait(1).to({scaleX:0.2394,scaleY:0.2394,x:641.4084,y:442.3966},0).wait(1).to({scaleX:0.2283,scaleY:0.2283,x:640.3284,y:442.6737},0).wait(1).to({scaleX:0.2173,scaleY:0.2173,x:639.2483,y:442.9509},0).wait(1).to({scaleX:0.2063,scaleY:0.2063,x:638.1683,y:443.2281},0).wait(1).to({scaleX:0.1953,scaleY:0.1953,x:637.0882,y:443.5053},0).wait(1).to({scaleX:0.1842,scaleY:0.1842,x:636.0082,y:443.7824},0).wait(1).to({scaleX:0.1732,scaleY:0.1732,x:634.9281,y:444.0596},0).wait(1).to({scaleX:0.1622,scaleY:0.1622,x:633.8481,y:444.3368},0).wait(1).to({scaleX:0.1511,scaleY:0.1511,x:632.768,y:444.6139},0).wait(1).to({scaleX:0.1401,scaleY:0.1401,x:631.688,y:444.8911},0).wait(1).to({scaleX:0.1291,scaleY:0.1291,x:630.6079,y:445.1683},0).wait(1).to({scaleX:0.1181,scaleY:0.1181,x:629.5279,y:445.4454},0).wait(1).to({regX:0.5,scaleX:0.107,scaleY:0.107,x:628.5,y:445.8},0).wait(12).to({regX:0,regY:0.4,scaleX:0.3076,scaleY:0.3076,x:867.7,y:193.7},0).wait(1).to({regY:0,scaleX:0.3258,scaleY:0.3258,x:889.4458,y:170.6728},0).wait(1).to({scaleX:0.3314,scaleY:0.3314,x:887.3954,y:172.2341},0).wait(1).to({scaleX:0.3369,scaleY:0.3369,x:885.345,y:173.7954},0).wait(1).to({scaleX:0.3425,scaleY:0.3425,x:883.2946,y:175.3566},0).wait(1).to({scaleX:0.3481,scaleY:0.3481,x:881.2442,y:176.9179},0).wait(1).to({scaleX:0.3537,scaleY:0.3537,x:879.1937,y:178.4792},0).wait(1).to({scaleX:0.3592,scaleY:0.3592,x:877.1433,y:180.0404},0).wait(1).to({scaleX:0.3648,scaleY:0.3648,x:875.0929,y:181.6017},0).wait(1).to({scaleX:0.3704,scaleY:0.3704,x:873.0425,y:183.163},0).wait(1).to({scaleX:0.376,scaleY:0.376,x:870.9921,y:184.7243},0).wait(1).to({scaleX:0.3815,scaleY:0.3815,x:868.9417,y:186.2855},0).wait(1).to({scaleX:0.3871,scaleY:0.3871,x:866.8913,y:187.8468},0).wait(1).to({scaleX:0.3927,scaleY:0.3927,x:864.8409,y:189.4081},0).wait(1).to({scaleX:0.3982,scaleY:0.3982,x:862.7904,y:190.9693},0).wait(1).to({scaleX:0.4038,scaleY:0.4038,x:860.74,y:192.5306},0).wait(1).to({scaleX:0.4094,scaleY:0.4094,x:858.6896,y:194.0919},0).wait(1).to({scaleX:0.415,scaleY:0.415,x:856.6392,y:195.6532},0).wait(1).to({scaleX:0.4205,scaleY:0.4205,x:854.5888,y:197.2144},0).wait(1).to({scaleX:0.4261,scaleY:0.4261,x:852.5384,y:198.7757},0).wait(1).to({scaleX:0.4317,scaleY:0.4317,x:850.488,y:200.337},0).wait(1).to({scaleX:0.4372,scaleY:0.4372,x:848.4376,y:201.8982},0).wait(1).to({scaleX:0.4428,scaleY:0.4428,x:846.3872,y:203.4595},0).wait(1).to({scaleX:0.4484,scaleY:0.4484,x:844.3367,y:205.0208},0).wait(1).to({scaleX:0.454,scaleY:0.454,x:842.2863,y:206.5821},0).wait(1).to({scaleX:0.4595,scaleY:0.4595,x:840.2359,y:208.1433},0).wait(1).to({scaleX:0.4651,scaleY:0.4651,x:838.1855,y:209.7046},0).wait(1).to({scaleX:0.4707,scaleY:0.4707,x:836.1351,y:211.2659},0).wait(1).to({scaleX:0.4762,scaleY:0.4762,x:834.0847,y:212.8271},0).wait(1).to({scaleX:0.4818,scaleY:0.4818,x:832.0343,y:214.3884},0).wait(1).to({scaleX:0.4874,scaleY:0.4874,x:829.9839,y:215.9497},0).wait(1).to({scaleX:0.493,scaleY:0.493,x:827.9335,y:217.511},0).wait(1).to({scaleX:0.4985,scaleY:0.4985,x:825.883,y:219.0722},0).wait(1).to({scaleX:0.5041,scaleY:0.5041,x:823.8326,y:220.6335},0).wait(1).to({scaleX:0.5097,scaleY:0.5097,x:821.7822,y:222.1948},0).wait(1).to({scaleX:0.5152,scaleY:0.5152,x:819.7318,y:223.756},0).wait(1).to({scaleX:0.5208,scaleY:0.5208,x:817.6814,y:225.3173},0).wait(1).to({scaleX:0.5264,scaleY:0.5264,x:815.631,y:226.8786},0).wait(1).to({scaleX:0.532,scaleY:0.532,x:813.5806,y:228.4399},0).wait(1).to({scaleX:0.5375,scaleY:0.5375,x:811.5302,y:230.0011},0).wait(1).to({scaleX:0.5431,scaleY:0.5431,x:809.4797,y:231.5624},0).wait(1).to({scaleX:0.5487,scaleY:0.5487,x:807.4293,y:233.1237},0).wait(1).to({scaleX:0.5542,scaleY:0.5542,x:805.3789,y:234.6849},0).wait(1).to({scaleX:0.5598,scaleY:0.5598,x:803.3285,y:236.2462},0).wait(1).to({scaleX:0.5654,scaleY:0.5654,x:801.2781,y:237.8075},0).wait(1).to({scaleX:0.571,scaleY:0.571,x:799.2277,y:239.3688},0).wait(1).to({scaleX:0.5765,scaleY:0.5765,x:797.1773,y:240.93},0).wait(1).to({scaleX:0.5821,scaleY:0.5821,x:795.1269,y:242.4913},0).wait(1).to({scaleX:0.5877,scaleY:0.5877,x:793.0765,y:244.0526},0).wait(1).to({scaleX:0.5932,scaleY:0.5932,x:791.026,y:245.6138},0).wait(1).to({scaleX:0.5988,scaleY:0.5988,x:788.9756,y:247.1751},0).wait(1).to({scaleX:0.6044,scaleY:0.6044,x:786.9252,y:248.7364},0).wait(1).to({scaleX:0.61,scaleY:0.61,x:784.8748,y:250.2977},0).wait(1).to({scaleX:0.6155,scaleY:0.6155,x:782.8244,y:251.8589},0).wait(1).to({scaleX:0.6211,scaleY:0.6211,x:780.774,y:253.4202},0).wait(1).to({scaleX:0.6267,scaleY:0.6267,x:778.7236,y:254.9815},0).wait(1).to({scaleX:0.6322,scaleY:0.6322,x:776.6732,y:256.5427},0).wait(1).to({scaleX:0.6378,scaleY:0.6378,x:774.6228,y:258.104},0).wait(1).to({scaleX:0.6434,scaleY:0.6434,x:772.5723,y:259.6653},0).wait(1).to({scaleX:0.649,scaleY:0.649,x:770.5219,y:261.2266},0).wait(1).to({scaleX:0.6545,scaleY:0.6545,x:768.4715,y:262.7878},0).wait(1).to({scaleX:0.6601,scaleY:0.6601,x:766.4211,y:264.3491},0).wait(1).to({scaleX:0.6657,scaleY:0.6657,x:764.3707,y:265.9104},0).wait(1).to({scaleX:0.6712,scaleY:0.6712,x:762.3203,y:267.4716},0).wait(1).to({scaleX:0.6768,scaleY:0.6768,x:760.2699,y:269.0329},0).wait(1).to({scaleX:0.6824,scaleY:0.6824,x:758.2195,y:270.5942},0).wait(1).to({scaleX:0.688,scaleY:0.688,x:756.169,y:272.1555},0).wait(1).to({scaleX:0.6935,scaleY:0.6935,x:754.1186,y:273.7167},0).wait(1).to({scaleX:0.6991,scaleY:0.6991,x:752.0682,y:275.278},0).wait(1).to({scaleX:0.7047,scaleY:0.7047,x:750.0178,y:276.8393},0).wait(1).to({scaleX:0.7102,scaleY:0.7102,x:747.9674,y:278.4005},0).wait(1).to({scaleX:0.7158,scaleY:0.7158,x:745.917,y:279.9618},0).wait(1).to({scaleX:0.7214,scaleY:0.7214,x:743.8666,y:281.5231},0).wait(1).to({scaleX:0.727,scaleY:0.727,x:741.8162,y:283.0844},0).wait(1).to({scaleX:0.7325,scaleY:0.7325,x:739.7658,y:284.6456},0).wait(1).to({scaleX:0.7381,scaleY:0.7381,x:737.7153,y:286.2069},0).wait(1).to({scaleX:0.7437,scaleY:0.7437,x:735.6649,y:287.7682},0).wait(1).to({scaleX:0.7492,scaleY:0.7492,x:733.6145,y:289.3294},0).wait(1).to({scaleX:0.7548,scaleY:0.7548,x:731.5641,y:290.8907},0).wait(1).to({scaleX:0.7604,scaleY:0.7604,x:729.5137,y:292.452},0).wait(1).to({scaleX:0.766,scaleY:0.766,x:727.4633,y:294.0133},0).wait(1).to({scaleX:0.7715,scaleY:0.7715,x:725.4129,y:295.5745},0).wait(1).to({scaleX:0.7771,scaleY:0.7771,x:723.3625,y:297.1358},0).wait(1).to({scaleX:0.7827,scaleY:0.7827,x:721.3121,y:298.6971},0).wait(1).to({scaleX:0.7882,scaleY:0.7882,x:719.2616,y:300.2583},0).wait(1).to({scaleX:0.7938,scaleY:0.7938,x:717.2112,y:301.8196},0).wait(1).to({scaleX:0.7994,scaleY:0.7994,x:715.1608,y:303.3809},0).wait(1).to({scaleX:0.805,scaleY:0.805,x:713.1104,y:304.9422},0).wait(1).to({scaleX:0.8105,scaleY:0.8105,x:711.06,y:306.5034},0).wait(1).to({scaleX:0.8161,scaleY:0.8161,x:709.0096,y:308.0647},0).wait(1).to({scaleX:0.8217,scaleY:0.8217,x:706.9592,y:309.626},0).wait(1).to({scaleX:0.8272,scaleY:0.8272,x:704.9088,y:311.1872},0).wait(1).to({scaleX:0.8328,scaleY:0.8328,x:702.8583,y:312.7485},0).wait(1).to({scaleX:0.8384,scaleY:0.8384,x:700.8079,y:314.3098},0).wait(1).to({scaleX:0.844,scaleY:0.844,x:698.7575,y:315.8711},0).wait(1).to({scaleX:0.8495,scaleY:0.8495,x:696.7071,y:317.4323},0).wait(1).to({scaleX:0.8551,scaleY:0.8551,x:694.6567,y:318.9936},0).wait(1).to({scaleX:0.8607,scaleY:0.8607,x:692.6063,y:320.5549},0).wait(1).to({scaleX:0.8663,scaleY:0.8663,x:690.5559,y:322.1161},0).wait(1).to({scaleX:0.8718,scaleY:0.8718,x:688.5055,y:323.6774},0).wait(1).to({scaleX:0.8774,scaleY:0.8774,x:686.4551,y:325.2387},0).wait(1).to({scaleX:0.883,scaleY:0.883,x:684.4046,y:326.8},0).wait(1).to({scaleX:0.8885,scaleY:0.8885,x:682.3542,y:328.3612},0).wait(1).to({scaleX:0.8941,scaleY:0.8941,x:680.3038,y:329.9225},0).wait(1).to({scaleX:0.8997,scaleY:0.8997,x:678.2534,y:331.4838},0).wait(1).to({scaleX:0.9053,scaleY:0.9053,x:676.203,y:333.045},0).wait(1).to({scaleX:0.9108,scaleY:0.9108,x:674.1526,y:334.6063},0).wait(1).to({scaleX:0.9164,scaleY:0.9164,x:672.1022,y:336.1676},0).wait(1).to({scaleX:0.922,scaleY:0.922,x:670.0518,y:337.7289},0).wait(1).to({scaleX:0.9275,scaleY:0.9275,x:668.0014,y:339.2901},0).wait(1).to({scaleX:0.9331,scaleY:0.9331,x:665.9509,y:340.8514},0).wait(1).to({scaleX:0.9387,scaleY:0.9387,x:663.9005,y:342.4127},0).wait(1).to({scaleX:0.9443,scaleY:0.9443,x:661.8501,y:343.9739},0).wait(1).to({scaleX:0.9498,scaleY:0.9498,x:659.7997,y:345.5352},0).wait(1).to({scaleX:0.9554,scaleY:0.9554,x:657.7493,y:347.0965},0).wait(1).to({scaleX:0.961,scaleY:0.961,x:655.6989,y:348.6578},0).wait(1).to({scaleX:0.9665,scaleY:0.9665,x:653.6485,y:350.219},0).wait(1).to({scaleX:0.9721,scaleY:0.9721,x:651.5981,y:351.7803},0).wait(1).to({scaleX:0.9777,scaleY:0.9777,x:649.5476,y:353.3416},0).wait(1).to({scaleX:0.9833,scaleY:0.9833,x:647.4972,y:354.9028},0).wait(1).to({scaleX:0.9888,scaleY:0.9888,x:645.4468,y:356.4641},0).wait(1).to({scaleX:0.9944,scaleY:0.9944,x:643.3964,y:358.0254},0).wait(1).to({scaleX:1,scaleY:1,x:641.346,y:359.5867},0).to({_off:true},1).wait(1));

	// ACTIONS_obj_
	this.ACTIONS = new lib.Scene_1_ACTIONS();
	this.ACTIONS.name = "ACTIONS";
	this.ACTIONS.setTransform(621.4,398,1,1,0,0,0,621.4,398);
	this.ACTIONS.depth = 0;
	this.ACTIONS.isAttachedToCamera = 0
	this.ACTIONS.isAttachedToMask = 0
	this.ACTIONS.layerDepth = 0
	this.ACTIONS.layerIndex = 0
	this.ACTIONS.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.ACTIONS).wait(752).to({regX:622.7,regY:397.6,scaleX:1.0001,scaleY:1.0001,x:621.35},0).wait(1).to({regX:621.4,regY:398,scaleX:1,scaleY:1,x:621.4},0).wait(1));

	// House_Text_obj_
	this.House_Text = new lib.Scene_1_House_Text();
	this.House_Text.name = "House_Text";
	this.House_Text.depth = 0;
	this.House_Text.isAttachedToCamera = 0
	this.House_Text.isAttachedToMask = 0
	this.House_Text.layerDepth = 0
	this.House_Text.layerIndex = 1
	this.House_Text.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.House_Text).wait(572).to({regX:290.9,regY:216,scaleX:1.6574,scaleY:1.6574,x:0.05},0).to({_off:true},58).wait(124));

	// Drawing_obj_
	this.Drawing = new lib.Scene_1_Drawing();
	this.Drawing.name = "Drawing";
	this.Drawing.depth = 0;
	this.Drawing.isAttachedToCamera = 0
	this.Drawing.isAttachedToMask = 0
	this.Drawing.layerDepth = 0
	this.Drawing.layerIndex = 2
	this.Drawing.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Drawing).wait(316).to({regX:-0.1,regY:-0.9,scaleX:1.0001,scaleY:1.0001,x:-0.05},0).wait(1).to({regX:645.3,regY:1452.6,scaleX:1,scaleY:1,x:645.3,y:1453.45},0).wait(72).to({regX:68.5,regY:51.9,scaleX:1.1131,scaleY:1.1131,x:0.05,y:0},0).wait(1).to({regX:82.2,regY:62.1,scaleX:1.1388,scaleY:1.1388,x:0,y:-0.1},0).to({_off:true},123).wait(241));

	// Hand__obj_
	this.Hand_ = new lib.Scene_1_Hand_();
	this.Hand_.name = "Hand_";
	this.Hand_.depth = 0;
	this.Hand_.isAttachedToCamera = 0
	this.Hand_.isAttachedToMask = 0
	this.Hand_.layerDepth = 0
	this.Hand_.layerIndex = 3
	this.Hand_.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Hand_).wait(390).to({regX:82.2,regY:62.1,scaleX:1.1388,scaleY:1.1388,y:-0.1},0).wait(3).to({regX:123.3,regY:92.9,scaleX:1.2237,scaleY:1.2237,y:0},0).wait(3).to({regX:164.4,regY:123.7,scaleX:1.3223,scaleY:1.3223},0).wait(3).to({regX:205.6,regY:154.6,scaleX:1.4381,scaleY:1.4381,x:-0.05,y:0.1},0).wait(3).to({regX:233.1,regY:175.1,scaleX:1.5273,scaleY:1.5273,x:0.1,y:0.05},0).wait(33).to({regX:234,regY:174.2,scaleX:1.5301,scaleY:1.5301,y:-0.1},0).wait(28).to({regX:396.9,regY:36.4,scaleX:2.5831,scaleY:2.5831,x:0.05,y:0.15},0).wait(1).to({regX:773.8,regY:476.3,scaleX:1,scaleY:1,x:376.95,y:440},0).wait(48).to({_off:true},1).wait(241));

	// Camera_View_Man_obj_
	this.Camera_View_Man = new lib.Scene_1_Camera_View_Man();
	this.Camera_View_Man.name = "Camera_View_Man";
	this.Camera_View_Man.depth = 0;
	this.Camera_View_Man.isAttachedToCamera = 0
	this.Camera_View_Man.isAttachedToMask = 0
	this.Camera_View_Man.layerDepth = 0
	this.Camera_View_Man.layerIndex = 4
	this.Camera_View_Man.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Camera_View_Man).wait(248).to({regX:-0.1,regY:-0.9,scaleX:1.0001,scaleY:1.0001,x:-0.05},0).wait(1).to({regX:643.5,regY:441.6,scaleX:1,scaleY:1,x:643.5,y:442.45},0).wait(67).to({regX:-0.1,regY:-0.9,scaleX:1.0001,scaleY:1.0001,x:-0.05,y:0},0).to({_off:true},427).wait(11));

	// Side_View_Man_obj_
	this.Side_View_Man = new lib.Scene_1_Side_View_Man();
	this.Side_View_Man.name = "Side_View_Man";
	this.Side_View_Man.depth = 0;
	this.Side_View_Man.isAttachedToCamera = 0
	this.Side_View_Man.isAttachedToMask = 0
	this.Side_View_Man.layerDepth = 0
	this.Side_View_Man.layerIndex = 5
	this.Side_View_Man.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Side_View_Man).wait(120).to({regX:-0.1,regY:-0.9,scaleX:1.0001,scaleY:1.0001,x:-0.05},0).wait(1).to({regX:284.9,regY:740.1,scaleX:1,scaleY:1,x:284.9,y:740.95},0).wait(127).to({regX:-0.1,regY:-0.9,scaleX:1.0001,scaleY:1.0001,x:-0.05,y:0},0).to({_off:true},79).wait(427));

	// Leo_obj_
	this.Leo = new lib.Scene_1_Leo();
	this.Leo.name = "Leo";
	this.Leo.depth = 0;
	this.Leo.isAttachedToCamera = 0
	this.Leo.isAttachedToMask = 0
	this.Leo.layerDepth = 0
	this.Leo.layerIndex = 6
	this.Leo.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Leo).wait(17).to({regX:625.8,regY:441.1,x:625.8,y:441.1},0).wait(102).to({_off:true},1).wait(634));

	// BG_obj_
	this.BG = new lib.Scene_1_BG();
	this.BG.name = "BG";
	this.BG.setTransform(495.6,364.5,1,1,0,0,0,495.6,364.5);
	this.BG.depth = 0;
	this.BG.isAttachedToCamera = 0
	this.BG.isAttachedToMask = 0
	this.BG.layerDepth = 0
	this.BG.layerIndex = 7
	this.BG.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.BG).wait(120).to({regX:495.5,regY:363.6,scaleX:1.0001,scaleY:1.0001},0).wait(1).to({regX:891.5,regY:806.5,scaleX:1,scaleY:1,x:891.55,y:807.4},0).wait(127).to({regX:495.5,regY:363.6,scaleX:1.0001,scaleY:1.0001,x:495.6,y:364.5},0).wait(265).to({regX:495.2,regY:364.2,x:495.65,y:364.55},0).wait(12).to({regX:495.6,regY:364.5,scaleX:1,scaleY:1,x:495.6,y:364.5},0).wait(47).to({regX:589.9,regY:435.9,scaleX:1.6574,scaleY:1.6574,y:364.45},0).wait(51).to({regX:613,regY:446.2,scaleX:9.3463,scaleY:9.3463,x:495.85,y:364.05},0).wait(7).to({regX:823.3,regY:195,scaleX:3.2513,scaleY:3.2513,x:495.65,y:364.65},0).wait(122).to({regX:496.9,regY:364.1,scaleX:1.0001,scaleY:1.0001,x:495.55,y:364.5},0).to({_off:true},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(-1671.7,343.1,5766.4,2464.8);
// library properties:
lib.properties = {
	id: '5FC4BBCBE5306A41B19472F31D93B0FB',
	width: 1280,
	height: 720,
	fps: 30,
	color: "#E1E0D7",
	opacity: 1.00,
	manifest: [
		{src:"images/CachedBmp_120.png?1618065889609", id:"CachedBmp_120"},
		{src:"images/CachedBmp_11.png?1618065889609", id:"CachedBmp_11"},
		{src:"images/BG.png?1618065889609", id:"BG"},
		{src:"images/flash0ai.png?1618065889609", id:"flash0ai"},
		{src:"images/anita malinsky_atlas_1.png?1618065889452", id:"anita malinsky_atlas_1"},
		{src:"images/anita malinsky_atlas_2.png?1618065889452", id:"anita malinsky_atlas_2"},
		{src:"images/anita malinsky_atlas_3.png?1618065889452", id:"anita malinsky_atlas_3"},
		{src:"images/anita malinsky_atlas_4.png?1618065889453", id:"anita malinsky_atlas_4"},
		{src:"images/anita malinsky_atlas_5.png?1618065889453", id:"anita malinsky_atlas_5"},
		{src:"images/anita malinsky_atlas_6.png?1618065889454", id:"anita malinsky_atlas_6"},
		{src:"sounds/Sound_Badguy.mp3?1618065889609", id:"Sound_Badguy"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['5FC4BBCBE5306A41B19472F31D93B0FB'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}

p._getProjectionMatrix = function(container, totalDepth) {	var focalLength = 528.25;
	var projectionCenter = { x : lib.properties.width/2, y : lib.properties.height/2 };
	var scale = (totalDepth + focalLength)/focalLength;
	var scaleMat = new createjs.Matrix2D;
	scaleMat.a = 1/scale;
	scaleMat.d = 1/scale;
	var projMat = new createjs.Matrix2D;
	projMat.tx = -projectionCenter.x;
	projMat.ty = -projectionCenter.y;
	projMat = projMat.prependMatrix(scaleMat);
	projMat.tx += projectionCenter.x;
	projMat.ty += projectionCenter.y;
	return projMat;
}
p._handleTick = function(event) {
	var cameraInstance = exportRoot.___camera___instance;
	if(cameraInstance !== undefined && cameraInstance.pinToObject !== undefined)
	{
		cameraInstance.x = cameraInstance.pinToObject.x + cameraInstance.pinToObject.pinOffsetX;
		cameraInstance.y = cameraInstance.pinToObject.y + cameraInstance.pinToObject.pinOffsetY;
		if(cameraInstance.pinToObject.parent !== undefined && cameraInstance.pinToObject.parent.depth !== undefined)
		cameraInstance.depth = cameraInstance.pinToObject.parent.depth + cameraInstance.pinToObject.pinOffsetZ;
	}
	stage._applyLayerZDepth(exportRoot);
}
p._applyLayerZDepth = function(parent)
{
	var cameraInstance = parent.___camera___instance;
	var focalLength = 528.25;
	var projectionCenter = { 'x' : 0, 'y' : 0};
	if(parent === exportRoot)
	{
		var stageCenter = { 'x' : lib.properties.width/2, 'y' : lib.properties.height/2 };
		projectionCenter.x = stageCenter.x;
		projectionCenter.y = stageCenter.y;
	}
	for(child in parent.children)
	{
		var layerObj = parent.children[child];
		if(layerObj == cameraInstance)
			continue;
		stage._applyLayerZDepth(layerObj, cameraInstance);
		if(layerObj.layerDepth === undefined)
			continue;
		if(layerObj.currentFrame != layerObj.parent.currentFrame)
		{
			layerObj.gotoAndPlay(layerObj.parent.currentFrame);
		}
		var matToApply = new createjs.Matrix2D;
		var cameraMat = new createjs.Matrix2D;
		var totalDepth = layerObj.layerDepth ? layerObj.layerDepth : 0;
		var cameraDepth = 0;
		if(cameraInstance && !layerObj.isAttachedToCamera)
		{
			var mat = cameraInstance.getMatrix();
			mat.tx -= projectionCenter.x;
			mat.ty -= projectionCenter.y;
			cameraMat = mat.invert();
			cameraMat.prependTransform(projectionCenter.x, projectionCenter.y, 1, 1, 0, 0, 0, 0, 0);
			cameraMat.appendTransform(-projectionCenter.x, -projectionCenter.y, 1, 1, 0, 0, 0, 0, 0);
			if(cameraInstance.depth)
				cameraDepth = cameraInstance.depth;
		}
		if(layerObj.depth)
		{
			totalDepth = layerObj.depth;
		}
		//Offset by camera depth
		totalDepth -= cameraDepth;
		if(totalDepth < -focalLength)
		{
			matToApply.a = 0;
			matToApply.d = 0;
		}
		else
		{
			if(layerObj.layerDepth)
			{
				var sizeLockedMat = stage._getProjectionMatrix(parent, layerObj.layerDepth);
				if(sizeLockedMat)
				{
					sizeLockedMat.invert();
					matToApply.prependMatrix(sizeLockedMat);
				}
			}
			matToApply.prependMatrix(cameraMat);
			var projMat = stage._getProjectionMatrix(parent, totalDepth);
			if(projMat)
			{
				matToApply.prependMatrix(projMat);
			}
		}
		layerObj.transformMatrix = matToApply;
	}
}
an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}

// Virtual camera API : 

an.VirtualCamera = new function() {
var _camera = new Object();
function VC(timeline) {
	this.timeline = timeline;
	this.camera = timeline.___camera___instance;
	this.centerX = lib.properties.width / 2;
	this.centerY = lib.properties.height / 2;
	this.camAxisX = this.camera.x;
	this.camAxisY = this.camera.y;
	if(timeline.___camera___instance == null || timeline.___camera___instance == undefined ) {
		timeline.___camera___instance = new cjs.MovieClip();
		timeline.___camera___instance.visible = false;
		timeline.___camera___instance.parent = timeline;
		timeline.___camera___instance.setTransform(this.centerX, this.centerY);
	}
	this.camera = timeline.___camera___instance;
}

VC.prototype.moveBy = function(x, y, z) {
z = typeof z !== 'undefined' ? z : 0;
	var position = this.___getCamPosition___();
	var rotAngle = this.getRotation()*Math.PI/180;
	var sinTheta = Math.sin(rotAngle);
	var cosTheta = Math.cos(rotAngle);
	var offX= x*cosTheta + y*sinTheta;
	var offY = y*cosTheta - x*sinTheta;
	this.camAxisX = this.camAxisX - x;
	this.camAxisY = this.camAxisY - y;
	var posX = position.x + offX;
	var posY = position.y + offY;
	this.camera.x = this.centerX - posX;
	this.camera.y = this.centerY - posY;
	this.camera.depth += z;
};

VC.prototype.setPosition = function(x, y, z) {
	z = typeof z !== 'undefined' ? z : 0;

	const MAX_X = 10000;
	const MIN_X = -10000;
	const MAX_Y = 10000;
	const MIN_Y = -10000;
	const MAX_Z = 10000;
	const MIN_Z = -5000;

	if(x > MAX_X)
	  x = MAX_X;
	else if(x < MIN_X)
	  x = MIN_X;
	if(y > MAX_Y)
	  y = MAX_Y;
	else if(y < MIN_Y)
	  y = MIN_Y;
	if(z > MAX_Z)
	  z = MAX_Z;
	else if(z < MIN_Z)
	  z = MIN_Z;

	var rotAngle = this.getRotation()*Math.PI/180;
	var sinTheta = Math.sin(rotAngle);
	var cosTheta = Math.cos(rotAngle);
	var offX= x*cosTheta + y*sinTheta;
	var offY = y*cosTheta - x*sinTheta;
	
	this.camAxisX = this.centerX - x;
	this.camAxisY = this.centerY - y;
	this.camera.x = this.centerX - offX;
	this.camera.y = this.centerY - offY;
	this.camera.depth = z;
};

VC.prototype.getPosition = function() {
	var loc = new Object();
	loc['x'] = this.centerX - this.camAxisX;
	loc['y'] = this.centerY - this.camAxisY;
	loc['z'] = this.camera.depth;
	return loc;
};

VC.prototype.resetPosition = function() {
	this.setPosition(0, 0);
};

VC.prototype.zoomBy = function(zoom) {
	this.setZoom( (this.getZoom() * zoom) / 100);
};

VC.prototype.setZoom = function(zoom) {
	const MAX_zoom = 10000;
	const MIN_zoom = 1;
	if(zoom > MAX_zoom)
	zoom = MAX_zoom;
	else if(zoom < MIN_zoom)
	zoom = MIN_zoom;
	this.camera.scaleX = 100 / zoom;
	this.camera.scaleY = 100 / zoom;
};

VC.prototype.getZoom = function() {
	return 100 / this.camera.scaleX;
};

VC.prototype.resetZoom = function() {
	this.setZoom(100);
};

VC.prototype.rotateBy = function(angle) {
	this.setRotation( this.getRotation() + angle );
};

VC.prototype.setRotation = function(angle) {
	const MAX_angle = 180;
	const MIN_angle = -179;
	if(angle > MAX_angle)
		angle = MAX_angle;
	else if(angle < MIN_angle)
		angle = MIN_angle;
	this.camera.rotation = -angle;
};

VC.prototype.getRotation = function() {
	return -this.camera.rotation;
};

VC.prototype.resetRotation = function() {
	this.setRotation(0);
};

VC.prototype.reset = function() {
	this.resetPosition();
	this.resetZoom();
	this.resetRotation();
	this.unpinCamera();
};
VC.prototype.setZDepth = function(zDepth) {
	const MAX_zDepth = 10000;
	const MIN_zDepth = -5000;
	if(zDepth > MAX_zDepth)
		zDepth = MAX_zDepth;
	else if(zDepth < MIN_zDepth)
		zDepth = MIN_zDepth;
	this.camera.depth = zDepth;
}
VC.prototype.getZDepth = function() {
	return this.camera.depth;
}
VC.prototype.resetZDepth = function() {
	this.camera.depth = 0;
}

VC.prototype.pinCameraToObject = function(obj, offsetX, offsetY, offsetZ) {

	offsetX = typeof offsetX !== 'undefined' ? offsetX : 0;

	offsetY = typeof offsetY !== 'undefined' ? offsetY : 0;

	offsetZ = typeof offsetZ !== 'undefined' ? offsetZ : 0;
	if(obj === undefined)
		return;
	this.camera.pinToObject = obj;
	this.camera.pinToObject.pinOffsetX = offsetX;
	this.camera.pinToObject.pinOffsetY = offsetY;
	this.camera.pinToObject.pinOffsetZ = offsetZ;
};

VC.prototype.setPinOffset = function(offsetX, offsetY, offsetZ) {
	if(this.camera.pinToObject != undefined) {
	this.camera.pinToObject.pinOffsetX = offsetX;
	this.camera.pinToObject.pinOffsetY = offsetY;
	this.camera.pinToObject.pinOffsetZ = offsetZ;
	}
};

VC.prototype.unpinCamera = function() {
	this.camera.pinToObject = undefined;
};
VC.prototype.___getCamPosition___ = function() {
	var loc = new Object();
	loc['x'] = this.centerX - this.camera.x;
	loc['y'] = this.centerY - this.camera.y;
	loc['z'] = this.depth;
	return loc;
};

this.getCamera = function(timeline) {
	timeline = typeof timeline !== 'undefined' ? timeline : null;
	if(timeline === null) timeline = exportRoot;
	if(_camera[timeline] == undefined)
	_camera[timeline] = new VC(timeline);
	return _camera[timeline];
}

this.getCameraAsMovieClip = function(timeline) {
	timeline = typeof timeline !== 'undefined' ? timeline : null;
	if(timeline === null) timeline = exportRoot;
	return this.getCamera(timeline).camera;
}
}


// Layer depth API : 

an.Layer = new function() {
	this.getLayerZDepth = function(timeline, layerName)
	{
		if(layerName === "Camera")
		layerName = "___camera___instance";
		var script = "if(timeline." + layerName + ") timeline." + layerName + ".depth; else 0;";
		return eval(script);
	}
	this.setLayerZDepth = function(timeline, layerName, zDepth)
	{
		const MAX_zDepth = 10000;
		const MIN_zDepth = -5000;
		if(zDepth > MAX_zDepth)
			zDepth = MAX_zDepth;
		else if(zDepth < MIN_zDepth)
			zDepth = MIN_zDepth;
		if(layerName === "Camera")
		layerName = "___camera___instance";
		var script = "if(timeline." + layerName + ") timeline." + layerName + ".depth = " + zDepth + ";";
		eval(script);
	}
	this.removeLayer = function(timeline, layerName)
	{
		if(layerName === "Camera")
		layerName = "___camera___instance";
		var script = "if(timeline." + layerName + ") timeline.removeChild(timeline." + layerName + ");";
		eval(script);
	}
	this.addNewLayer = function(timeline, layerName, zDepth)
	{
		if(layerName === "Camera")
		layerName = "___camera___instance";
		zDepth = typeof zDepth !== 'undefined' ? zDepth : 0;
		var layer = new createjs.MovieClip();
		layer.name = layerName;
		layer.depth = zDepth;
		layer.layerIndex = 0;
		timeline.addChild(layer);
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused || stageChild.ignorePause){
			stageChild.syncStreamSounds();
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;