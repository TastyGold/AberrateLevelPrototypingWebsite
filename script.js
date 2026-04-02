// Wait for the DOM to load before executing
document.addEventListener('DOMContentLoaded', () => {
    
    let pageWidth = document.querySelector('body').offsetWidth;
    document.body.innerHTML += `<p>Page Width: ${pageWidth}px</p>`;

    let canvas = document.querySelector('canvas');
    if (canvas) {
        canvas.width = 400;
        canvas.height = 400;
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = 'lightgrey';
        // fill background white
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'red';
        ctx.fillRect(50, 50, 100, 100);
    }

    //find the ubtton element and assign it to button variable
    let button = document.querySelector('#colorButton');
    console.log(button);
    if (button) {
        button.addEventListener('click', () => {
            console.log('Button clicked');
            if (boxColor === 'red') {
                boxColor = '#24deff';
            } else {
                boxColor = 'red';
            }
            redrawCanvas(200, 200);
        });
    }
});

window.addEventListener('resize', () => {
    let pageWidth = document.querySelector('body').offsetWidth;
    document.querySelector('p').textContent = `Page Width: ${pageWidth}px`;
});

var boxColor = 'red';

// get mouse position on window and redraw red square in canvas at that position
window.addEventListener('mousemove', (event) => {

    // if lmb not pressed, escape
    if (event.buttons !== 1) {
        return;
    }

    redrawCanvas(event.clientX, event.clientY);
});

redrawCanvas = (mouseX, mouseY) => {
    
    let canvas = document.querySelector('canvas');
    if (canvas) {
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = 'lightgrey';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = boxColor;
        // adjust position to center on mouse cursor even though the canvas element is not at 0 0 on the page
        let rect = canvas.getBoundingClientRect();
        let x = mouseX - rect.left - 25;
        let y = mouseY - rect.top - 25;
        ctx.fillRect(x, y, 50, 50);

        // make sure the grid lines are always visible even when the mouse is near the edge of the canvas
        ox = x % 50;
        oy = y % 50;

        // draw a grid centered on the mouse cursor with lines every 50 pixels
        ctx.strokeStyle = 'black';
        for (let i = 0; i <= canvas.width; i += 50) {
            ctx.beginPath();
            ctx.moveTo(ox + i, 0);
            ctx.lineTo(ox + i, canvas.height);
            ctx.stroke();
            // draw horizontal lines as well 
            ctx.beginPath();
            ctx.moveTo(0, oy + i);
            ctx.lineTo(canvas.width, oy + i);
            ctx.stroke();
        }
    }
}