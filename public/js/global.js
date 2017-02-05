var canvas = document.getElementById('smoke');
var ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

    
window.addEventListener('resize', function(){
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}, true);

var smoke = smokemachine(ctx, [180, 180, 180]);

    smoke.start();

    onmousemove = function (e) {
        var x = e.clientX
        var y = e.clientY
        var n = .5
        var t = Math.floor(Math.random() * 200) + 3800
        smoke.addsmoke(x, y, n, t)
    }

function addSmoke(){
    smoke.addsmoke(Math.floor(Math.random() * innerWidth) + 1, Math.floor(Math.random() * innerHeight) + 1 , 1);

    window.requestAnimationFrame(addSmoke);
}


window.requestAnimationFrame(addSmoke);
