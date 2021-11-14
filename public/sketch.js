let color = '#FFF' //Sets the colour
let strokeWidth = 4  //Sets the width of the pencil

    //Sets up the drawing canvas
function setup() {
	const cv = createCanvas(800, 600)
    cv.position(350, 100)
	cv.background(0)
}

    //Function which does the drawing
function mouseDragged() {
    stroke(color)
    strokeWeight(strokeWidth)
    line(mouseX, mouseY, pmouseX, pmouseY)
   }