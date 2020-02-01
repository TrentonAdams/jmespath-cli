#!/usr/bin/env node

/**
 *  
 * Copyright [2020] [Trenton D. Adams]
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 */

const { exec } = require('child_process');
const jmespath = require('jmespath');
const program = require('commander');
const fs = require('fs');

program
    .option('-f|--file <file>', 'Input file rather than stdin')
    .option('-p|--path <path>', 'The jmespath expression')
    .on('--help', () => {
        console.log();
        console.log('$ cat file.json | jmespath -p \'[].propertyName\'');
        console.log('$ jmespath -p \'[].propertyName\' -f file.json');
        console.log();

    })
    .parse(process.argv);

// console.log(program.path);
let json = {};
if (program.file) {
    json = JSON.parse(fs.readFileSync(program.file));
    processJson(json, program.path);
} else {
    let data = '';
    process.stdin
        .on('data', chunk => {
            data += chunk;
            // console.log('data', data);
        })
        .on('close', () => {
            // console.log('close');
            processJson(JSON.parse(data), program.path)
        });
}

function processJson(json, jmes) {
    console.log(JSON.stringify(jmespath.search(json, jmes)));
}