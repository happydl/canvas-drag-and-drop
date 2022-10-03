// init data
const config = {
    volumeWidth:100,
    volumeGapWidth:10,
    taskWidth:80,
    taskHeight:40,
    data:[
        ["ABC", "DEF", "GHI"],
        ["Dog", "Cat", "Pig"],
        ["Building", "Garden", "Tree"],
    ]
}


class Transform {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Shape {
    constructor() {
        
    }

    draw() {
        console.error("draw() not implemented!");
    }
}



/** task in volume */
class Task extends Shape {

    constructor(title, tag) {
        super();
        this.title = title;
        this.tag = tag;
    }

    draw() {

    }
}

class Volume extends Shape {
    constructor() {
        super();
        this.taskList = [];
    }

    draw() {

    }
}


class GameController {
    static instance = null
    static getInstance() {
        if (!this.instance) {
            this.instance = new GameController(config);
        }
        return this.instance;
    }

    constructor(config) {
        this.volumeList = [];
        if (config) {
            this.config = config;
            if (config.data) {
                this.loadData(config.data);
            }
        }
    }

    loadData(data) {

        // let v1 = new Volume();
        // v1.taskList.push(new Task());

    }

    update() {

    }

    render() {

        const ctx = document.getElementById('canvas').getContext('2d');
        ctx.fillStyle = '#FD0';
        ctx.fillRect(0, 0, 75, 75);

    }
}



((function(){
    function mainLoop() {
        requestAnimationFrame(mainLoop)
        GameController.getInstance().update();
        GameController.getInstance().render();
    }
    mainLoop();
})());
