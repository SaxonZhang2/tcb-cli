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
    .command(['database', 'add'], 'add data', (yargs) => {}, (argv) => {
        client.init(argv);
    })
    .command(['database', 'remove'], 'remove data', (yargs) => {}, (argv) => {
        client.init(argv);
    })
    .command(['database', 'update'], 'update data', (yargs) => {}, (argv) => {
        client.init(argv);
    })
    .command(['database', 'set'], 'set data', (yargs) => {}, (argv) => {
        client.init(argv);
    })
    .command(['storage', 'upload'], 'file upload', (yargs) => {}, (argv) => {
        client.init(argv);
    })
    .command(['functions', 'call'], 'call serverless cloud function', (yargs) => {}, (argv) => {
        client.init(argv);
    })
    .command(['functions', 'debug'], 'debug serverless cloud function', (yargs) => {}, (argv) => {
        client.init(argv);
    })
    .command(['config', 'list'], 'list configuration', (yargs) => {}, (argv) => {
        client.init(argv);
    })
    .command(['config', 'add'], 'add configuration', (yargs) => {}, (argv) => {
        client.init(argv);
    })
    .command(['config', 'update'], 'update configuration', (yargs) => {}, (argv) => {
        client.init(argv);
    })
    .command(['config', 'remove'], 'remove configuration', (yargs) => {}, (argv) => {
        client.init(argv);
    })
    .help()
    .argv;