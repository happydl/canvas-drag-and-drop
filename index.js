// init data
const config = {
    volumeWidth: 100,
    volumeGapWidth: 10,
    taskWidth: 80,
    taskHeight: 40,
    data: {
        volumes: [
            {
                name: "V1",
                tasks: ["ABC", "DEF", "GHI"]
            },
            {
                name: "V2",
                tasks: ["Dog", "Cat", "Pig"]
            },
            {
                name: "V3",
                tasks: ["Building", "Garden", "Tree"]
            }
        ]
    }
}


class Transform {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Shape {
    constructor() {
        this.transform = new Transform(0, 0);
    }

    draw() {
        console.error("Shape::draw() not implemented!");
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

/** game state enum */
const State = Object.freeze({
    RED: Symbol("red"),
    BLUE: Symbol("blue"),
    GREEN: Symbol("green")
});

class GameController {
    static _instance = null
    static get instance() {
        if (!this._instance) {
            this._instance = new GameController(config);
        }
        return this._instance;
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

    /**
     * @date 2022-10-02
     * @param {Array} data
     */
    loadData(data) {

        // let v1 = new Volume();
        // v1.taskList.push(new Task());

        // data.forEach(vol => {
        //     let v = new Volume();
        //     vol.forEach(task => {

        //     });
        // });

        // for (vol in data) {

        // }

    }

    update() {

    }

    render() {

        const ctx = document.getElementById('canvas').getContext('2d');
        ctx.fillStyle = '#FD0';
        ctx.fillRect(0, 0, 75, 75);

    }
}



((function () {
    function mainLoop() {
        requestAnimationFrame(mainLoop)
        GameController.instance.update();
        GameController.instance.render();
    }
    mainLoop();
})());
