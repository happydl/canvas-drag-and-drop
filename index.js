// init data
const config = {
    columnWidth: 120,
    columnGapWidth: 10,
    columnMinHeight:50,
    taskWidth: 80,
    taskHeight: 40,
    taskGapHeight:10,
    data: {
        columns: [
            {
                name: "V1",
                tasks: ["ABC", "DEF", "GHI"]
            },
            {
                name: "V2",
                tasks: ["Dog", "Cat", "Pig", "Tree", "Flower"]
            },
            {
                name: "V3",
                tasks: ["Building", "Garden"]
            }
        ]
    },
    columnBackGroundColor: '#FD0',
    taskBackGroundColor: 'white'
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



/** task in column */
class Task extends Shape {

    constructor(title, tag) {
        super();
        this.title = title;
        this.tag = tag;
    }

    draw() {
        const ctx = document.getElementById('canvas').getContext('2d');
        ctx.save()
        ctx.fillStyle = config.taskBackGroundColor;
        ctx.fillRect(this.transform.x, this.transform.y, config.columnWidth - config.taskGapHeight * 2, config.taskHeight);
        ctx.restore();
    }
}

class Column extends Shape {
    constructor() {
        super();
        this.taskList = [];
    }

    draw() {

        const ctx = document.getElementById('canvas').getContext('2d');
        ctx.save()

        ctx.fillStyle = config.columnBackGroundColor;

        // calculate height of this column
        let volHeight = this.taskList.length * config.taskHeight;

        // # of gaps is # of tasks - 1
        if (this.taskList.length > 0) {
            volHeight += (this.taskList.length + 1) * config.taskGapHeight;
        }

        // set height to min height if the column is empty
        volHeight = Math.max(volHeight, config.columnMinHeight);

        ctx.fillRect(this.transform.x, this.transform.y, config.columnWidth, volHeight);

        // set transform for each task in this column
        for (let i=0; i<this.taskList.length; i++) {
            let xTask = this.transform.x + config.taskGapHeight;
            this.taskList[i].transform.x = xTask;
            this.taskList[i].transform.y = i * (config.taskHeight + config.taskGapHeight) + config.taskGapHeight;
            this.taskList[i].draw();
        }

        ctx.restore();
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
        this.columnList = []; // column list
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

        data.columns.forEach(vol => {
            let v = new Column(vol.name);
            vol.tasks.forEach(taskName => {
                let t = new Task(taskName, "tagA");
                v.taskList.push(t);
            });
            this.columnList.push(v);
        });

    }

    update() {

    }

    render() {

        const ctx = document.getElementById('canvas').getContext('2d');
        

        // draw columns background
        for (let i=0; i<this.columnList.length; i++) {
            let xStart = i * this.config.columnGapWidth + i * this.config.columnWidth;
            let yStart = 0;
            this.columnList[i].transform.x = xStart;
            this.columnList[i].transform.y = yStart;
            this.columnList[i].draw();
        }

        // draw tasks
        // for ()




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
