let socket = io();

// const fileExplorer = document.querySelector('.files');
// const codeViewer = document.querySelector('.code');
// const sideBar = document.querySelector('.sidebar');
// const topMenu = document.querySelector('.topmenu');
// const editorActions = document.querySelector('.editoractions');
// const codeActions = document.querySelector('.codeactions');
// const terminal = document.querySelector('.terminal');

// function widthPercent(percent) {
// 	return ((percent / 100) * window.innerWidth).toString() + 'px';
// }

// function heightPercent(percent) {
// 	return ((percent / 100) * window.innerHeight).toString() + 'px';
// }

// start of setting up editor layout

// topMenu.style.left = widthPercent(0);
// topMenu.style.top = heightPercent(0);
// topMenu.style.width = widthPercent(100);
// topMenu.style.height = heightPercent(3);

// sideBar.style.left = widthPercent(0);
// sideBar.style.top = heightPercent(3);
// sideBar.style.width = widthPercent(5);
// sideBar.style.height = heightPercent(97);

// fileExplorer.style.left = widthPercent(5);
// fileExplorer.style.top = heightPercent(3);
// fileExplorer.style.width = widthPercent(20);
// fileExplorer.style.height = heightPercent(97);

// codeViewer.style.left = widthPercent(25);
// codeViewer.style.top = heightPercent(3);
// codeViewer.style.width = widthPercent(75);
// codeViewer.style.height = heightPercent(97);

// sideBar.style.left = widthPercent(0);
// sideBar.style.top = heightPercent(3);
// sideBar.style.width = widthPercent(5);
// sideBar.style.height = heightPercent(100);

// sideBar.style.left = widthPercent(0);
// sideBar.style.top = heightPercent(3);
// sideBar.style.width = widthPercent(5);
// sideBar.style.height = heightPercent(100);

// sideBar.style.left = widthPercent(0);
// sideBar.style.top = heightPercent(3);
// sideBar.style.width = widthPercent(5);
// sideBar.style.height = heightPercent(100);

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class TextBox {
	constructor(x, y, width, height, text = '') {
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
		if (this.cursorPosition > this.text.length) this.cursorPosition = this.text.length;
	}
	moveCursor(dx) {
		this.cursorPosition += dx;
		this.preventCursorOutOfBounds();
	}
	addCharacter(character) {
		this.text = [
			this.text.slice(0, this.cursorPosition),
			character,
			this.text.slice(this.cursorPosition)
		].join('');
		this.moveCursor(1);
	}
	deleteCharacter() {
		this.text = [
			this.text.slice(0, this.cursorPosition - 1),
			this.text.slice(this.cursorPosition)
		].join('');
		this.moveCursor(-1);
	}
	draw(ctx) {
		ctx.fillStyle = '#000000ff';
		ctx.fillRect(this.x, this.y, this.width, this.height);
		
		ctx.fillStyle = '#ffffffff';
		ctx.fillText(this.cursorPosition + '\n' + this.text, this.x, this.y+this.fontSize);
	}
}

class TextBox

let text = new TextBox(20, 20, 300, 100);

setInterval(() => {
	text.draw(ctx);
}, 1000 / 60);

window.onkeydown = (e) => {
	if (e.code == 'Backspace') {
		text.deleteCharacter();
	} else if (e.code == 'ArrowLeft') {
		text.moveCursor(-1);
	} else if (e.code == 'ArrowRight') {
		text.moveCursor(1);	
	} else {
		text.addCharacter(processSpecialCharacters(e.key));
	}
}

// end of setting up editor layout

function processSpecialCharacters(key) {
	if (key == 'Enter') return '\n';

	return key;
}