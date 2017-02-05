(function(){

    function DeanTown(){
        this.video = null;
        this.audioReady = false;
        this.videoReady = false;

        this.audioHasStarted = false;
        this.startedAt = 0;
        this.pausedAt = 0;
        this.playing = false;
    }

    DeanTown.prototype.init = function(){

    };

    DeanTown.prototype.playAll = function(){
        this.startVideo();
    };


    DeanTown.prototype.play = function(){
        var sourceNode = this.audioCtx.createBufferSource();
            sourceNode.connect(this.audioCtx.destination);
            sourceNode.buffer = this.audioFileBuffer;
            sourceNode.start(0, this.pausedAt);

        this.player.seekTo(this.pausedAt); 
        this.player.playVideo();

        this.startedAt = this.audioCtx.currentTime - this.pausedAt;
        this.pausedAt = 0;
        this.playing = true;
    };

    DeanTown.prototype.pause = function(pauseVideo){
        var elapsed = this.audioCtx.currentTime - this.startedAt;

        this.stop();
        this.pausedAt = elapsed;
        if(pauseVideo) this.player.pauseVideo();
    };

    DeanTown.prototype.stop = function() {
        if (this.source) {
            this.source.disconnect();
            this.source.stop(0);
            this.source = null;
        }
        this.pausedAt = 0;
        this.startedAt = 0;
        this.playing = false;
    };

    /*
    * Video Methods
    */

    DeanTown.prototype.initVideo = function(){
        this.video = new YT.Player('video', {
            autoplay: false,
            events: {
                'onReady': function(event){
                    window.DeanTown.player = event.target;
                    window.DeanTown.player.setVolume(0);
                    window.DeanTown.videoReady = true;
                },
                'onStateChange': function(event){
                    var status = event.data;

                    console.log(event, status);

                    if (status == -1) {
                        //Unstarted
                    } else if (status == 0) {
                        //Ended
                    } else if (status == 1) {
                        //Playing
                        window.DeanTown.play();
                    } else if (status == 2) {
                        //Paused
                        window.DeanTown.pause();
                    } else if (status == 3) {
                        //Buffering
                        window.DeanTown.pause();
                    } else if (status == 5) {
                        //Cued
                    }
                }
            }
        });
    };

    DeanTown.prototype.startVideo = function(){
        this.player.playVideo();
    };

    /*
    * Audio Methods
    */

    DeanTown.prototype.initAudio = function(){
        var self = this;
        var request = new XMLHttpRequest();

        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.source = this.audioCtx.createBufferSource();

        request.open('GET', 'public/mp3/deantown.mp3', true);
        request.responseType = 'arraybuffer';

        request.onload = function() {
            self.audioFile = request.response;
               self.audioCtx.decodeAudioData(self.audioFile, function(buffer) {
                    self.audioFileBuffer = buffer;
                    self.source.buffer = buffer;
                    self.source.connect(self.audioCtx.destination);
                    self.source.loop = true;
                    self.audioReady = true;
                }, function(e) {
                    console.log('Audio error! ', e);
                });
        }

        request.send();
    };

    DeanTown.prototype.startAudio = function(){
        window.DeanTown.source.start(0);
        window.DeanTown.audioHasStarted = true;
    };


    DeanTown.prototype.playAudio = function(){
        var self = this;
        var offset = this.pausedAt;

        window.DeanTown.source.start(window.DeanTown.player.getCurrentTime());
        window.DeanTown.audioHasStarted = true;
    };

    DeanTown.prototype.pauseAudio = function(){
        var self = this;
        if(window.DeanTown.audioHasStarted){
            window.DeanTown.source.stop();
            this.audioReady = false;

            this.source = this.audioCtx.createBufferSource();

            this.audioCtx.decodeAudioData(this.audioFile, function(buffer) {
                self.source.buffer = buffer;
                self.source.connect(self.audioCtx.destination);
                self.source.loop = true;
                self.audioReady = true;
            }, function(e) {
                console.log('Audio error! ', e);
            });
        }
    };

    /*
    * Smoke Methods
    */

    DeanTown.prototype.initSmoke = function(){
        this.canvas = document.getElementById('smoke');
        this.canvasCtx = this.canvas.getContext('2d');

        this.canvas.width = innerWidth;
        this.canvas.height = innerHeight;

        this.smoke = smokemachine(this.canvasCtx, [180, 180, 180]);

        this.smoke.start();

        onmousemove = function (e) {
            var x = e.clientX
            var y = e.clientY
            var n = .5
            var t = Math.floor(Math.random() * 200) + 3800
            window.DeanTown.smoke.addsmoke(x, y, n, t)
        }

        window.requestAnimationFrame(window.DeanTown.addRandomSmoke);
    };

    DeanTown.prototype.addRandomSmoke = function(){
        if(!window.DeanTown.smoke){
            return;
        }

        window.DeanTown.smoke.addsmoke(Math.floor(Math.random() * innerWidth) + 1, Math.floor(Math.random() * innerHeight) + 1 , 1);

        window.requestAnimationFrame(window.DeanTown.addRandomSmoke);
    };

    DeanTown.prototype.resetCanvasSize = function(){
        this.canvas.width = innerWidth;
        this.canvas.height = innerHeight;
    };


    window.DeanTown = new DeanTown();

    function onYouTubeIframeAPIReady() {
        console.log("YT API READY");
        window.DeanTown.initVideo();
        window.DeanTown.initAudio();
        window.DeanTown.initSmoke();
    }

    window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

    window.checkAudioVideo = setInterval(function(){
        if(window.DeanTown.audioReady && window.DeanTown.videoReady){
            window.DeanTown.playAll();
            clearInterval(window.checkAudioVideo);
        }
    }, 300);

    window.addEventListener('resize', function(){
        window.DeanTown.resetCanvasSize();
    }, true);

})();