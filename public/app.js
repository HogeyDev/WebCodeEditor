let socket = io();

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

    this.lineCounter = document.body.appendChild(
      document.createElement("input")
    );
    this.lineCounter.type = "text";
    this.lineCounter.style.left = this.x + "px";
    this.lineCounter.style.top = this.y + "px";
    this.lineCounter.style.width = this.width + "px";
    this.lineCounter.style.height = this.height + "px";
    this.lineCounter.spellcheck = false;
    this.updateLineCount();

    this.htmlElement = document.body.appendChild(
      document.createElement("input")
    );
    this.htmlElement.type = "text";
    this.htmlElement.style.left = this.x + "px";
    this.htmlElement.style.top = this.y + "px";
    this.htmlElement.style.width = this.width;
    this.htmlElement.style.height = this.height;
    this.htmlElement.spellcheck = false;

    this.setBackgroundColor("background");
    this.setFontColor("foreground");

    this.removeBorder();
    this.setBorderWeight();
  }
  updateLineCount() {
    this.lineCounter.value = this.htmlElement.value.split(/\r\n|\r|\n/).length;

    this.htmlElement.style.left =
      this.x +
      parseInt(
        this.lineCounter.width.slice(0, this.lineCounter.width.length - 2)
      ) +
      "px";
    this.htmlElement.style.width =
      this.width -
      parseInt(
        this.lineCounter.width.slice(0, this.lineCounter.width.length - 2)
      ) +
      "px";

    console.log(this.lineCounter.value);
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
  getCssVariableName(name) {
    return `var(--${name})`;
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
    this.htmlElement.style.backgroundColor = this.getCssVariableName(
      this.backgroundColor
    );
    this.htmlElement.style.color = this.getCssVariableName(this.fontColor);
  }
}

let text = new TextBox(20, 20, 300, 100);
