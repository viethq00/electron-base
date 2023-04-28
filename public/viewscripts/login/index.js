function loginAmai() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  let user = { username: username, password: password };
  window.indexBridge.loginAmai("loginAmai", user);
  window.mainBridge.onListAccFb((event = "LIST_ACC_FACE", value) => {
    window.mainBridge.triggerAddFiles("triggerAddFiles", value);
  });
  // window.indexBridge.sendData("user", user);
}
