const webdriver = require('selenium-webdriver')

module.exports = {
  classname: 'utils',
  sleep: ms => new Promise(resolve => setTimeout(resolve, ms)),

  parseCookies: async cookieStr => {
    if (!cookieStr) {
      return {}
    }

    const cookies = cookieStr.split(';')
    const data = {}

    for (let j = 0; j < cookies.length; j++) {
      const cookie = cookies[j].trim()
      if (!cookie) {
        continue
      }

      const keyVal = cookie.split('=')

      if (keyVal.length == 2) {
        data[keyVal[0]] = keyVal[1]
      }
    }

    return data
  },

  shuffle: async array => {
    let currentIndex = array.length,
      randomIndex

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--

      // And swap it with the current element.
      ;[array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex]
      ]
    }

    return array
  }
}
