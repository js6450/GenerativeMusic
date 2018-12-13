let marcela, adley, iain, rashida;

let face = [29, 33, 36, 40];
let egbd = [28, 31, 35, 38];
let dfac = [26, 28, 33, 36];
let cegb = [24, 28, 31, 35];

let seeds = ["hi", "hello", "text me", "how are you", "im fine", "good"];

let montserrat;

function preload() {
    // Create the LSTM Generator with a pre trained model
    marcela = ml5.LSTMGenerator('models/marcela/');
    adley = ml5.LSTMGenerator('models/adley/');
    iain = ml5.LSTMGenerator('models/iain/');
    rashida = ml5.LSTMGenerator('models/rashida/');

    montserrat = loadFont('font/Montserrat.ttf');
}

let people = [];
let duo, metal, fm, am, mono;
function setup() {
    createCanvas(windowWidth, windowHeight);

    let duo1Vol = new Tone.Volume(-8);
    let duo1Reverb = new Tone.JCReverb(0.8).chain(duo1Vol, Tone.Master);
    let duo1Delay = new Tone.FeedbackDelay(0.5);
    duo1 = new Tone.DuoSynth().chain(duo1Delay, duo1Reverb);

    let duo2Vol = new Tone.Volume(-8);
    let duo2Reverb = new Tone.JCReverb(0.8).chain(duo2Vol, Tone.Master);
    let duo2Delay = new Tone.FeedbackDelay(0.5);
    duo2 = new Tone.DuoSynth().chain(duo2Delay, duo2Reverb);

    // let amVol = new Tone.Volume(-8);
    // let amReverb = new Tone.JCReverb(0.8).chain(amVol, Tone.Master);
    // let cheby = new Tone.Chebyshev(30);
    // am = new Tone.AMSynth().chain(cheby, amReverb);
    //
    // let fmVol = new Tone.Volume(-10);
    // let fmReverb = new Tone.JCReverb(0.8).chain(fmVol, Tone.Master);
    // fm = new Tone.FMSynth().connect(fmReverb);
    //
    // let metalReverb = new Tone.JCReverb(0.8).connect(Tone.Master);
    // let metalDelay = new Tone.FeedbackDelay(0.7);
    // metal = new Tone.MetalSynth().chain(metalDelay, metalReverb);

    let mono1Vol = new Tone.Volume(-20);
    let mono1Reverb = new Tone.JCReverb(0.8).chain(mono1Vol, Tone.Master);
    let pingPoing1 = new Tone.PingPongDelay("4n", 0.1);
    mono1 = new Tone.MonoSynth().chain(pingPoing1, mono1Reverb);

    let monoVol = new Tone.Volume(-20);
    let monoReverb = new Tone.JCReverb(0.8).chain(monoVol, Tone.Master);
    let pingPoing = new Tone.PingPongDelay("4n", 0.1);
    mono = new Tone.MonoSynth().chain(pingPoing, monoReverb);

    colorMode(HSB, 360, 100, 100, 100);

    people.push(new Person(marcela, duo1, face, 0, height));
    people.push(new Person(adley, duo2, egbd, width / 4, height));
    people.push(new Person(iain, mono1, dfac, width / 2, height));
    people.push(new Person(rashida, mono, cegb, width / 4 * 3, height));


    //frameRate(2);
    noStroke();
    textFont(montserrat);
}

let start = false;

function draw() {
    background(15, 30);
    // if (displayText) {
    //     background(255);
    //     text(displayText, 30, 30);
    // }

    if(start){
        for(let i = 0; i < people.length; i++){
            people[i].update();
            people[i].display();
        }
    }else{
        fill(0, 0, 100, 100);
        textSize(width / 10);
        text("TEXT ME", width / 2 - textWidth("TEXT ME") / 2, height / 2);
    }


}

function mousePressed(){
    start = true;
}

function keyPressed() {
    // Generete content
    // lstm.generate({
    //     seed: 'a',
    //     length: int(random(5, 60)),
    //     temperature: 0.5
    // }, function(results) {
    //     displayText = results.generated;
    //     //all_generations.push(displayText);
    //     console.log(displayText);
    // });
    // if (keyCode === ENTER) {
    //     console.log('saving file');
    //     saveStrings(all_generations, 'notes.txt');
    // }
}

class Person{

    constructor(model, synth, chord, x, y){
        this.model = model;
        this.texts = [];
        this.synth = synth;
        this.chord = chord;
        this.x = x;
        this.y = y;
        this.h = int(random(360));

        this.currentText = -1;

        this.lastGenerated = 0;
        this.minimumTerm = 5000;
    }

    update(){
            if(this.texts.length > 0){
                if(this.lastGenerated + this.minimumTerm < millis()) {
                    if(this.texts[this.currentText].ended){
                        console.log('generate');
                        this.generateText();
                        this.lastGenerated = millis();
                    }
                }

            }else{
                if(this.lastGenerated + this.minimumTerm < millis()) {

                    console.log('generate');
                    this.generateText();
                    this.lastGenerated = millis();

                }
            }

    }

    display(){
        push();
        translate(this.x, this.y - 35);
        //rect(0, 0, 100, 20);
        for(let i = 0; i < this.texts.length; i++){
            this.texts[i].update();
            this.texts[i].display();
        }
        pop();
    }

    generateText(){
        this.model.generate({
            seed: seeds[int(random(seeds.length))],
            length: int(random(2, 50)),
            temperature: 0.5
        }, function(results){
            console.log(results.generated);
            let newText = results.generated;
            this.y -= 25;
            this.texts.push(new Text(newText, this.synth, this.chord, this.h, 0, height - this.y));
            this.currentText++;
            //console.log(newText);
        }.bind(this));
    }

}

class Text {

    constructor(msg, synth, chord, h, x, y){
        this.msg = msg.toLowerCase();
        this.synth = synth;
        this.chord = chord;
        this.h = h;
        this.letterIndex = -1;
        this.x = x;
        this.y = y;

        this.width = 15;
        this.height = 20;

        this.time = 0.25;
        this.prevTrigger = 0;
        this.duration = this.time * 1000;

        this.ended = false;

    }

    move(x, y){
        this.x += x;
        this.y += y;
    }

    update(){
        if(this.letterIndex < this.msg.length - 1){
            if(this.prevTrigger + this.duration < millis()){
                this.letterIndex++;
                //console.log(this.letterIndex + ": " + this.msg[this.letterIndex]);
                this.prevTrigger = millis();
                let note = this.msg[this.letterIndex].charCodeAt(0) - 97;
                if(note > 0 && note < 26){
                    let midiIndex = this.chord[note % 4] + parseInt(note / 4) * 12;
                    //console.log(midiIndex);
                    this.synth.triggerAttackRelease(Tone.Midi(midiIndex).toFrequency(), this.time * 0.8);
                }
            }
        }else{
            this.ended = true;
        }
    }

    display(){

        //fill(this.h, 70, 100, 50);

        //rect(this.x, this.y, this.letterIndex * this.width, this.height);
        for(let i = 0; i < this.letterIndex; i++){
            let textX = (this.x + i * this.width) % (width / 4);
            let textY = int((this.x + i * this.width) / (width / 4)) * this.height;
            fill(this.h, 70, 100, 50);
            rect(textX, this.y + textY, this.width, this.height);
            fill(0, 0, 100, 50);
            textSize(this.width * 1.2);
            text(this.msg[i],textX, this.y + textY + this.height * 0.75);
        }

    }
}
