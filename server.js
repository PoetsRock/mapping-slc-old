'use strict';

/**
 * Module dependencies.
 */

//if(process.env.NODE_ENV === 'production') {
//  let NEW_RELIC_KEY = require('config/env/local-development.js');
  //require('newrelic');
//}

var app = require('./config/lib/app');
var server = app.start();
//console.log('process.env:\n', process.env);
console.log('process.env.NODE_ENV:\n', process.env.NODE_ENV);

console.log('   __    __                            __     __                                            __       __');
console.log('  /  |  /  |                          /  |   /  |                                          /  \     /  |');
console.log('  $$ |  $$ | ______   __   __        _$$ |_  $$ |___    _____    _____   _____             $$  \   /$$ | ______    ____      ____   ____    ______');
console.log('  $$ |__$$ |/      \\/ |  /  |      / $$   | $$      \\ /      \\ /      \\ /      \\           $$$ \\ /$$$ |/       \\ /      \\   /    \\ /     \\ /\\');
console.log('  $$    $$ /$$$$$$  $$ |  $$ |      $$$$$$/  $$$$$$$  /$$$$$$  /$$$$$$  /$$$$$$  |         $$$$  /$$$$ |$$$$$$  /$$$$$$  /$$$$$$  /$$$$$$  /$$$$$$  |');
console.log('  $$$$$$$$ $$    $$ $$ |  $$ |        $$ | __$$ |  $$ $$    $$ $$ |  $$/$$    $$ |         $$ $$ $$/$$ |/    $$ $$ |  $$ $$ |  $$ $$    $$ $$ |  $$/');
console.log('  $$ |  $$ $$$$$$$$/$$\\__ $$ |        $$ |/  $$ |  $$ $$$$$$$$/$$ |     $$$$$$$$/  __      $$ |$$$/ $$ /$$$$$$$ $$ |__$$ $$ |__$$ $$$$$$$$/$$ |__');
console.log('  $$ |  $$ $$       $$    $$ |        $$  $$/$$ |  $$ $$       $$ |     $$       /  |      $$ | $/  $$ $$    $$ $$    $$/$$    $$/$$       $$ /  |');
console.log('  $$/   $$/ $$$$$$$/ $$$$$$$ |         $$$$/ $$/   $$/ $$$$$$$/$$/       $$$$$$$/$$/       $$/      $$/ $$$$$$$/$$$$$$$/ $$$$$$$/  $$$$$$$/$$/$$/');
console.log('                    /  \\__$$ |                                                   $/                             $$ |     $$ |');
console.log('                    $$    $$/                                                                                   $$ |     $$ |');
console.log('                     $$$$$$/                                                                                    $$/      $$/');
