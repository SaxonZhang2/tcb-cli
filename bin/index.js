#!/usr/bin/env node

const Client = require('../src/index');
const Yargs = require('yargs');

const client = new Client();

/* eslint-disable */
let argv = Yargs
/* eslint-enable */
    .command('init', 'init a miniprogram project', (yargs) => {}, (argv) => {
        client.init(argv);
    })
    .command('database', 'database processing', (yargs) => {
        console.log('database');
    }, (argv) => {
        console.log(argv);
    })
    .command('storage:upload', 'file upload', (yargs) => {}, (argv) => {
        client.init(argv);
    })
    .command('functions', 'call serverless cloud function', (yargs) => {}, (argv) => {
        client.init(argv);
    })
    .command('config', 'configuration', (yargs) => {
        console.log('config');
    }, (argv) => {
        console.log(argv);
    })
    .help()
    .argv;