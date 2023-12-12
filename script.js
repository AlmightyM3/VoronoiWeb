// Resources used: https://css-tricks.com/manipulating-pixels-using-canvas/ , https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData and https://en.wikipedia.org/wiki/Voronoi_diagram

// Define the bace point
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// Define a point with a color
class ColoredPoint {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = Math.floor(Math.random() * 255);
        this.g = Math.floor(Math.random() * 255);
        this.b = Math.floor(Math.random() * 255);
    }
}
// Define the canvas
var canvas = document.getElementById('Canvas');
var context = canvas.getContext('2d');

// Define the buttons
const ResetButton = document.getElementById('ResetButton');
const AddButton = document.getElementById('AddButton');
const ShowButton = document.getElementById('ShowButton');
const EuclideanButton = document.getElementById('Euclidean');
const ManhattanButton = document.getElementById('Manhattan');

ResetButton.addEventListener('click', reset);
AddButton.addEventListener('click', add);
ShowButton.addEventListener('click', ShowPoints);
EuclideanButton.addEventListener('click', draw);
ManhattanButton.addEventListener('click', mDraw);

canvas.addEventListener("mousedown", function(event){
    PointAtMousePosition(canvas, event);
});

// initialize the canvas
canvas.width = 500;
canvas.height = 500;
context.fillRect(0, 0, 500, 500); //(x, y, width, height)

// gets all the color values of the image as a list 
var imageData = context.getImageData(0, 0, canvas.width, canvas.height); 

// Create the starting list of points
var Points = [];
for (let i = 0; i < 10; i++) {
    Points.push(new ColoredPoint(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height)));
}

draw();

// Create a new diagram
function reset(){
    Points = [];
    for (let i = 0; i < 10; i++) {
        Points.push(new ColoredPoint(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height)));
    }

    draw();
}
// Add a point to the diagram
function add(){
    Points.push(new ColoredPoint(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height)));

    draw();
}
function ShowPoints(){
    for (let i = 0; i < Points.length; i++) {
        for (var y = 0; y < 7; y++) {
            for (var x = 0; x < 7; x++) {
                setColor(canvas, imageData.data, new Point(Points[i].x -4+x,Points[i].y -4+y), 255,255,255);
            }
        }
    }
    context.putImageData(imageData, 0, 0);
}

function PointAtMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    Points.push(new ColoredPoint(x, y));

    draw();
}

// For each point on the canvas, find the nearist key point and set the pixle color to it's color
function draw(){
    for (var y = 0; y < canvas.height; y++) {
        for (var x = 0; x < canvas.width; x++) {
            let ClosestDistance = canvas.width + canvas.height;
            let ClosestPoint = 0;
            for (let i = 0; i < Points.length; i++){
                let Distance = dist(new Point(x,y), new Point(Points[i].x,Points[i].y));
                if (Distance < ClosestDistance) {
                    ClosestDistance = Distance;
                    ClosestPoint = Points[i];
                }
            }

            setColor(canvas, imageData.data, new Point(x,y), ClosestPoint.r,ClosestPoint.g,ClosestPoint.b);
        }
    }
    context.putImageData(imageData, 0, 0);
}

// For each point on the canvas, find the nearist key point and set the pixle color to it's color
function mDraw(){
    for (var y = 0; y < canvas.height; y++) {
        for (var x = 0; x < canvas.width; x++) {
            let ClosestDistance = canvas.width + canvas.height;
            let ClosestPoint = 0;
            for (let i = 0; i < Points.length; i++){
                let Distance = mDist(new Point(x,y), new Point(Points[i].x,Points[i].y));
                if (Distance < ClosestDistance) {
                    ClosestDistance = Distance;
                    ClosestPoint = Points[i];
                }
            }

            setColor(canvas, imageData.data, new Point(x,y), ClosestPoint.r,ClosestPoint.g,ClosestPoint.b);
        }
    }
    context.putImageData(imageData, 0, 0);
}

// Standard Euclidean distince function
function dist(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

// Manhattan distince function
function mDist(p1, p2) {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

// Set the color at a xy position acounting for 2D -> 1D conversion
function setColor(canvas, data, point, r,g,b){
    pos = (point.x + canvas.width*point.y)*4;
    data[pos] = r; // Red
    data[pos+1] = g; // Green
    data[pos+2] = b; // Blue
}