const { app, BrowserWindow, ipcMain } = require('electron')
const webdriver = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const path = require('path')
const isDev = require('electron-is-dev')

const service = new chrome.ServiceBuilder(
  path.join(__dirname, '/chromedriver.exe')
)

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const axios = require('axios')
const fs = require('fs')
puppeteer.use(StealthPlugin())
// const puppeteer = require("puppeteer");

require('@electron/remote/main').initialize()

function createMainWindow() {
  // Create the browser mainWindow
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000/'
      : `file://${path.join(__dirname, '../build/index.html')}`
  )

  let wc = mainWindow.webContents
  wc.openDevTools()
}

app.on('ready', createMainWindow)

// Quit when all mainWindows are closed.
app.on('mainWindow-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darmainWindow') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a mainWindow in the app when the
  // dock icon is clicked and there are no other mainWindows open.
  if (BrowsermainWindow.getAllmainWindows().length === 0) createMainWindow()
})

ipcMain.handle('loginTool', async (event, data) => {
  console.log('LOGIN SUCCESS')
})

ipcMain.handle('openChrome', async (event, data) => {
  console.log('OPEN CHROME')
  const readFile = fs.readFileSync('./facebook.js')

  eval(readFile.toString())

  // console.log('OPEN CHROME')
  // const screen = {
  //   width: 800,
  //   height: 600
  // }
  // let driver = new webdriver.Builder()
  //   .setChromeOptions(
  //     new chrome.Options()
  //       .windowSize(screen)
  //       .addArguments('test-type')
  //       .addArguments('--disable-dev-shm-usage')
  //       .addArguments('--disable-domain-reliability')
  //       .addArguments('--disable-notifications')
  //   )
  //   .forBrowser('chrome')
  //   .setChromeService(service)
  //   .build()
})
