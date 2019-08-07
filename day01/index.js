(function () {
    function prepare() {
        // load img task
       const imgTask = (img,src)=>{
           new Promise((resolve,reject)=>{
               img.onload = resolve;
               img.onerror = reject;
               img.src = src;
           })
       };
       const context = document.getElementById('content').getContext('2d');
       const heroImg  = new Image();
       const allSpriteImg = new Image();

       const allResourceTask = Promise.all([
           imgTask(heroImg,'./hero.png'),
           imgTask(allSpriteImg,'./all.jpg')
       ]);

       return {
           getResource(callBack){
               allResourceTask.then(()=>{
                   callBack && callBack(context,heroImg,allSpriteImg)
               })
           }
       }
    }

    function drawHero(context, heroImg, allSpriteImg) {

        var draw = function () {
            this.context
                .drawImage(
                    this.img,
                    this.imgPos.x,
                    this.imgPos.y,
                    this.imgPos.width,
                    this.imgPos.height,
                    this.rect.x,
                    this.rect.y,
                    this.rect.width,
                    this.rect.height
                );
        };

        function move(dir, monsterRect, canvasScope) {
            switch (dir) {
                case 'down':
                    if (this.rect.y + this.rect.height < canvasScope.height) {
                        if (!(this.rect.x >= monsterRect.x - this.rect.width && this.rect.x <= monsterRect.x + monsterRect.width && this.rect.y >= monsterRect.y - this.rect.height && this.rect.y <= monsterRect.y)) {
                            this.context
                                .clearRect(
                                    this.rect.x,
                                    this.rect.y,
                                    this.rect.width,
                                    this.rect.height,
                                );
                            this.context
                                .drawImage(
                                    this.img,
                                    this.imgPos.x,
                                    this.imgPos.y,
                                    this.imgPos.width,
                                    this.imgPos.height,
                                    this.rect.x,
                                    this.rect.y += 5,
                                    this.rect.width,
                                    this.rect.height,
                                );
                        }
                    }
                    break;
                case 'up':
                    if (this.rect.y > 0) { // 画布上边界
                        if (!(this.rect.x >= monsterRect.x - this.rect.width && this.rect.x <= monsterRect.x + monsterRect.width && this.rect.y >= monsterRect.y + monsterRect.height && this.rect.y <= monsterRect.y + monsterRect.height)) {
                            this.context
                                .clearRect(
                                    this.rect.x,
                                    this.rect.y,
                                    this.rect.width,
                                    this.rect.height,
                                );
                            this.context
                                .drawImage(
                                    this.img,
                                    this.imgPos.x,
                                    this.imgPos.y,
                                    this.imgPos.width,
                                    this.imgPos.height,
                                    this.rect.x,
                                    this.rect.y -= 5,
                                    this.rect.width,
                                    this.rect.height,
                                );
                        }
                    }
                    break;
                case 'left':
                    if (this.rect.x > 0) { // 画布左边界
                        if (!(this.rect.x >= monsterRect.x + monsterRect.width && this.rect.x <= monsterRect.x + monsterRect.width && this.rect.y >= monsterRect.y - this.rect.height && this.rect.y <= monsterRect.y + monsterRect.height)) {
                            this.context
                                .clearRect(
                                    this.rect.x,
                                    this.rect.y,
                                    this.rect.width,
                                    this.rect.height,
                                );
                            this.context
                                .drawImage(
                                    this.img,
                                    this.imgPos.x,
                                    this.imgPos.y,
                                    this.imgPos.width,
                                    this.imgPos.height,
                                    this.rect.x -= 5,
                                    this.rect.y,
                                    this.rect.width,
                                    this.rect.height,
                                );
                        }
                    }
                    break;
                case 'right':
                    if (this.rect.x + this.rect.width < canvasScope.width) { // 画布右边界
                        if (!(this.rect.x >= monsterRect.x - this.rect.width && this.rect.x <= monsterRect.x && this.rect.y >= monsterRect.y - this.rect.height && this.rect.y <= monsterRect.y + monsterRect.height)) {
                            this.context
                                .clearRect(
                                    this.rect.x,
                                    this.rect.y,
                                    this.rect.width,
                                    this.rect.height,
                                );
                            this.context
                                .drawImage(
                                    this.img,
                                    this.imgPos.x,
                                    this.imgPos.y,
                                    this.imgPos.width,
                                    this.imgPos.height,
                                    this.rect.x += 5,
                                    this.rect.y,
                                    this.rect.width,
                                    this.rect.height,
                                );
                        }
                    }
                    break;
                default:
                    break;
            }
        }


        var hero = {
            img: heroImg,
            context: context,
            imgPos: {
                x: 0,
                y: 0,
                width: 32,
                height: 32
            },

            rect: {
                x: 0,
                y: 0,
                width: 40,
                height: 40
            },

            draw: draw,
            move:move,
        };

        function getRect() {
            return this.rect;
        }

        var monster = {
            img: allSpriteImg,
            context: context,
            imgPos: {
                x: 858,
                y: 529,
                width: 32,
                height: 32
            },

            rect: {
                x: 100,
                y: 100,
                width: 40,
                height: 40
            },

            draw: draw,
            getRect: getRect,
        };

        hero.draw();
        monster.draw();

        document.addEventListener('keydown', (e) => {
            if (e) {
                if (e.keyCode === 37) { // 左
                    hero.move('left', monster.getRect(), { width: 500, height: 300 }); // 方向键 怪物区域 画布区域
                }
                if (e.keyCode === 38) { // 上
                    hero.move('up', monster.getRect(), { width: 500, height: 300 });
                }
                if (e.keyCode === 40) { // 下
                    hero.move('down', monster.getRect(), { width: 500, height: 300 });
                }
                if (e.keyCode === 39) { // 右
                    hero.move('right', monster.getRect(), { width: 500, height: 300 });
                }
            }
        });

    }


    var resourceManager = prepare();
    resourceManager.getResource(drawHero)

})();
