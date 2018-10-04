var daySound = {
    "oscillator": {
        "type": "fatcustom",
        "partials" : [0.2, 1, 0, 0.5, 0.1],
        "spread" : 40,
        "count" : 3
    },
    "envelope": {
        "attack": 0.001,
        "decay": 1.6,
        "sustain": 0,
        "release": 1.0
    }
};

// var nSound = {
//     "harmonicity": 3.01,
//     "modulationIndex": 14,
//     "oscillator": {
//         "type": "triangle"
//     },
//     "envelope": {
//         "attack": 0.2,
//         "decay": 0.3,
//         "sustain": 0.1,
//         "release": 1.2
//     },
//     "modulation" : {
//         "type": "square"
//     },
//     "modulationEnvelope" : {
//         "attack": 0.01,
//         "decay": 0.5,
//         "sustain": 0.2,
//         "release": 0.1
//     }
// };

var nSound = {
    "portamento" : 0.0,
    "oscillator": {
        "type": "square4",
        "volume": -10
    },
    "envelope": {
        "attack": 2,
        "decay": 1,
        "sustain": 0.2,
        "release": 2
    }
};

var monthSound = {
    "oscillator": {
        "type": "fatsine4",
        "spread" : 60,
        "count" : 3,
        "volume": -35
    },
    "envelope": {
        "attack": 0.5,
        "decay": 0.01,
        "sustain": 2,
        "attackCurve" : "sine",
        "releaseCurve" : "sine",
        "release": 2
    }
};

var fSound = {
        "harmonicity":8,
        "modulationIndex": 2,
        "oscillator" : {
            "type": "sine"
        },
        "envelope": {
            "attack": 0.001,
            "decay": 0.1,
            "sustain": 0,
            "release": 0.2
        },
        "modulation" : {
            "type" : "square"
        },
        "modulationEnvelope" : {
            "attack": 0.002,
            "decay": 0.2,
            "sustain": 0,
            "release": 0.2
        }
};

var gSound = {
    "harmonicity": 2,
    "oscillator": {
        "type": "amsine2",
        "modulationType" : "sine",
        "harmonicity": 1.01
    },
    "envelope": {
        "attack": 0.006,
        "decay": 4,
        "sustain": 0.04,
        "release": 1.2
    },
    "modulation" : {
        "volume" : 13,
        "type": "amsine2",
        "modulationType" : "sine",
        "harmonicity": 12
    },
    "modulationEnvelope" : {
        "attack": 0.006,
        "decay": 0.2,
        "sustain": 0.2,
        "release": 0.4
    }
};

var sSound = {
    "portamento" : 0.0,
    "oscillator": {
        "type": "square4",
        "volume": -15
    },
    "envelope": {
        "attack": 2,
        "decay": 1,
        "sustain": 0.2,
        "release": 2
    }
};

var weekSound = {
    "harmonicity":8,
    "modulationIndex": 2,
    "oscillator" : {
        "type": "sine",
        "volume": 10
    },
    "envelope": {
        "attack": 0.001,
        "decay": 2,
        "sustain": 0.1,
        "release": 2
    },
    "modulation" : {
        "type" : "square"
    },
    "modulationEnvelope" : {
        "attack": 0.002,
        "decay": 0.2,
        "sustain": 0,
        "release": 0.2
    }
};