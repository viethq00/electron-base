const sleep = ms =>
  new Promise(function (res) {
    return setTimeout(res, ms)
  })

async function downloadImage(link) {
  const name = link.split('/').slice(-1)[0]
  if (!fs.existsSync('./images')) fs.mkdirSync('images')
  const pathFile = './images/' + name
  if (fs.existsSync(pathFile)) return pathFile
  for (let index = 0; index < 3; index++) {
    try {
      const res = await axios({
        method: 'GET',
        url: link,
        responseType: 'stream'
      })
      if (res && res.data && res.data.pipe) {
        res.data.pipe(fs.createWriteStream(pathFile))
        return pathFile
      }
    } catch (error) {
      console.log(error)
    }
  }
  return false
}

class Facebook {
  constructor() {}
  async openChrome() {
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--window-size=600,600', '--disable-notifications'],
      executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'
    })
    this.page = (await browser.pages())[0]
    return this.page
  }
  async toHome() {
    await this.page.goto('https://www.facebook.com')
  }
  async addCookie(cookies, domain) {
    for (const key in cookies) {
      if (Object.hasOwnProperty.call(cookies, key)) {
        const element = cookies[key]
        await this.page.setCookie({
          name: key,
          value: element,
          domain: domain,
          path: '/',
          expires: Date.now() + 1000 * 60 * 60 * (30 * 24), // hết hạn sau 30 ngày
          httpOnly: true,
          secure: true,
          sameSite: 'strict'
        })
      }
    }
    await this.page.reload()
  }

  async getCookie() {
    const cookies = await this.page.cookies()
    const dataCookie = {}
    for (let index = 0; index < cookies.length; index++) {
      const element = cookies[index]
      dataCookie[element.name] = element.value
    }
    return dataCookie
  }

  async waitSelect(select) {
    try {
      await this.page.waitForSelector(select)
      return true
    } catch (error) {
      return false
    }
  }
  async waitXpath(xpath) {
    try {
      await this.page.waitForXPath(xpath)
      return true
    } catch (error) {
      return false
    }
  }
  async pageSource() {
    let source = await this.page.content({ waitUntil: 'domcontentloaded' })
    return source
  }
  async findXpathAndClick(xpath, index = 0) {
    const find = await this.page.$x(xpath)
    if (index === -1) {
      index = find.length - 1
    }
    if (find.length >= index && find[index]) {
      await find[index].click()
      return true
    }
    return false
  }
  async checkLogin() {
    const email_container = await this.waitSelect('#email_container')
    if (email_container) {
      const check = await this.page.$x('//div[@id="email_container"]/div[2]')
      const text = await this.page.evaluate(el => el.textContent, check[0])
      return { status: false, msg: text }
    }
    return { status: true, msg: 'Đăng nhập thành công' }
  }
  async checkCheckpoint() {
    for (let index = 0; index < 5; index++) {
      const url = await this.page.url()
      if (url.includes('device')) {
        return false
      } else if (url.includes('checkpoint')) {
        return true
      }
      await sleep(2000)
    }
    return false
  }

  async login(account) {
    await this.page.goto('https://www.facebook.com/')
    const check = await this.waitSelect('#email')
    if (check) {
      await this.page.type('#email', account.username)
      await sleep(1000)
      await this.page.type('#pass', account.password)
      await sleep(2000)
      const login = await this.page.$x(
        '//button[@data-testid="royal_login_button"]'
      )
      //  login
      await login[0].click()
      await sleep(3000)
      const checkLogin = await this.checkLogin()
      return checkLogin
    }
  }
  async mainLogin(data) {
    if (data.cookie) {
      await this.toHome()
      await this.addCookie(data.cookie, '.facebook.com')
      await sleep(2000)
      const source = await this.pageSource()
      if (!source.includes('id="email_container"')) {
        return true
      }
    }
    const login = await this.login(data)
    if (!login.status) {
      console.log(login.msg)
      return false
    }
    return true
  }
  async setPublic() {
    const publicPost = await this.findXpathAndClick(
      '//div[@role="radiogroup"]//*[@data-visualcompletion="ignore-dynamic"]/div[@aria-expanded="false" and @role="radio"]'
    )
    if (publicPost) {
      // click done set public
      const done = await this.findXpathAndClick(
        '//div[@role="button" and @tabindex="0"]/div/div[@data-visualcompletion="ignore"]',
        -1
      )
      if (done) {
        return true
      }
    }
    return false
  }
  async clickCreatePost() {
    // click create
    const buttonCreate1 = await this.findXpathAndClick(
      '//div[@role="navigation"]//div[@role="button"]//*[@fill-rule="evenodd"]'
    )
    if (buttonCreate1) {
      await sleep(1000)
      // click post
      const post = await this.findXpathAndClick(
        '//div[@role="dialog"]//*[@data-visualcompletion="ignore-dynamic"]/*[@aria-expanded="false"]'
      )
      if (post) {
        // click public
        await sleep(5000)
        return await this.setPublic()
      }
    } else {
      console.log('KHONG CO')
    }
  }
  async checkPublic() {
    const check = await this.page.$x(
      '//div[@role="button" and @tabindex="0" ]//div[@aria-hidden="true"]/img'
    )
    if (check.length > 0) {
      // const alt = await check[0].getProperty("alt");
      // const value = await alt.jsonValue();
      await check[0].click()
    }
  }
  findElementByKey(obj, value) {
    for (var k in obj) {
      if (obj.hasOwnProperty(k)) {
        if (typeof obj[k] === 'object') {
          var result = this.findElementByKey(obj[k], value)
          if (result) {
            return result
          }
        } else if (obj[k] === value) {
          return obj
        }
      }
    }
    return null
  }
  async getImageWithLink(listLink) {
    const listPathImage = []
    for (let index = 0; index < listLink.length; index++) {
      const element = listLink[index]
      const path = await downloadImage(element)
      if (path) listPathImage.push(path)
    }
    return listPathImage
  }
  async updateImage(nameUploadImage, listImages) {
    const clickFileImage = await this.findXpathAndClick(
      `//img[contains(@src, "${nameUploadImage}")]`,
      -1
    )
    if (clickFileImage) {
      await this.waitXpath(
        '//input[@type="file" and @accept="image/*,image/heif,image/heic,video/*,video/mp4,video/x-m4v,video/x-matroska,.mkv"]'
      )
      const inputImage = await this.page.$x(
        '//input[@type="file" and @accept="image/*,image/heif,image/heic,video/*,video/mp4,video/x-m4v,video/x-matroska,.mkv"]'
      )
      await inputImage[0].uploadFile(...listImages)
      await sleep(1000)
    }
  }
  async CreatePost(dataPost) {
    await this.page.goto('https://www.facebook.com/me')
    await sleep(5000)
    const clickPublick = await this.clickCreatePost()
    const dataScript = await this.page.$x(
      '//script[@type="application/json" and @data-content-len > 10000]'
    )
    const listJson = []
    for (let index = 0; index < dataScript.length; index++) {
      const data = await this.page.evaluate(
        el => el && el.textContent,
        dataScript[index]
      )
      listJson.push(JSON.parse(data))
    }
    const dataProfile = {}

    if (listJson.length > 0) {
      const picture = this.findElementByKey(
        listJson,
        'CometComposerMagicUploadsSprout'
      )
      picture && picture.icon && (dataProfile['picture'] = picture.icon.uri)
      const everyone = this.findElementByKey(listJson, 'everyone')
      everyone && everyone.uri && (dataProfile['everyone'] = picture.uri)
    }

    if (!clickPublick) {
      await this.checkPublic()
      await sleep(2000)
      await this.setPublic()
    }
    await sleep(3000)
    const area = await this.waitXpath(
      '//div[@role="presentation"]//div[ @data-lexical-editor="true"]'
    )
    if (area) {
      await this.findXpathAndClick(
        '//div[@role="presentation"]//div[ @data-lexical-editor="true"]'
      )
      await sleep(1000)
      await this.page.keyboard.type(dataPost.content)
      const nameUploadImage = dataProfile.picture.split('/').slice(-1)[0]
      if (nameUploadImage) {
        const files = dataPost.images
        if (files && files.length > 0)
          await this.updateImage(nameUploadImage, files)
      } else {
        console.log('KHONG THE UPLOAD FILE')
      }
      // click post
      await sleep(2000)
      await this.findXpathAndClick(
        '//div[starts-with(@aria-labelledby,":r") and @role="dialog" ]//div[@role="button"]/div/div[@data-visualcompletion="ignore"]'
      )
      const cookie = await this.getCookie()
    }
  }
}

async function main() {
  const run = new Facebook()
  await run.openChrome()
  // {
  //   c_user: "100091366042347",
  //   datr: "oKgtZHQCU2I8KyEejqspc5eq",
  //   fr: "0EehPKPYFG39RKaOi.AWWiXkuSCUTEJDua0LDV6ACMN7c.BkLai7.GW.AAA.0.0.BkLai7.AWW3rl7RtYw",
  //   m_page_voice: "100091366042347",
  //   sb: "oKgtZLIEBfjSEmQvJVtz8fw3",
  //   xs: "46%3Ae5hd7_5PKEyvxw%3A2%3A1680713920%3A-1%3A-1",
  //   dbln: "%7B%22100091366042347%22%3A%22upKAJp4D%22%7D",
  // }
  const login = await run.mainLogin({
    username: 'mojahiaumonq@hotmail.com',
    password: 'Nguyen Le PhuQuang123'
  })
  if (login) {
    await run.toHome()
    const checkpoint = await run.checkCheckpoint()
    if (!checkpoint) {
      await run.CreatePost({
        content: 'hihihi',
        images: []
      })
    } else {
      console.log('CHECK POINT')
    }
  }
}
main()
