var canvas = document.getElementById('smoke');
var ctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 1000;

var smoke = smokemachine(ctx, [54, 16.8, 18.2]);

    smoke.start();

    onmousemove = function (e) {
        var x = e.clientX
        var y = e.clientY
        var n = .5
        var t = Math.floor(Math.random() * 200) + 3800
        smoke.addsmoke(x, y, n, t)
    }

    setInterval(function(){
        smoke.addsmoke(innerWidth/2, innerHeight, 1);
    }, 100)