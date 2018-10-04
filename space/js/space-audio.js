"use strict";

var fireball, geomag, neo, solar;

var fireballs = [];
var geomags = [];
var neos = [];
var solars = [];

var currentYear = 17;
var currentMonth = 10;
var currentDay = 1;

var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

//12 notes per octave
var notes = ["C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2",
             "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3",
             "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
             "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5"];

var nNotes = ["D2", "E2", "F2", "G2", "A2", "A#2", "C3", "D3"];
var monthNotes = ["A4", "B4", "C5", "D5", "E5", "F5", "G5", "F5", "E5", "D5", "C5", "B4"];

var daySynth, weekSynth, monthSynth;

var fSynth, gSynth, sSynth;

var bar = 1;

var earthX, earthY;
var earthWidth, earthHeight;

var camZ = 0;

var lastTime = 0;
var sceneScale = 0.5;

var start = false;
var preAlpha = 255;

function preload(){

    fireball = loadTable('data/fireball.csv', 'csv', 'header');
    geomag = loadTable('data/geomagnetic.csv', 'csv', 'header');
    neo = loadTable('data/neo.csv', 'csv', 'header');
    solar = loadTable('data/solar_flares.csv', 'csv', 'header');

}

function setup(){

    createCanvas(windowWidth, windowHeight, WEBGL);
    background(0);

    earthX = 0;
    earthY = 0;
    earthWidth = width * 0.25;
    earthHeight = width * 0.25;

    parseFireball();
    parseGeomag();
    parseNeo();
    parseSolar();

    daySynth = new Tone.Synth(daySound);
    weekSynth = new Tone.Synth(weekSound);
    monthSynth = new Tone.Synth(monthSound);

    fSynth = new Tone.Synth(fSound);
    gSynth = new Tone.Synth(gSound);
    sSynth = new Tone.Synth(sSound);

    daySynth.toMaster();
    weekSynth.toMaster();
    monthSynth.toMaster();

    fSynth.toMaster();
    gSynth.toMaster();
    // nSynth.toMaster();
    //sSynth.toMaster();
}

function draw(){
    background(0);

    if(start){
        orbitControl();

        progressTime();

        var angle = map(millis() - lastTime, 0, bar * 1000, 0, TWO_PI);
        var revolution = map(currentDay, 1, daysInMonth[currentMonth - 1], 0, TWO_PI);

        translate(0, 0, camZ);
        rotateY(revolution);

        push();
        scale(sceneScale);
        rotateZ(radians(23.5));

        push();
        translate(earthX, earthY);
        rotateY(angle);
        //noFill();
        noStroke();
        stroke(74, 90, 119);
        fill(74, 90, 119, 50);
        //strokeWeight(10);
        sphere(earthWidth);

        // strokeWeight(3);
        stroke(205);
        fill(205, 50);
        sphere(earthWidth + cos(frameCount * 0.01) * 50);
        //strokeWeight(2);
        stroke(156, 144, 143);
        fill(156, 144, 143, 50);
        sphere(earthWidth + sin(frameCount * 0.02) * 50);
        pop();

        for(var i = 0; i < fireballs.length; i++){
            fireballs[i].checkTime();
        }

        for(var i = 0; i < neos.length; i++){
            neos[i].checkTime();
        }

        for(var i = 0; i < geomags.length; i++){
            geomags[i].checkTime();
        }

        for(var i = 0; i < solars.length; i++){
            solars[i].checkTime();
        }
        pop();
    }else{
        preSound();

        if(stopPre){
            cursor(ARROW);

            if(preAlpha > 0){
                preAlpha -= 5;
            }
        }

        fill(255, preAlpha);
        triangle(-35, -50, 55, 0, -35, 50);
        noFill();
        strokeWeight(3);
        stroke(255, preAlpha);
        ellipse(0, 0, 200, 200);

        if(mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height / 2 - 100 && mouseY < height / 2 + 100){
            if(mouseIsPressed){
                console.log("clicked");
                stopPre = true;

                setTimeout(function(){
                    strokeWeight(1);
                    stopPre = false;
                    start = true;
                }, 2000);
            }else{
                if(!stopPre){
                    preAlpha = int(sin(frameCount * 0.05) * 100 + 155);
                    cursor(HAND);
                }
            }
        }else{
            cursor(ARROW);
        }
    }

}

