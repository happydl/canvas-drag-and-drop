// init data
const config = {
    columnWidth: 120,
    columnGapWidth: 10,
    columnMinHeight: 50,
    taskWidth: 80,
    taskHeight: 40,
    taskGapHeight: 10,
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


/** game state enum */
const TaskState = Object.freeze({
    NORMAL: Symbol("red"),
    PRESSED: Symbol("blue"),
    GREEN: Symbol("green")
});


/** task in column */
class Task extends Shape {

    constructor(title, tag) {
        super();
        this.title = title;
        this.tag = tag;
        this.state = '', 'pressed'
    }

    draw() {
        const ctx = document.getElementById('canvas').getContext('2d');
        ctx.save()
        ctx.fillStyle = config.taskBackGroundColor;
        ctx.fillRect(this.transform.x, this.transform.y, config.columnWidth - config.taskGapHeight * 2, config.taskHeight);
        ctx.restore();
    }

    /** check whether this task is hit */
    checkHit(cx, cy) {
        return false;
    }

    /**
     * draw the floating task while being held by mouse
     * @date 2022-10-03
     * @param {number} cursorX - cursor x position 
     * @param {number} cursorY - cursor y position 
     */
    drawFloat(cursorX, cursorY) {

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
        for (let i = 0; i < this.taskList.length; i++) {
            let xTask = this.transform.x + config.taskGapHeight;
            this.taskList[i].transform.x = xTask;
            this.taskList[i].transform.y = i * (config.taskHeight + config.taskGapHeight) + config.taskGapHeight;
            this.taskList[i].draw();
        }

        ctx.restore();
    }

    /** check whether this column is hit */
    checkHit(cx, cy) {
        
    }

}

/** game state enum */
const GameState = Object.freeze({
    NORMAL: Symbol("normal"),
    SELECTED: Symbol("selected"),
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
        this.selectedTask = null; // selected task

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

    sendMessage(message, event) {
        // console.log(message, event);

        

    }

    update() {

    }

    render() {

        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext('2d');

        // clear rect
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw columns
        for (let i = 0; i < this.columnList.length; i++) {
            let xStart = i * this.config.columnGapWidth + i * this.config.columnWidth;
            let yStart = 0;
            this.columnList[i].transform.x = xStart;
            this.columnList[i].transform.y = yStart;
            this.columnList[i].draw();
        }

        // draw the selected task
        if (this.selectedTask) {
            this.selectedTask.drawFloat();
        }

    }
}


((function () {


    canvas.addEventListener('mousemove', (e) => {
        GameController.instance.sendMessage('mousemove', e);
    });

    // canvas.addEventListener('click', (e) => {
    //     GameController.instance.sendMessage('click', e);
    // });

    // for mousedown
    canvas.onmousedown = function (e) {
        GameController.instance.sendMessage('mousedown', e);
    }

    // for mouseup
    canvas.onmouseup = function (e) {
        GameController.instance.sendMessage('mouseup', e);
    }

    canvas.addEventListener('mouseout', (e) => {
        GameController.instance.sendMessage('mouseout', e);
    });

    function mainLoop() {
        requestAnimationFrame(mainLoop)
        GameController.instance.update();
        GameController.instance.render();
    }
    mainLoop();
})());
