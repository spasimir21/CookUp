//Text To Speech
const tts = Capacitor.Plugins.TTS;

tts.initialize({
    local: 1, //UK
    pitch: 1,
    rate: 1.3
});

//Speech To Text
const stt = Capacitor.Plugins.SpeechRecognition;
let isSttActive = false;

const sttOptions = {
    language: 'en-US',
    maxResults: 1,
    prompt: '',
    partialResults: false,
    popup: false
};

stt.hasPermission().then(({ permission }) => {
    if (!permission) {
        stt.requestPermission();
    }
});

//Other
let endCb = () => {};

let recipe = null;
let section = 'ingredients';
let pointer = -1;

function onError(err) {
    if (isSttActive) {
        stt.start(sttOptions).then(onResult).catch(onError);
    }
}

function onResult(res) {
    if (isSttActive) {
        processData(res);
        stt.start(sttOptions).then(onResult).catch(onError);
    }
}

function start(startRecipe) {
    recipe = startRecipe;
    section = 'ingredients';
    pointer = -1;
    isSttActive = true;
    tts.speak({
        text: 'Alright! First the ingredients.'
    });
    stt.start(sttOptions).then(onResult).catch(onError);
}

function stop(stopTts = true) {
    isSttActive = false;
    endCb();
    endCb = () => {};
    recipe = null;
    if (stopTts) tts.stop();
    stt.stop();
}

function onEnd(cb) {
    endCb = cb;
}

export default {
    start,
    stop,
    onEnd
};

//Actual processing

function processData(data) {
    if (data.matches) {
        const match = data.matches[0];
        if (match.includes('next ingredient')) {
            if (section == 'ingredients') {
                pointer++;
                if (pointer == recipe.ingredients.length) {
                    section = 'steps';
                    pointer = -1;
                    tts.speak({
                        text:
                            'Those were all of the ingredients. Now on to the steps.'
                    });
                    return;
                }
                tts.speak({
                    text: recipe.ingredients[pointer]
                });
            }
        } else if (match.includes('next step')) {
            if (section == 'steps') {
                pointer++;
                if (pointer == recipe.steps.length) {
                    tts.speak({
                        text: 'That was it! Enjoy your food!'
                    });
                    stop(false);
                    return;
                }
                tts.speak({
                    text: `Step number ${pointer + 1}. ${recipe.steps[pointer]}`
                });
            }
        } else if (match.includes('repeat ingredient')) {
            if (section == 'ingredients') {
                if (pointer != -1) {
                    tts.speak({
                        text: recipe.ingredients[pointer]
                    });
                }
            }
        } else if (match.includes('repeat step')) {
            if (section == 'steps') {
                if (pointer != -1) {
                    tts.speak({
                        text: `Step number ${pointer + 1}. ${
                            recipe.steps[pointer]
                        }`
                    });
                }
            }
        } else if (match.includes('list ingredients')) {
            section = 'ingredients';
            pointer = recipe.ingredients.length - 1;
            tts.speak({
                text: recipe.ingredients.join('\n')
            });
        } else if (match.includes('list steps')) {
            section = 'steps';
            pointer = recipe.steps.length - 1;
            tts.speak({
                text: recipe.steps
                    .map((step, idx) => `Step number ${idx + 1}. ${step}`)
                    .join('\n')
            });
        } else if (
            match.includes('goto ingredients') ||
            match.includes('go to ingredients')
        ) {
            section = 'ingredients';
            pointer = -1;
            tts.speak({
                text: 'Ok. Now the ingredients.'
            });
        } else if (
            match.includes('goto steps') ||
            match.includes('go to steps')
        ) {
            section = 'steps';
            pointer = -1;
            tts.speak({
                text: 'Ok. Now the steps.'
            });
        } else if (match.includes('previous ingredient')) {
            if (section == 'ingredients' && pointer > 0) {
                pointer--;
                tts.speak({
                    text: recipe.ingredients[pointer]
                });
            }
        } else if (match.includes('previous step')) {
            if (section == 'steps' && pointer > 0) {
                pointer--;
                tts.speak({
                    text: `Step number ${pointer + 1}. ${recipe.steps[pointer]}`
                });
            }
        }
    }
}