function keyPressed(){
    if(keyCode === UP_ARROW){
        sceneScale += 0.1;
    }

    if(keyCode === DOWN_ARROW){
        sceneScale -= 0.1;
    }
}

function progressTime(){
    if(millis() >= lastTime + bar * 1000){

        currentDay++;

        daySynth.triggerAttackRelease("G1", bar);


        if(currentDay % 7 == 0){
            weekSynth.triggerAttackRelease("C1", bar * 2, "+4n");
        }

        if(currentDay > daysInMonth[currentMonth - 1]){

            monthSynth.triggerAttackRelease(monthNotes[currentMonth], bar * 1.5, "+2n");

            currentMonth++;
            currentDay = 1;

            if(currentYear == 17){
                if(currentMonth > 12){
                    currentMonth = 1;
                    currentYear = 18;
                }
            }else{
                if(currentMonth > 9){
                    currentYear = 17;

                    for(var i = 0; i < fireballs.length; i++){
                        fireballs[i].isPlaying = false;
                    }

                    for(var i = 0; i < neos.length; i++){
                        neos[i].isPlaying = false;
                    }

                    for(var i = 0; i < geomags.length; i++){
                        geomags[i].isPlaying = false;
                    }

                    for(var i = 0; i < solars.length; i++){
                        solars[i].isPlaying = false;
                    }
                }
            }

        }

        console.log(months[currentMonth - 1] + " " + currentDay + ", 20" + currentYear);
        lastTime = millis();
    }
}

var stopPre = false;
var preLastSound = 0;
var preCount = 0;
function preSound(){
    if(millis() >= preLastSound + bar * 1000){
        if(!stopPre){
            daySynth.triggerAttackRelease("G1", bar);

            preCount++;

            if(preCount % 7 == 0){
                weekSynth.triggerAttackRelease("C1", bar * 2, "+4n");
            }

            preLastSound = millis();
        }
    }
}

function parseFireball(){

    for(var i = 0; i < fireball.rows.length; i++){
        var thisRow = fireball.rows[i].arr;

        var d_and_t = thisRow[0].split(" ");
        var date = d_and_t[0].split("/");
        var time = d_and_t[1].split(":");
        var month = int(date[0]);
        var day = int(date[1]);
        var year = int(date[2]);
        var hour = int(time[0]);
        var minute = int(time[1]);

        var lat = float(thisRow[1]);
        var long = float(thisRow[2]);

        var alt = float(thisRow[3]);

        var vx = float(thisRow[5]);
        var vy = float(thisRow[6]);

        var impact = float(thisRow[9]);

        fireballs[i] = new Fireball(month, day, year, hour, minute, lat, long, alt, vx, vy, impact);
    }

}

class Fireball{

    constructor(m, d, y, h, mnt, lt, lng, alt, vx, vy, impact){
        this.month = m;
        this.day = d;
        this.year = y;
        this.hour = h;
        this.minute = mnt;
        this.lat = lt;
        this.long = lng;
        this.alt = alt;
        this.vx = vx;
        this.vy = vy;
        this.impact = impact;

        this.isPlaying = false;

        this.size = map(this.impact, 0, 6.5, 25, 100);

        this.mappedAlt = map(this.alt, 20, 65, 100, 300);
        this.r = earthWidth + this.mappedAlt;
        this.xpos = cos(this.long) * sin(this.lat) * this.r;
        this.ypos = - sin(this.long) * cos(this.lat) * this.r;
        this.zpos = cos(this.lat) * this.r;

        this.alpha = 0;
    }

