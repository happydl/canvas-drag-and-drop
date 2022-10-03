// init data
const config = {
    columnWidth: 120,
    columnGapWidth: 10,
    columnMinHeight: 25,
    taskGapHeight: 10,
    taskWidth: 100,
    taskHeight: 40,
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
    taskBackGroundColor: 'white',
    taskFloatBackGroundColor: 'red',
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

    /** check whether mouse cursor is in this shape */
    checkHit(cx, cy) {
        console.error('Shape::checkHit() not implemented!')

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
        this.isSelected = false;
    }

    draw() {
        const ctx = document.getElementById('canvas').getContext('2d');
        ctx.save()
        if (!this.isSelected) {
            ctx.fillStyle = config.taskBackGroundColor;
            ctx.fillRect(this.transform.x, this.transform.y, config.columnWidth - config.taskGapHeight * 2, config.taskHeight);
        } else {
            ctx.fillStyle = 'black';
            ctx.fillRect(this.transform.x, this.transform.y, config.columnWidth - config.taskGapHeight * 2, config.taskHeight);
        }
        ctx.restore();
    }

    /**
     * draw the floating task while being moved by mouse
     */
    drawFloat() {
        const offsetX = GameController.instance.offsetX;
        const offsetY = GameController.instance.offsetY;
        const ctx = document.getElementById('canvas').getContext('2d');
        ctx.save()
        ctx.translate(offsetX, offsetY);
        ctx.rotate((Math.PI / 180) * -15);
        ctx.translate(-(offsetX), -(offsetY))
        ctx.fillStyle = config.taskFloatBackGroundColor;
        ctx.fillRect(offsetX - 0.5 * config.taskWidth, offsetY - 0.5 * config.taskHeight, config.taskWidth, config.taskHeight);
        ctx.restore();
    }

    checkHit(cx, cy) {
        if (cx >= this.transform.x && cx <= this.transform.x + (config.columnWidth - 2 * config.taskGapHeight) && cy >= this.transform.y && cy <= this.transform.y + config.taskHeight) {
            return true;
        }
        return false;
    }
}

class Column extends Shape {
    constructor() {
        super();
        this.taskList = [];
        this.height = config.columnMinHeight;
    }

    addTask(task) {
        this.taskList.push(task);
    }

    removeTask(task) {
        this.taskList.splice(this.taskList.indexOf(task), 1);
    }

    draw() {

        const ctx = document.getElementById('canvas').getContext('2d');
        ctx.save()

        ctx.fillStyle = config.columnBackGroundColor;

        // draw background
        ctx.fillRect(this.transform.x, this.transform.y, config.columnWidth, this.height);

        // set transform for each task in this column
        for (let i = 0; i < this.taskList.length; i++) {
            let xTask = this.transform.x + config.taskGapHeight;
            this.taskList[i].transform.x = xTask;
            this.taskList[i].transform.y = i * (config.taskHeight + config.taskGapHeight) + config.taskGapHeight;
            this.taskList[i].draw();
        }

        ctx.restore();
    }

    checkHit(cx, cy) {
        if (cx >= this.transform.x && cx <= this.transform.x + config.columnWidth && cy >= this.transform.y && cy <= this.transform.y + this.height) {
            return true;
        }
        return false;
    }

    calculateHeight() {
        // calculate height of this column
        this.height = this.taskList.length * config.taskHeight;
        // # of gaps is # of tasks - 1
        if (this.taskList.length > 0) {
            this.height += (this.taskList.length + 1) * config.taskGapHeight;
        }
        // set height to min height if the column is empty
        this.height = Math.max(this.height, config.columnMinHeight);
    }

    sortTasks() {
        if (GameController.instance.gameState === GameState.SELECTED) {
            const cond = (task) => task.isSelected === true;
            const curInd = this.taskList.findIndex(cond);
            const tarInd = GameController.instance.offsetY - this.transform.y
        }
    }

    update() {
        this.calculateHeight();
        this.sortTasks();
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
        this.selectedCol = null // selected col
        this.selectedTask = null; // selected task
        this.gameState = GameState.NORMAL; // state
        this.clientX = 0; // cursor pos
        this.clientY = 0;
        this.offsetX = 0;
        this.offsetY = 0;

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

    sendMessage(message, e) {
        // console.log(message, event);

        // state pattern
        switch (this.gameState) {
            case GameState.NORMAL:
                switch (message) {
                    case 'mousedown':
                        console.log('mousedown')
                        // check if a task is selected
                        for (let col of this.columnList) {
                            for (let task of col.taskList) {
                                if (task.checkHit(e.offsetX, e.offsetY)) {
                                    this.offsetX = e.offsetX;
                                    this.offsetY = e.offsetY;
                                    this.selectedTask = task;
                                    this.selectedCol = col;
                                    task.isSelected = true;
                                    this.gameState = GameState.SELECTED; // transition to selected state
                                    break;
                                }
                            }
                        }
                        break;
                    default:
                        break;
                }
                break;

            case GameState.SELECTED:
                switch (message) {
                    case 'mouseout':
                        // finish moving
                        this.selectedTask.isSelected = false;
                        this.selectedTask = null;
                        this.selectedCol = null;
                        this.gameState = GameState.NORMAL;
                        break;
                    case 'mousemove':
                        console.log('mousemove')
                        this.offsetX = e.offsetX;
                        this.offsetY = e.offsetY;
                        // move the task to another column
                        for (let col of this.columnList) {
                            if (col.checkHit(e.offsetX, e.offsetY) && col != this.selectedCol) {
                                console.log('hit')
                                this.selectedCol.removeTask(this.selectedTask);
                                col.addTask(this.selectedTask);
                                this.selectedCol = col;
                            }
                        }
                        break;
                    case 'mouseup':
                        // finish moving
                        this.selectedTask.isSelected = false;
                        this.selectedTask = null;
                        this.selectedCol = null;
                        this.gameState = GameState.NORMAL;
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }

    }

    update() {
        for (let col of this.columnList) {
            col.update();
        }
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

    canvas.onmousedown = function (e) {
        GameController.instance.sendMessage('mousedown', e);
    }

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
