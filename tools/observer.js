const si = require("systeminformation");
const osu = require('node-os-utils')
const oss = require('os')

const menu = [];


var cpu;
var gpu;
var memory;
var motherboard;
var os
var network;
var battery;
var devices;

const personAddPromise = new Promise((resolve) => {
    resolvePersonAddPromise = resolve;
})


async function setup() {
    cpu = await si.cpu();
    if (cpu) {
        menu.push({
            name: 'Cpu',
            subtitle: oss.cpus()[0].model,
            data: cpu
        });
    }
    gpu = await si.graphics();
    if (gpu) {
        menu.push({
            name: 'Gpu',
            subtitle: gpu.controllers[0].model,
            data: gpu
        });
    }
    memory = await si.mem();
    if (memory) {
        menu.push({
            name: 'Memory',
            subtitle: (memory.total / (1024 ** 3)).toFixed(1) + ' Go',
            data: memory
        });
    }
    motherboard = await si.baseboard();
    if (motherboard) {
        menu.push({
            name: 'Motherboard',
            subtitle: motherboard.model,
            data: motherboard
        });
    }
    os = await si.osInfo();
    if (os) {
        menu.push({
            name: 'Os',
            subtitle: os.platform,
            data: os
        });
    }
    network = await si.networkInterfaces();
    if (network) {
        menu.push({
            name: 'Network',
            subtitle: await si.networkGatewayDefault(),
            data: network
        });
    }
    battery = await si.battery();
    if (battery) {
        if (battery.hasBattery) {
            menu.push({
                name: 'Battery',
                subtitle: battery.model,
                data: battery
            });

        }
    }
    resolvePersonAddPromise({ ok: true })
}

async function getmenu() {
    //await personAddPromise;
    return { ok: true, data: menu }
}

async function getusedcpu() {
    return await si.currentLoad();
}

module.exports = { setup, getmenu, getusedcpu }