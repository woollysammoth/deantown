(function(){

    function DeanTown(){
        this.video = null;
        this.audioReady = false;
        this.videoReady = false;
    }

    DeanTown.prototype.init = function(){

    };

    DeanTown.prototype.playAll = function(){
        this.startAudio();
        this.startVideo();
    };

    /*
    * Video Methods
    */

    DeanTown.prototype.initVideo = function(){
        this.video = new YT.Player('#video', {
            autoplay: false,
            events: {
                'onReady': this.onVideoReady,
                'onStateChange': this.onVideoStateChange
            }
        });
    };

    DeanTown.prototype.startVideo = function(){
        this.video.playVideo();
    };

    DeanTown.prototype.onVideoReady = function(event){
        this.videoReady = true;
    };

    DeanTown.prototype.onVideoStateChange = function(event){
        var status = event.data;

        if (status == -1) {
            //Unstarted
        } else if (status == 0) {
            //Ended
        } else if (status == 1) {
            //Playing
            this.playAudio();
        } else if (status == 2) {
            //Paused
            this.pauseAudio();
        } else if (status == 3) {
            //Buffering
            this.pauseAudio();
        } else if (status == 5) {
            //Cued
        }
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
            self.audioCtx.decodeAudioData(request.response, function(buffer) {
                self.source.buffer = buffer;
                self.source.connect(audioContext.destination);
                self.source.loop = true;
                self.audioReady = true;
            }, function(e) {
                console.log('Audio error! ', e);
            });
        }

        request.send();
    };

    DeanTown.prototype.startAudio = function(){
        this.source.start(0);
    };

    DeanTown.prototype.playAudio = function(){
        this.source.play();
    };

    DeanTown.prototype.pauseAudio = function(){
        this.source.pause();
    };

    /*
    * Smoke Methods
    */

    DeanTown.prototype.initSmoke = function(){
        var canvas = document.getElementById('smoke');
        var ctx = canvas.getContext('2d');

        canvas.width = innerWidth;
        canvas.height = innerHeight;

        this.smoke = smokemachine(ctx, [180, 180, 180]);

        this.smoke.start();

        onmousemove = function (e) {
            var x = e.clientX
            var y = e.clientY
            var n = .5
            var t = Math.floor(Math.random() * 200) + 3800
            DeanTown.smoke.addsmoke(x, y, n, t)
        }

        window.requestAnimationFrame(this.addRandomSmoke);
    };

    DeanTown.prototype.addRandomSmoke = function(){
        if(!DeanTown.smoke){
            return;
        }

        DeanTown.smoke.addsmoke(Math.floor(Math.random() * innerWidth) + 1, Math.floor(Math.random() * innerHeight) + 1 , 1);

        window.requestAnimationFrame(DeanTown.addRandomSmoke);
    };

    DeanTown.prototype.resetCanvasSize = function(){
        this.canvas.width = innerWidth;
        this.canvas.height = innerHeight;
    };


    DeanTown = new DeanTown();

    function onYouTubeIframeAPIReady() {
        console.log("YT API READY");
        DeanTown.initVideo();
        DeanTown.initSmoke();
    }

    window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

    window.checkAudioVideo = setInterval(function(){
        if(DeanTown.audioReady && DeanTown.videoReady){
            DeanTown.playAll();
            clearInterval(window.checkAudioVideo);
        }
    }, 300);

    window.addEventListener('resize', function(){
        DeanTown.resetCanvasSize();
    }, true);

})();