    checkTime(){
        if(currentYear == this.year && currentMonth == this.month && currentDay == this.day){
            if(!this.isPlaying){
                this.playNote();
            }else{
                if(this.alpha < 200){
                    this.alpha += 5;
                }

                push();
                noFill();
                stroke(this.alpha, 0, 0);
                translate(this.xpos, this.ypos, this.zpos);
                sphere(this.size, 6, 4);
                pop();
            }
        }
    }

    playNote(){
        this.isPlaying = true;

        var note = int(map(this.alt, 20, 65, 23, notes.length));
        var startTime = float(map(this.hour, 0, 23, 0, bar)).toFixed(1) * 1000;

        console.log("FIREBALL: play " + notes[note]);

        setTimeout(function(){
            fSynth.triggerAttackRelease(notes[note], bar * 0.5);
        }, startTime);
    }

}

function parseGeomag(){

    for(var i = 0; i < geomag.rows.length; i++){
        var thisRow = geomag.rows[i].arr;

        var date = thisRow[0].split("/");
        var month = int(date[0]);
        var day = int(date[1]);
        var year = int(date[2]);

        var avg = int(thisRow[1]);

        geomags[i] = new Geomag(month, day, year, avg);
    }

}

class Geomag{

    constructor(m, d, y, avg){
        this.month = m;
        this.day = d;
        this.year = y;
        this.avg = avg;

        this.isPlaying = false;
    }

    checkTime(){
        if(currentYear == this.year && currentMonth == this.month && currentDay == this.day){
            if(!this.isPlaying){
                this.playNote();
            }

            earthX = sin(frameCount * 0.01) * this.avg;
            earthY = random(-this.avg / 2, this.avg / 2);
        }
    }

    playNote(){
        this.isPlaying = true;

        var note = int(map(this.avg, 10, 70, 0, notes.length));
        console.log("GEO: play " + notes[note]);
        gSynth.triggerAttackRelease(notes[note], bar);
    }

}

function parseNeo(){

    for(var i = 0; i < neo.rows.length; i++){
        var thisRow = neo.rows[i].arr;

        var d_and_t = thisRow[1].split(" ");
        var date = d_and_t[0].split("-");
        var year = int(date[0].substring(2));
        var month = months.indexOf(date[1]) + 1;
        var day = int(date[2]);

        var time = d_and_t[1].substring(0, 5).split(":");
        var hour = int(time[0]);
        var minute = int(time[1]);

        var distance = float(thisRow[2].split("|")[0].trim());

        var vel = float(thisRow[5]);

        // https://cneos.jpl.nasa.gov/tools/ast_size_est.html
        var size = float(thisRow[6]);

        var dias = thisRow[7].split("-");
        var diaMin = int(dias[0].trim().substring(0, 2));
        var diaMax = int(dias[1].trim().substring(0, 2));

        neos[i] = new Neo(month, day, year, hour, minute, distance, vel, size, diaMin, diaMax);
    }

}

class Neo{

    constructor(m, d, y, h, mnt, distance, vel, size, diaMin, diaMax){
        this.month = m;
        this.day = d;
        this.year = y;
        this.hour = h;
        this.minute = mnt;
        this.time = this.hour * 60 + this.minute;
        this.distance = distance;
        this.vel = vel;
        this.size = size;
        this.diaMin = diaMin;
        this.diaMax = diaMax;

        this.isPlaying = false;
        this.synth;

        this.mappedDist = map(this.distance, 0, 20, 100, 200) + earthWidth;
        this.currentDist = width;

        this.angle = random(TWO_PI);

        this.xPos = sin(this.angle) * this.currentDist;
        this.yPos = cos(this.angle) * this.currentDist;
    }

