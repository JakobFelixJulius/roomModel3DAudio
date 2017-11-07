let canvasControl;
let resonanceAudioScene;
let soundSource;
var sourcePosition = {x: 0.25, y: 0, z: 0.25};

let dimensionSelection = "small";
let materialSelection = "brick";

let dimensions = {
  small: {width: 1.5, height: 2.4, depth: 1.3},
  medium: {width: 4, height: 3.2, depth: 3.9},
  large: {width: 8, height: 3.4, depth: 9},
  huge: {width: 20, height: 10, depth: 20},
};

let materials = {
  brick: {
    left: "brick-bare", right: "brick-bare",
    up: "brick-bare", down: "wood-panel",
    front: "brick-bare", back: "brick-bare",
  },
  curtains: {
    left: "curtain-heavy", right: "curtain-heavy",
    up: "wood-panel", down: "wood-panel",
    front: "curtain-heavy", back: "curtain-heavy",
  },
  marble: {
    left: "marble", right: "marble",
    up: "marble", down: "marble",
    front: "marble", back: "marble",
  },
  outside: {
    left: "transparent", right: "transparent",
    up: "transparent", down: "grass",
    front: "transparent", back: "transparent",
  },
};

document.getElementById("sourceHeightSlider").addEventListener("input", function(e) {
    sourcePosition.y = ((this.value/100)*dimensions[dimensionSelection].height);
    soundSource.setPosition(sourcePosition.x, sourcePosition.y, sourcePosition.z);
});

document.getElementById("roomSizeList").addEventListener("change", function(e) {
    setRoomProperties();
});

document.getElementById("roomMaterialList").addEventListener("change", function(e) {
    setRoomProperties();
});

function setRoomProperties() {
    dimensionSelection = document.getElementById('roomSizeList').value;
    materialSelection = document.getElementById('roomMaterialList').value;
    resonanceAudioScene.setRoomProperties(dimensions[dimensionSelection], materials[materialSelection]);
}

function updatePositions(elements) {
    for (let i = 0; i < elements.length; i++) {
        let x = (elements[i].x - 0.5) * dimensions[dimensionSelection].width / 2;
        let y = 0;
        let z = (elements[i].y - 0.5) * dimensions[dimensionSelection].depth / 2;
        if (i < elements.length - 1) {
            sourcePosition.x = x;
            sourcePosition.z = z;
            soundSource.setPosition(x, sourcePosition.y, z);
        } else {
            resonanceAudioScene.setListenerPosition(x, y, z);
        }
    }
}

let onLoad = function() {
    // Initialize Resonance Audio and create source.
    let audioContext = new AudioContext();

    var sound = new Audio("CubeSound.wav");
    sound.loop = true;
    sound.play();
    var source = audioContext.createMediaElementSource(sound);

    resonanceAudioScene = new ResonanceAudio(audioContext, {ambisonicOrder: 3, });
    soundSource = resonanceAudioScene.createSource();
    source.connect(soundSource.input);

    resonanceAudioScene.output.connect(audioContext.destination);

    // Initialize and create Canvas UI
    let canvas = document.getElementById("canvas");
    let elements = [
        {
            icon: "sourceAIcon",
            x: 0.25,
            y: 0.25,
            radius: 0.04,
            alpha: 0.75,
            clickable: true,
        },
        {
            icon: "listenerIcon",
            x: 0.5,
            y: 0.5,
            radius: 0.04,
            alpha: 0.75,
            clickable: true,
        },
    ];
    canvasControl = new CanvasControl(canvas, elements, updatePositions);
};

window.addEventListener("load", onLoad);
