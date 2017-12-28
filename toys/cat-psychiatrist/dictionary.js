'use strict';
(function(){

window.Dictionary = {
    evaluation: [
        '$mood $experience $experience $opinion $opinion $trait $trait'],

    mood: [
        '$Name has been feeling $emotion lately.',
        '$Name has been thinking about $subject a lot lately.'],
    emotion: [
        'happy',
        'content',
        'depressed',
        'moody',
        'worried',
        'ineffable',
        'incorrigible'],
    subject: [
        'the government',
        'the election',
        'the meaning of life',
        'the financial crisis'],

    experience: [
        '$Xhe recently caught $prey.',
        '$Xhe recently chased $prey.',
        '$Xhe recently saw $prey.',
        '$Xhe recently saw $predator.',
        '$Xhe recently had a satisfying nap.',
        '$Xhe recently rolled in some dirt.',
        '$Xhe recently climbed a tree.',
        '$Xhe was recently awoken from a nap.',
        '$Xhe was recently chased by $predator.',
        '$Xhe was recently caught in the rain.',
        '$Xhe was recently stuck $place.',
        '$Xhe recently slept $place.'],
    prey: [
        'another cat',
        '$xir own tail',
        'a mouse',
        'a rat',
        'a squirrel',
        'a garter snake',
        'a robin',
        'a blue jay',
        'a pigeon'],
    predator: [
        'another cat',
        'a dog',
        'a raccoon',
        'a crow'],
    predators: [
        'other cats',
        'dogs',
        'raccoons',
        'crows'],
    place: [
        'in a couch',
        'in a chair',
        'in a bed',
        'in a tree',
        'under a car',
        'in a bush'],

    opinion: [
        '$Xhe $enjoys $stuff.'],
    enjoys: [
        'enjoys',
        'loves',
        "doesn't enjoy",
        'abhors',
        'dreams about'],
    stuff: [
        'dry food',
        'wet food',
        'tuna',
        'chicken',
        'pork',
        'beef',
        'flies',
        'grasshoppers',
        'cheese',
        'laser pointers',
        'feathers',
        'scratching posts',
        'litterboxes',
        'the outdoors'],

    trait: [
        '$Xhe needs $drug to get through the day.',
        '$Xir favorite colors are $color and $color.',
        '$Xhe is quick to anger.',
        '$Xhe occasionally overindulges.'],
    drug: [
        'catnip',
        'alcohol',
        'love'],
    color: [
        'blue',
        'red',
        'green',
        'purple',
        'indigo',
        'teal'],
    
    recommendation: [
        '$prescription $proscription'],
    prescription: [
        'Expose $Name to more $stuff in order to improve $xir $stat.'],
    proscription: [
        'Try to keep $Name away from $predators.',
        "Limit $Name's exposure to $drug."],
    stat: [
        'constitution',
        'digestion',
        'behavior',
        'attitude',
        'charisma',
        'dexterity',
        'poison resistance']};

})();
