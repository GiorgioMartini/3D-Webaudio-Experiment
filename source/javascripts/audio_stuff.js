/* Hoist some variables. */
var audio, context;

/* Try instantiating a new AudioContext, throw an error if it fails. */
try {
    /* Setup an AudioContext. */
    context = new AudioContext();
} catch(e) {
    throw new Error('The Web Audio API is unavailable');
}

/* Define a `Sound` Class */
var Sound = {
    /* Give the sound an element property initially undefined. */
    element: undefined,
    /* Define a class method of play which instantiates a new Media Element
     * Source each time the file plays, once the file has completed disconnect 
     * and destroy the media element source. */
    play: function() { 
        var sound = context.createMediaElementSource(this.element);
        this.element.onended = function() {
            sound.disconnect();
            sound = null;
        }
        sound.connect(context.destination);

        /* Call `play` on the MediaElement. */
        this.element.play();
    }
};

/* Create an async function which returns a promise of a playable audio element. */
function loadAudioElement(url) {
    return new Promise(function(resolve, reject) {
        var audio = new Audio();
        audio.addEventListener('canplay', function() {
            /* Resolve the promise, passing through the element. */
            resolve(audio);
        });
        /* Reject the promise on an error. */
        audio.addEventListener('error', reject);
        audio.src = url;
    });
}

/* Let's load our file. */
loadAudioElement('/audio/shorter.mp3').then(function(elem) {
    /* Instantiate the Sound class into our hoisted variable. */
    audio = Object.create(Sound);
    /* Set the element of `audio` to our MediaElement. */
    audio.element = elem;
    /* Immediately play the file. */
    audio.play();
}, function(elem) {
    /* Let's throw an the error from the MediaElement if it fails. */
    throw elem.error;
});