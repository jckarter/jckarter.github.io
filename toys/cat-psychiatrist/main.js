'use strict';
(function(){

var URL = window.URL || window.webkitURL || window.mozURL || window.oURL || window.msURL;

var E = {};

function getElements() {
    for (var i in arguments) {
        var id = arguments[i];
        E[id] = document.getElementById(id);
    }
}

function stopEvent(ev) {
    ev.stopPropagation();
    ev.preventDefault();
}

function chooseImage(file) {
    var url = URL.createObjectURL(file);
    E.picturedisplay.src = url;
    E.picturechoose.style.display = 'none';
    E.picturecontent.style.display = 'block';
}

function chooseImageFiles(files) {
    if (files.length > 0)
        chooseImage(files[0]);
    else
        forgetImage();
}

function forgetImage(resetFormp) {
    if (resetFormp)
        E.pictureform.reset();
    var url = E.picturedisplay.src;
    if (url !== '') {
        E.picturedisplay.src = '';
        URL.revokeObjectURL(url);
        E.picturecontent.style.display = 'none';
        E.picturechoose.style.display = 'block';
    }
}

function evaluate(name, gender, seed) {
    var prng = new SHA256.PRNG(seed);
    var genderDict;

    switch (gender) {
    case 'm':
        genderDict = {
            xhe:'he',
            xir:'his',
            xirs:'his',
            xim:'him'};
        break;
    case 'f':
        genderDict = {
            xhe:'she',
            xir:'her',
            xirs:'hers',
            xim:'her'};
        break;
    default:
        genderDict = {
            xhe:'xhe',
            xir:'xer',
            xirs:'xers',
            xim:'xer'};
        break;
    }

    var dicts = [{name:name}, genderDict, Dictionary];

    E.evaluation.textContent =
        Generator.generate(Dictionary.evaluation, dicts, prng);
    E.recommendation.textContent =
        Generator.generate(Dictionary.recommendation, dicts, prng);

    E.reportname.textContent = name;
    E.reportdate.textContent = new Date().toLocaleDateString();
    E.reportpic.src = E.picturedisplay.src;
    E.reportpic.width = E.picturedisplay.width;
    E.reportpic.height = E.picturedisplay.height;

    E.report.className = 'ready';
    window.scrollTo(0, 0);
}

function generateSeed() {
    var args = Array.prototype.slice.call(arguments);
    var seedstring = args.join('\x01');
    var sha = SHA256.hash(seedstring);
    return sha;
}

function submitQuestionnaire() {
    var ok = true;
    var fields = [E.catname, E.catgender, E.catbreed, E.catage];
    for (var i in fields) {
        var field = fields[i];
        if (!field.value) {
            ok = false;
            field.className = 'invalid';
        } else
            field.className = '';
    }

    if (ok) {
        E.submit.className = '';

        var name = E.catname.value;
        var gender = E.catgender.value;
        var breed = E.catbreed.value;
        var age = E.catage.value;

        var seed = generateSeed(name, gender, breed, age);

        evaluate(name, gender, seed);
    } else {
        E.submit.className = 'invalid';
    }
}

function dismissReport() {
    E.report.className = '';
}

function main() {
    getElements(
        'picturedragframe',
        'pictureform',
        'picturechoose',
        'pictureupload',
        'picturecontent',
        'pictureclear',
        'picturedisplay',
        'catname',
        'catbreed',
        'catgender',
        'catage',
        'submit',
        'evaluation',
        'report',
        'reportpic',
        'reportname',
        'reportdate',
        'reportdismiss',
        'recommendation');

    E.pictureform.addEventListener('submit', stopEvent);
    E.pictureform.addEventListener('reset', function(){
        forgetImage(false);
    });
    E.pictureform.addEventListener('dragenter', stopEvent);
    E.pictureform.addEventListener('dragexit', stopEvent);
    E.pictureform.addEventListener('dragover', stopEvent);
    E.pictureform.addEventListener('drop', function(dropEvent){
        chooseImageFiles(dropEvent.dataTransfer.files);
    });

    E.pictureupload.addEventListener('change', function(){
        chooseImageFiles(E.pictureupload.files);
    });

    E.submit.addEventListener('click', submitQuestionnaire);
    E.reportdismiss.addEventListener('click', dismissReport);
}

document.addEventListener('DOMContentLoaded', main);

})();