    update(){
        this.diaMin = lerp(this.diaMin, this.diaMax, 0.02);
        this.currentDist = lerp(this.currentDist, this.mappedDist, 0.05);

        this.xPos = sin(this.angle) * this.currentDist;
        this.yPos = cos(this.angle) * this.currentDist;
    }

    checkTime(){
        if(currentYear == this.year && currentMonth == this.month && currentDay == this.day){

            if(!this.isPlaying) {
                this.playNote();
            }else{
                this.update();

                push();
                noFill();
                stroke(int(random(0, 255)), 10);
                translate(this.xPos, this.yPos);
                sphere(this.diaMin);
                sphere(this.diaMax);
                pop();
            }
        }
    }

    playNote(){
        this.isPlaying = true;

        var note = int(map(this.size, 18, 32, 0, nNotes.length));
        var startTime = map(this.time, 0, 1440, 0, bar).toFixed(1) * 1000;

        console.log("NEO: play " + notes[note]);

        setTimeout(function(){
            this.synth = new Tone.Synth(nSound).toMaster();
            this.synth.triggerAttackRelease(nNotes[note], bar * 0.5);

        }, startTime);
    }

}

function parseSolar(){

    for(var i = 0; i < solar.rows.length; i++){
        var thisRow = solar.rows[i].arr;

        var date = thisRow[1].split("/");
        var month = int(date[0]);
        var day = int(date[1]);
        var year = int(date[2]);

        var flare = thisRow[0];
        //A - B - C - M - X
        var fClass = flare.substring(0, 1);
        var fMag = float(flare.substring(1));

        var start = thisRow[3].split(":");
        var start_hour = int(start[0]);
        var start_min = int(start[1]);

        var peak = thisRow[4].split(":");
        var peak_hour = int(peak[0]);
        var peak_min = int(peak[1]);

        var end = thisRow[5].split(":");
        var end_hour = int(end[0]);
        var end_min = int(end[1]);

        solars[i] = new Solar(month, day, year, fClass, fMag, start_hour, start_min, peak_hour, peak_min, end_hour, end_min);
    }

}

class Solar{

    constructor(m, d, y, fClass, fMag, sh, sm, ph, pm, eh, em){
        this.month = m;
        this.day = d;
        this.year = y;
        this.fClass = fClass;
        this.fMag = fMag;
        this.start_hour = sh;
        this.start_min = sm;
        this.start_time = this.start_hour * 60 + this.start_min;
        this.peak_hour = ph;
        this.peak_min = pm;
        this.end_hour = eh;
        this.end_min = em;

        switch(this.fClass){
            case "A":
                this.fClass = 10;
                break;
            case "B":
                this.fClass = 12;
                break;
            case "C":
                this.fClass = 16;
                break;
            case "M":
                this.fClass = 24;
                break;
            case "X":
                this.fClass = 40;
                break;

            default:
                this.fClass = 0;
                break;
        }

        this.totalMag = this.fClass + this.fMag;

        this.synth;
        this.isPlaying = false;
        this.startTime;

        this.startMillis;
        this.angle = 0;

        this.dist = map(this.totalMag, 10, 50, 50, 750);
    }

    checkTime(){
        if(currentYear == this.year && currentMonth == this.month && currentDay == this.day){

            if(!this.isPlaying) {
                this.startMillis = millis();
                this.playNote();
            }else{
                this.angle = map(millis() - this.startMillis, 0, bar * 1500 - this.startTime, 0, PI);

                camZ = sin(this.angle) * this.dist;
            }

        }
    }

    playNote(){
        this.isPlaying = true;

        var note = int(map(this.totalMag, 10, 50, 0, notes.length));
        this.startTime = map(this.start_time, 0, 1440, 0, bar).toFixed(1) * 500;

        console.log("SOLAR: play " + notes[note]);

        setTimeout(function(){
            this.synth = new Tone.Synth(sSound).toMaster();
            this.synth.triggerAttackRelease(notes[note], bar * 1.5);
        }, this.startTime);
    }

}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}