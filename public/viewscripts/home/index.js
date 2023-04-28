localStorage.setItem("isSet", "set");

async function logoutAmai() {
  await window.mainBridge.logoutAmai("logoutAmai");
}

function loadAccount() {
  window.mainBridge.triggerOnLoad("triggerOnLoad");
  window.mainBridge.onListAccFb(async (event = "LIST_ACC_FACE", value) => {
    await renderAccountTable(value);
  });
  const loadAccount = document.getElementById("btnAdd");
  const loadFileAccount = document.getElementById("btnAddFiles");
  loadAccount.removeAttribute("disabled");
  loadFileAccount.removeAttribute("disabled");
}

function updateAccount(account_id) {
  const getRow = document.querySelector(`[data-update-id="${account_id}"]`);
  if (getRow != null) {
    const child = getRow.children;
    if (child != null) {
      const password = child[5].children[0].value;
      const cookies = child[6].children[0].value;
      const twoFa = child[7].children[0].value;

      const option = {
        account_id: account_id,
        password: password,
        cookie: cookies,
        token_2fa: twoFa,
      };
      console.log(option);
      window.mainBridge.triggerUpdateFB("triggerUpdateFB", option);
    }
  }
}

async function setupTimeChange() {
  const fromChangeJob = document.getElementById("fromChangeJob");
  const toChangeJob = document.getElementById("toChangeJob");
  const fromChangeFace = document.getElementById("fromChangeFace");
  const toChangeFace = document.getElementById("toChangeFace");
  const timeChangeFace = document.getElementById("timeChangeFace");
  const totalCountJob = document.getElementById("totalCountJob");
  const startButton = document.getElementById("startBtn");
  const auto = document.getElementById("auto");

  switch (localStorage.getItem("isSet")) {
    case "set":
      if (startButton.innerText == "Set") {
        startButton.innerText = "Unset";
        window.mainBridge.triggerOnChange("triggerOnChange", {
          autoChangeFace: autoChangeFb(),
          fromChangeJob: getFromChangeJob(),
          toChangeJob: getToChangeJob(),
          fromChangeFace: getFromChangeFace(),
          toChangeFace: getToChangeFace(),
          timeChangeFace: getTimeChangeFace(),
          totalCountJob: getMaxJobPerDay(),
          hideWeb: hideWeb(),
        });

        const loadAccBtn = document.getElementById("loadAccBtn");
        loadAccBtn.disabled = "true";
        // const totalJobInDay = document.querySelector(`span[id="numTaskofDay"]`);
        // totalJobInDay.innerText = `Tổng job trong ngày ${getMaxJobPerDay()}`;

        if (!autoChangeFb()) {
          const btnStartDefault = document.querySelector(
            `button[id="accountStart"]`
          );

          if (btnStartDefault != null) {
            btnStartDefault.removeAttribute("disabled");
          }

          const btnStart = document.querySelectorAll(`button[btn-data-id]`);
          for (let i = 0; i < btnStart.length; i++) {
            btnStart[i].removeAttribute("disabled");
          }
        }

        if (autoChangeFb()) {
          const startAllBtn = document.getElementById(`accountStartAll`);
          startAllBtn.removeAttribute("disabled");
        }

        fromChangeJob.disabled = "true";
        toChangeJob.disabled = "true";
        fromChangeFace.disabled = "true";
        toChangeFace.disabled = "true";
        timeChangeFace.disabled = "true";
        totalCountJob.disabled = "true";
        auto.disabled = "true";

        localStorage.setItem("isSet", "unset");
        break;
      }

    case "unset":
      if (startButton.innerText == "Unset") {
        const startAllBtn = document.getElementById(`accountStartAll`);
        startButton.innerText = "Set";
        fromChangeJob.removeAttribute("disabled");
        toChangeJob.removeAttribute("disabled");
        fromChangeFace.removeAttribute("disabled");
        toChangeFace.removeAttribute("disabled");
        timeChangeFace.removeAttribute("disabled");
        totalCountJob.removeAttribute("disabled");
        auto.removeAttribute("disabled");
        startAllBtn.disabled = "true";
        localStorage.setItem("isSet", "set");

        const loadAccBtn = document.getElementById("loadAccBtn");
        loadAccBtn.removeAttribute("disabled");

        const btnStartDefault = document.querySelector(
          `button[id="accountStart"]`
        );

        if (btnStartDefault != null) {
          btnStartDefault.disabled = "true";
        }

        const btnStart = document.querySelectorAll(`button[btn-data-id]`);
        for (let i = 0; i < btnStart.length; i++) {
          btnStart[i].disabled = "true";
        }
      }
      break;
  }
}

