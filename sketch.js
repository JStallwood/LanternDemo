const ambient = 12;
const P = 1;
const R = 2.87;

let lanterns = [];

function setup() {
    let c = createCanvas(800, 600);
    c.parent("game_div");

    const colors = [
        color(213,120,255, 120),
        color(98,93,240, 120),
        color(89,231,242, 120),
        color(242,89,166, 120),
        color(103,238,187, 120)
    ];

    let xOff = 100;
    let xPrev = 0;
    for(let i = 0; i < 3; i++) {
        let x = xPrev + xOff;
        let c = random(colors);
        let w = random(40, 100);
        let h = random(40, 100);
        lanterns.push(new Lantern(x, height * 0.75 - (h), w, h, c));
        xPrev = x + w;
    }
}

function draw() {
    background(160);
    fill(0);
    noStroke();
    textAlign(RIGHT);
    textSize(30);
    text("Ambient Temp (c) = " + ambient.toString() + "\nBurn Time (s) : 60", width * 0.95, height * 0.1);
    strokeWeight(2);
    stroke(0);
    line(0, height * 0.75, width, height * 0.75);
    lanterns.forEach(l => {
        l.show();
        l.update();
    });
}

function Lantern(x, y, w, h, color) {
    this.pos = createVector(x, y);
    this.dim = createVector(w, h);
    this.start = y;

    this.volume = this.dim.x * this.dim.y;
    this.internalTemp = ambient;
    this.maxTemp = 100;
    this.mass = this.dim.x + this.dim.y;
    this.materialCoeff = random(1, 100);
    this.color = color;
    this.color.setAlpha(this.materialCoeff * 2 + 20);

    this.burnTime = 60;
    
    this.show = function() {

        fill(this.color);
        noStroke();
        rect(this.pos.x, this.pos.y, this.dim.x, this.dim.y);

        if(this.burnTime > 0) {
            fill(255, 192, 0, 10);
            for(let i = 0; i < this.dim.x / 4; i++) {
                let r = map(this.internalTemp, ambient, this.maxTemp, 0, this.burnTime);
                circle(this.pos.x + this.dim.x/2, this.pos.y + this.dim.y, r * i);
            }
        }

        fill(0);
        noStroke();
        textAlign(CENTER);
        textSize(12);
        text("mC = " + this.materialCoeff.toFixed(2) + "\nV = " + this.mass.toFixed(2) + "\nTemp (c) = " + this.internalTemp.toFixed(2), this.pos.x + this.dim.x /2, this.pos.y - 10);
    };

    this.update = function() {
        if(this.burnTime > 0) {
            if(this.internalTemp < this.maxTemp) {
                this.internalTemp += (1 / 60);
            }
            this.burnTime -= (1/60);
        }
        else {
            if(this.internalTemp > ambient) {
                this.internalTemp -= (1 / 60);
            }
        }
        let lift = this.volume * (P/R) * ((1/(ambient + 273)) - (1/(this.internalTemp + 273)));
        let force = lift - (this.materialCoeff/this.mass);
        this.pos.y -= force;

        if(this.pos.y > this.start) { this.pos.y = this.start;}
        
    };
}

