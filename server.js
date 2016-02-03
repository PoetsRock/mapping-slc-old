'use strict';

/**
 * Module dependencies.
 */
console.log('process.env:\n', process.env);
console.log('process.env.NODE_ENV:\n', process.env.NODE_ENV);
if(process.env.NODE_ENV === 'production') {
  //let NEW_RELIC_KEY = require('config/env/local-development.js');
  require('newrelic');
}
var app = require('./config/lib/app');
var server = app.start();

console.log('   __    __                            __     __                                            __       __');
console.log('  /  |  /  |                          /  |   /  |                                          /  \     /  |');
console.log('  $$ |  $$ | ______  __    __        _$$ |_  $$ |____   ______   ______   ______           $$  \   /$$ | ______   ______   ______   ______   ______');
console.log('  $$ |__$$ |/      \\/  |  /  |      / $$   | $$      \\ /      \\ /      \\ /      \\          $$$  \\ /$$$ |/      \\ /      \\ /      \\ /      \\ /\\');
console.log('  $$    $$ /$$$$$$  $$ |  $$ |      $$$$$$/  $$$$$$$  /$$$$$$  /$$$$$$  /$$$$$$  |         $$$$  /$$$$ |$$$$$$  /$$$$$$  /$$$$$$  /$$$$$$  /$$$$$$  |');
console.log('  $$$$$$$$ $$    $$ $$ |  $$ |        $$ | __$$ |  $$ $$    $$ $$ |  $$/$$    $$ |         $$ $$ $$/$$ |/    $$ $$ |  $$ $$ |  $$ $$    $$ $$ |  $$/');
console.log('  $$ |  $$ $$$$$$$$/$$ \\__$$ |        $$ |/  $$ |  $$ $$$$$$$$/$$ |     $$$$$$$$/ __       $$ |$$$/ $$ /$$$$$$$ $$ |__$$ $$ |__$$ $$$$$$$$/$$ |__');
console.log('  $$ |  $$ $$       $$    $$ |        $$  $$/$$ |  $$ $$       $$ |     $$       /  |      $$ | $/  $$ $$    $$ $$    $$/$$    $$/$$       $$ /  |');
console.log('  $$/   $$/ $$$$$$$/ $$$$$$$ |         $$$$/ $$/   $$/ $$$$$$$/$$/       $$$$$$$/$$/       $$/      $$/ $$$$$$$/$$$$$$$/ $$$$$$$/  $$$$$$$/$$/$$/');
console.log('                    /  \\__$$ |                                                   $/                             $$ |     $$ |');
console.log('                    $$    $$/                                                                                   $$ |     $$ |');
console.log('                     $$$$$$/                                                                                    $$/      $$/');
