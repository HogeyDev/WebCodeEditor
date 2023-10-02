let socket = io();

function getCssVariableName(name) {
    return `var(--${name})`;
}

class CanvasTextBox {
    constructor(x, y, width, height, text = "") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.text = text;
        this.fontSize = 12;
        this.cursorPosition = 0;
    }
    preventCursorOutOfBounds() {
        if (this.cursorPosition < 0) this.cursorPosition = 0;
        if (this.cursorPosition > this.text.length)
            this.cursorPosition = this.text.length;
    }
    moveCursor(dx) {
        this.cursorPosition += dx;
        this.preventCursorOutOfBounds();
    }
    addText(text) {
        this.text = [
            this.text.slice(0, this.cursorPosition),
            text,
            this.text.slice(this.cursorPosition),
        ].join("");
        this.moveCursor(text.length);
    }
    deleteCharacter() {
        this.text = [
            this.text.slice(0, this.cursorPosition - 1),
            this.text.slice(this.cursorPosition),
        ].join("");
        this.moveCursor(-1);
    }
    draw(ctx) {
        ctx.fillStyle = "#000000ff";
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = "#ffffffff";
        ctx.fillText(
            this.cursorPosition + "\n" + this.text,
            this.x,
            this.y + this.fontSize
        );
    }
}

class TextBox {
    constructor(x, y, width, height, text = "") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.currentOpenFileName = "";

        this.lineCounter = document.body.appendChild(
            document.createElement("input")
        );
        this.lineCounter.type = "text";
        this.lineCounter.style.left = this.x + "px";
        this.lineCounter.style.top = this.y + "px";
        this.lineCounter.style.width = 50 + "px";
        this.lineCounter.style.height = this.height + "px";
        this.lineCounter.spellcheck = false;

        this.htmlElement = document.body.appendChild(
            document.createElement("textarea")
        );
        // this.htmlElement.type = 'text';
        this.htmlElement.style.left = this.x + "px";
        this.htmlElement.style.top = this.y + "px";
        this.htmlElement.style.width = this.width + "px";
        this.htmlElement.style.height = this.height + "px";
        this.htmlElement.style.resize = "none";
        // this.htmlElement.spellcheck = false;
        // this.htmlElement.rows = 3;
        this.updateLineCount();

        this.setBackgroundColor("background");
        this.setFontColor("foreground");

        this.removeBorder();
        this.setBorderWeight();
    }
    updateLineCount() {
        this.lineCounter.value =
            this.htmlElement.value.split(/\r\n|\r|\n/).length;
        this.htmlElement.style.left =
            this.x + parseInt(this.lineCounter.width) + "px";
        this.htmlElement.style.width =
            this.width - parseInt(this.lineCounter.width) + "px";
    }
    removeBorder() {
        this.htmlElement.style.border = "none";
    }
    setBorderWidth(width) {
        this.borderWidth = width.toString();
        this.updateBorder();
    }
    setBorderWeight(weight) {
        this.borderWeight = weight;
        this.updateBorder();
    }
    updateBorder() {
        this.htmlElement.style.border = `${this.borderWidth} ${this.borderWeight}`;
    }
    setFontColor(color) {
        this.fontColor = color;
        this.updateColors();
    }
    setBackgroundColor(color) {
        this.backgroundColor = color;
        this.updateColors();
    }
    updateColors() {
        this.htmlElement.style.backgroundColor = getCssVariableName(
            this.backgroundColor
        );
        this.htmlElement.style.color = getCssVariableName(this.fontColor);
    }
    loadFile(name, contents) {
        this.htmlElement.value = contents;
        this.currentOpenFileName = name;
    }
}

class FileExplorer {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.htmlElement = document.body.appendChild(
            document.createElement("div")
        );
        this.htmlElement.style.left = this.x + "px";
        this.htmlElement.style.top = this.y + "px";
        this.htmlElement.style.width = this.width + "px";
        this.htmlElement.style.height = this.height + "px";
        this.htmlElement.style.backgroundColor =
            getCssVariableName("background");
        this.htmlElement.style.color = getCssVariableName("foreground");
        this.files = [];
    }
    setFiles(fileList) {
        this.files = fileList;
    }
    addFile(file) {
        this.files.push(file);
    }
    update() {
        for (let i = 0; i < this.files.length; i++) {
            this.htmlElement.innerHTML += `<div style='border: none;' class='file' onclick='openFileInEditor("${this.files[i].type}", "${this.files[i].name}")'>${this.files[i].name}</div><br>`;
        }
    }
}

let text = new TextBox(
    300,
    20,
    window.innerWidth - 300,
    window.innerHeight - 20
);
let fileExplorer = new FileExplorer(0, 20, 300, window.innerHeight - 20);
fileExplorer.addFile({ type: "folder", name: "src/" });
fileExplorer.addFile({ type: "folder", name: "src/include/" });
fileExplorer.addFile({ type: "file", name: "src/include/screen.hpp" });
fileExplorer.addFile({ type: "file", name: "src/main.cpp" });
fileExplorer.update();

function openFileInEditor(type, filename) {
    if (type == "folder") return;
    socket.emit("getFileContents", filename);
    socket.on("getFileContents", (contents) => {
        text.loadFile(filename, contents);
    });
}

let keypresses = [];
document.onkeydown = (event) => {
    if (event.key == "s" && event.ctrlKey) {
        event.preventDefault();
        saveFile();
    }
};

function saveFile() {
    alert(text.htmlElement.value);
    socket.emit(
        "saveFileContents",
        JSON.stringify({
            filename: text.currentOpenFileName,
            contents: text.htmlElement.value,
        })
    );
}

const keybinds = {
    SAVE: ["Control", "s"],
};