async function addAccountFile() {
  let input = document.createElement("input");
  input.type = "file";
  input.onchange = async (_) => {
    // you can use this method to get file and perform respective operations
    let files = Array.from(input.files);
    await window.mainBridge.triggerAddFiles("triggerAddFiles", files[0].path);
  };
  await input.click();
  await window.mainBridge.onListAccFb(
    async (event = "LIST_ACC_FACE", value) => {
      renderAccountTable(value);
    }
  );
}

async function addAccount() {
  await window.mainBridge.triggerAddAccount("triggerAddAccount", {
    username: getAccountFB(),
    password: getPasswordFB(),
    cookies: getCookiesFB(),
    twoFA: get2FAFb(),
  });

  await window.mainBridge.onListAccFb(
    async (event = "LIST_ACC_FACE", value) => {
      await renderAccountTable(value);
    }
  );
}

async function removeAccount() {
  const array = [];
  const elements = document.getElementsByClassName("accountId");
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].checked) array.push(elements[i].value);
  }

  console.log(array);

  await window.mainBridge.triggerRemoveAccount("triggerRemoveAccount", array);
  await window.mainBridge.onListAccFb(
    async (event = "LIST_ACC_FACE", value) => {
      await renderAccountTable(value);
    }
  );
}

// async function renderJobStatus(data) {
//   console.log("render job status");
//   const doneJob = document.getElementById("doneJob");
//   const errorJob = document.getElementById("errorJob");

//   doneJob.innerText = `Hoàn thành: ${data.doneJob}`;
//   errorJob.innerText = `Lỗi: ${data.errorJob}`;

//   const totalJob = document.getElementById("totalJob");
//   totalJob.innerText = `Tổng: ${data.errorJob + data.succeedJob}`;
// }

async function startJobAccount(rowId) {
  const listOptions = [];
  const getRow = document.querySelector(`[data-id="${rowId}"]`);
  const data_updateID = document
    .querySelector(`[data-id="${rowId}"]`)
    .getAttribute("data-update-id");
  const accountStopAll = document.getElementById("accountStopAll");
  if (getRow != null) {
    const child = getRow.children;
    if (child != null) {
      const isCheck = child[1].children[0].value;
      const id = child[3].children[0].value;
      const username = child[4].children[0].value;
      const password = child[5].children[0].value;
      const cookies = child[6].children[0].value;
      const twoFa = child[7].children[0].value;
      const likePost = child[8].children[0].checked;
      const likePage = child[9].children[0].checked;
      const share = child[10].children[0].checked;
      const comment = child[11].children[0].checked;
      const follow = child[12].children[0].checked;
      const hideWeb = child[13].children[0].checked;

      const option = {
        id: id,
        account_id: Number(data_updateID),
        username: username,
        password: password,
        cookies: cookies,
        twoFa: twoFa,
        listOption: {
          isCheck: isCheck,
          likePost: likePost,
          likePage: likePage,
          share: share,
          comment: comment,
          follow: follow,
          hideWeb: hideWeb,
        },
      };

      listOptions.push(option);

      console.log(listOptions);

      const startJobAccountBtn = document.querySelector(
        `button[btn-data-id="${rowId}"]`
      );

      startJobAccountBtn.disabled = "true";
      accountStopAll.removeAttribute("disabled");

      if (option.listOption.hideWeb) {
        console.log("run hide web");
        await window.mainBridge.triggerStartJobAccount(
          "triggerStartJobAccountHideWeb",
          listOptions
        );

        await window.mainBridge.jobStatusData(
          async (event = "JOB_STATUS_DATA", data) => {
            console.log(data);
            await renderJobStatus(data);
          }
        );
      }

      if (!option.listOption.hideWeb) {
        console.log("run no hide web");
        await window.mainBridge.triggerStartJobAccount(
          "triggerStartJobAccountNoHideWeb",
          listOptions
        );

        await window.mainBridge.jobStatusData(
          async (event = "JOB_STATUS_DATA", data) => {
            console.log(data);
            await renderJobStatus(data);
          }
        );
      }

      const auto = document.getElementById("auto");
      if (!auto.checked) {
        startJobAccountBtn.removeAttribute("disabled");
      }
    }
  }
}

async function startJobAllAccount() {
  const startAllBtn = document.getElementById(`accountStartAll`);
  startAllBtn.disabled = "true";
  const allStartAccountBtn = document.querySelectorAll(`button[btn-data-id]`);
  const listRowId = [];

  for (let i = 0; i < allStartAccountBtn.length; i++) {
    listRowId.push(allStartAccountBtn[i].getAttribute("btn-data-id"));
  }

  const len = listRowId.length;
  let i = 0;
  while (i < listRowId.length) {
    await startJobAccount(listRowId[i], 5000);
    i++;
    if (i == len) {
      i = 0;
    }
  }
}
async function stopJobAllAccount() {
  await window.mainBridge.triggerOnStop("triggerOnStop");
  await window.mainBridge.onListAccFb(
    async (event = "LIST_ACC_FACE", value) => {
      await renderAccountTable(value);
    }
  );
}

