(function () {
    var canvas = {},
        image = {},
        particles = [],
        requestId,
        readyFlag,
        speed;

    document.getElementById('begin').addEventListener('click',function(){
        if(readyFlag){
            speed = Math.abs(parseInt(document.getElementById('speed').value));
            if(speed){
                document.getElementById('comments').innerText = 'speed = ' + speed;
            }else{
                document.getElementById('comments').innerText = 'Invalid speed , move as speed = 100'
                speed = 100;
            }
            particles = [],
            calculate();
            requestId = requestAnimationFrame(draw)
        } else{
            alert('Not Ready');
        }
    });
    function calculate() {
        var cols = 150,
            rows = 100;
        var s_width = parseInt(image.w / cols),
            s_height = parseInt(image.h / rows);
        var pos;
        //console.log(image.h);
        //console.log(cols,rows);
        //console.log(s_width, s_height);
        for (var i = 1; i < image.w; i++) {
            for (var j = 1; j < image.h; j++) {
                pos = (i * s_width + j * s_height * image.w) * 4;

                //pos = (i + j * image.w) * 4;
                if (image.imageData[pos + 3] > 0) {
                    var particle = {
                        x: image.x + i * s_width + (Math.random() - 0.5) * 10,
                        y: image.y + j * s_height + (Math.random() - 0.5 ) * 10,
                        initX: image.x + Math.random() * 170,
                        initY: image.y + Math.random() * 115,
                        currX: null,
                        currY: null,
                        //x: image.x + i,
                        //y: image.y + j,
                        fillStyle: '#000'
                    };
                    particles.push(particle);
                }
            }
        }

    }

    function draw() {
        var len = particles.length, curr_particle = null;
        if (Math.abs(particles[len - 1].currX - particles[len - 1].x) < 1 && Math.abs(particles[len - 1].currY - particles[len - 1].y) < 2) {
            cancelAnimationFrame(requestId);
            return;
        } else {
            canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);
            for (var i = 0; i < len; i++) {
                curr_particle = particles[i];
                var speedX = (curr_particle.x - curr_particle.initX) / speed;
                var speedY = (curr_particle.y - curr_particle.initY) / speed;
                if (curr_particle.currX) {
                    curr_particle.currX = curr_particle.currX + speedX;
                    curr_particle.currY = curr_particle.currY + speedY;
                } else {
                    curr_particle.currX = curr_particle.initX + speedX;
                    curr_particle.currY = curr_particle.initY + speedY;
                }
                canvas.ctx.fillRect(curr_particle.currX, curr_particle.currY, 1, 1);
            }
            requestId = requestAnimationFrame(draw)
        }

    }

    //获取canvas元素
    canvas.obj = document.getElementById('myCanvas');

    if (canvas.obj.getContext) {

        //获取渲染上下文
        canvas.ctx = canvas.obj.getContext('2d');

        //设置画布大小为屏幕宽高
        canvas.w = canvas.obj.width = document.body.clientWidth;
        canvas.h = canvas.obj.height = document.body.clientHeight;

        //新建一个image对象
        var img = new Image();

        //图像加载完后
        img.onload = function () {
            console.log('loaded');
            //把图像信息保存在image里面
            image.obj = img;
            image.w = img.width;
            image.h = img.height;
            image.x = parseInt(canvas.w / 2 - image.w / 2);
            image.y = 200;
            console.log(image.x, image.y, image.w, image.h);

            //把图像绘制到画布坐标为(100,100)的地方
            canvas.ctx.drawImage(image.obj, image.x, image.y, image.w, image.h);
            image.imageData = canvas.ctx.getImageData(image.x, image.y, image.w, image.h).data;
            canvas.ctx.clearRect(0, 0, canvas.w, canvas.h);
            calculate();
            readyFlag = true;
            //requestId = requestAnimationFrame(draw);
        };

        //设置image的source
        img.src = 'img/go.png';

    }
}());