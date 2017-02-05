var canvas = document.getElementById('smoke')
var ctx = canvas.getContext('2d')
canvas.width = 1000
canvas.height = 1000

var smoke = smokemachine(ctx, [54, 16.8, 18.2])

smoke.start()
smoke.addsmoke(500,500,10)

setTimeout(function(){

    smoke.stop()

    smoke.addsmoke(600,500,100)
    smoke.addsmoke(500,600,20)

    for(var i=0;i<10;i++){
        smoke.step(10)
    }

    setTimeout(function(){
        smoke.start()
    },1000)

},1000)