function autoChangeFb() {
  return document.getElementById("auto").checked;
}

function hideWeb() {
  return document.getElementById("hideWeb").checked;
}
function getFromChangeJob() {
  return Number(document.getElementById("fromChangeJob").value);
}

function getToChangeJob() {
  return Number(document.getElementById("toChangeJob").value);
}

function getFromChangeFace() {
  return Number(document.getElementById("fromChangeFace").value);
}

function getToChangeFace() {
  return Number(document.getElementById("toChangeFace").value);
}

function getTimeChangeFace() {
  return Number(document.getElementById("timeChangeFace").value);
}

function getMaxJobPerDay() {
  return Number(document.getElementById("totalCountJob").value);
}

function getChangeFbCb() {
  return document.getElementById("changeFacebookCheckBox").checked;
}

function getMChangeFbCb() {
  return document.getElementById("MobilechangeFacebookCheckBox").checked;
}

function getAccountFB() {
  return document.getElementById("AccountFb").value;
}

function getPasswordFB() {
  return document.getElementById("PasswordFb").value;
}

function getCookiesFB() {
  return document.getElementById("CookiesFb").value;
}

function get2FAFb() {
  return document.getElementById("2FAFB").value;
}

async function renderAccountTable(accountData) {
  let html = "";
  for (let i = 0; i < accountData.length; i++) {
    html += `  <tr data-id="${accountData[i]["id"]}" data-update-id="${accountData[i]["account_id"]}">
                  <form id="formAccount">
                    <td class="text-center">
                      <input
                        type="checkbox"
                        name="selectAcc"
                        value="${accountData[i]["id"]}"
                        class="accountId"
                      />
                    </td>
                    <th></th>
                    <td class="text-center">
                      <input
                        type="text"
                        name="id"
                        value="${accountData[i]["id"]}"
                        class="form-control"
                        required
                        disabled
                      />
                    </td>
                    <td class="text-center">
                      <input
                        type="text"
                        name="username"
                        value="${accountData[i]["username"]}"
                        class="form-control"
                        required
                      />
                    </td>
                    <td class="text-center">
                      <input
                        type="password"
                        name="password"
                        value="${accountData[i]["password"]}"
                        class="form-control"
                        required
                      />
                    </td>
                    <td class="text-center">
                      <input
                        type="text"
                        value="${accountData[i]["cookies"]}"
                        name="cookies"
                        class="form-control"
                        required
                      />
                    </td>
                    <td class="text-center">
                      <input
                        type="text"
                        value="${accountData[i]["twoFA"]}"
                        name="2FA"
                        class="form-control"
                        required
                      />
                    </td>
                 
                    <td class="text-center">
                      <input
                        type="checkbox"
                        id="likePost"
                        name="likePost"
                        value="likePost"
                        class="likePost"
                        checked="true"
                      />
                    </td>
                    <td class="text-center">
                      <input
                        type="checkbox"
                        id="likePage"
                        name="likePage"
                        value="likePage"
                        class="likePage"
                        checked="true"
                      />
                    </td>
                    <td class="text-center">
                      <input
                        type="checkbox"
                        id="share"
                        name="share"
                        value="share"
                        class="share"
                        checked="true"
                      />
                    </td>
                    <td class="text-center">
                      <input
                        type="checkbox"
                        id="comment"
                        name="comment"
                        value="comment"
                        class="comment"
                        checked="true"
                      />
                    </td>
                    <td class="text-center">
                      <input
                        type="checkbox"
                        id="follow"
                        name="follow"
                        value="follow"
                        class="follow"
                        checked="true"
                      />
                    </td>

                    <td class="text-center">
                      <input
                        type="checkbox"
                        id="hideWeb"
                        name="hideWeb"
                        value="hideWeb"
                        class="input-checkbox"
                        checked="true"
                      />
                    </td>
                    <td class="text-center" style="display: flex">
                      <button btn-data-id=${accountData[i]["id"]} style="margin-right: 20px" type="submit" disabled="true" class="btn btn-success" onclick="startJobAccount(${accountData[i]["id"]} )">
                        Start
                      </button>

                       <button btn-update-id=${accountData[i]["account_id"]} type="submit" class="btn btn-success" onclick="updateAccount(${accountData[i]["account_id"]} )">
                        Update
                      </button>
                    </td>
                  </form>
                </tr>`;
  }

  document.getElementById("listAccFb").innerHTML = html;
}
