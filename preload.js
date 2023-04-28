const { contextBridge } = require('electron')

const loginBridge = require('./public/viewscripts/login/index_preload')
const homeBridge = require('./public/viewscripts/home/index_preload')

let bridge
if (location.href == 'http://localhost:3000/') {
  bridge = loginBridge
}

if (location.href.endsWith('http://localhost:3000/home')) {
  bridge = homeBridge
}

contextBridge.exposeInMainWorld('bridge', bridge)
