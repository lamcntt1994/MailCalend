// This is the service worker script, which executes in its own context
// when the extension is installed or refreshed (or when you access its console).
// It would correspond to the background script in chrome extensions v2.

// background.js

chrome.runtime.onInstalled.addListener(function() {
    console.log("Extension installed");
});
chrome.storage.local.get(["calendars"]).then((result) => {
    if (!result.calendars){
        chrome.storage.local.set({calendars: []})
    }
});

chrome.storage.local.get(["mail_setting"]).then((result) => {
    console.log(result)
    if (!result.mail_setting) {
        chrome.storage.local.set({mail_setting: [["1", "\"ＳＷ開発部（メール）\" <sw_kaihatsubu_sc@saint-works.com>", 1, 1, "2024-10-16", "2099-10-20"]]})
    }
});



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fetchData") {
        fetch(message.url)
            .then(response => response.text())
            .then(text => {
                jsonData = JSON.parse(text)
                sendResponse({ data: jsonData });
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                sendResponse({ error: error.message });
            });
        return true;
    }
    if (message.action === "storageSet") {
        try {
            SetCalenDataToLocal(message.data, message.date)
            sendResponse({ response: true });
        }
        catch (error) {
            console.error("Error fetching data:", error);
            sendResponse({ error: error.message });
        }

    }
    if (message.type === "openAndReadLocalStorageKingOfTime") {
        chrome.tabs.create({ url: "https://s4.ta.kingoftime.jp/independent/recorder2/personal/#", active: false }, (tab) => {
            // Tab　ロードした後シートを追加する
            chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                if (tabId === tab.id && info.status === "complete") {
                    chrome.tabs.onUpdated.removeListener(listener);

                    // シートの内容を追加する
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        func: async (tabid, data) => {
                            config = {first:"出勤", breakIn:"休始", breakOut:"休終", last:"退勤"}
                            //user情報get
                            function get_user_token(result){
                                json = result["PARSONAL_BROWSER_RECORDER@SETTING"];
                                return JSON.parse(json)["user"]["user_token"];
                            }
                            // action id:出勤、退勤など
                            function get_acction_id(result, acction_name){
                                json = result["PARSONAL_BROWSER_RECORDER@SETTING"];
                                record_button = JSON.parse(json)["timerecorder"]["record_button"]
                                for (let i= 0; i<record_button.length; i++){
                                    if (record_button[i]["name"] == acction_name){
                                        return record_button[i]["id"];
                                    }
                                }
                                return false;
                            }
                            //日月のフォマード
                            function toTwoDigits(num) {
                                return num.toString().padStart(2, '0');
                            }
                            //年月日を文字にする
                            function getFullDateString(time){
                                var date = new Date()

                                var year = date.getFullYear();
                                var month = date.getMonth() + 1;
                                var day = date.getDate();
                                var hour = time.split(":")[0].trim()
                                var minute = time.split(":")[1].trim()
                                var second = "00";
                                return "" + year + toTwoDigits(month) + toTwoDigits(day) + toTwoDigits(hour) + toTwoDigits(minute) + toTwoDigits(second)
                            }
                            //現在の位置を取得する
                            function getCurrentLocation() {
                                return new Promise((resolve, reject) => {
                                    navigator.geolocation.getCurrentPosition(
                                        (loc) => {
                                            const { latitude, longitude } = loc.coords;
                                            console.log(loc);
                                            resolve(loc);
                                        },
                                        (err) => {
                                            console.error("Error:", err);
                                            reject(err);
                                        }
                                    );
                                });
                            }
                            //get datetime fomat
                            function getDateObject(date, isUtc) {
                                if (!date) {
                                    date = new Date()
                                } else {
                                    var newDate = new Date();
                                    newDate.setTime(date.getTime());
                                    date = newDate
                                }
                                if (isUtc) {
                                    return new Date(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate(),date.getUTCHours(),date.getUTCMinutes(),date.getUTCSeconds(),date.getUTCMilliseconds())
                                }
                                return date
                            }
                            function setPosData(pos, startDate, endDate) {
                                if (pos == null) {
                                    return ""
                                }
                                var posStr = pos.timestamp + "," + pos.coords.latitude + "," + pos.coords.longitude + "," + pos.coords.altitude + "," + pos.coords.accuracy + "," + pos.coords.altitudeAccuracy + "," + pos.coords.heading + "," + pos.coords.speed + "," + startDate + "," + endDate;
                                return posStr
                            }
                            async function creat_json_data(result, action_name, timestamp){
                                action_code = get_acction_id(result, action_name);
                                user_token = get_user_token(result)
                                let latitude = null
                                let longitude = null
                                const loc = await getCurrentLocation();
                                const jsonData  = {
                                            "status":3,
                                            "name":action_name,
                                            "id":action_code,
                                            "latitude":loc.coords.latitude,
                                            "longitude":loc.coords.longitude,
                                            "send_timestamp":timestamp,
                                            "highAcPos":setPosData(loc, getDateObject(null, false), getDateObject(null, false)),
                                            "lowAcPos":setPosData(loc, getDateObject(null, false), getDateObject(null, false)),
                                            "highAccuracyFlg":true,
                                            "record_timestamp":timestamp,
                                            "credential_code":42,
                                            "record_image":null,
                                            "error_code":"-1",
                                            "image_result":"0",
                                            "user_token":user_token,
                                            "timerecorder_id":null,
                                            "xhr_statuc_code":0
                                        }
                                return jsonData;

                            }
                            try {
                                const result = {};
                                for (let i = 0; i < localStorage.length; i++) {
                                    const key = localStorage.key(i);
                                    result[key] = localStorage.getItem(key);
                                }

                                //発送するデータ作成
                                localStData =[]
                                for (const key of Object.keys(data)) {
                                    const jsonData = await creat_json_data(result, config[key], getFullDateString(data[key]));
                                    localStData.push(jsonData);
                                }
                                //発送するデータチェック↓
                                console.log(JSON.stringify(localStData))
                                //発送するデータをLocalstorageに登録する、（ページのリロードイする時に発送しないデータを自動に発送すること）
                                localStorage.setItem("PARSONAL_BROWSER_RECORDER@LOCAL_RECORD_"+ get_user_token(result), JSON.stringify(localStData));
                                

                                return true
                            }catch (e){
                                console.error(e.message)
                                return false
                            }
                        },
                        args: [tab.id, message.data]
                    }).then((results)=>{
                         sendResponse(results)
                        // chrome.tabs.remove(tab.id)
                    });
                }
            });
        });
        return true
    }
    if (message.type === "done") {
        chrome.tabs.remove(message.tabId); // đóng tab
    }
});

// chrome.identity.getAuthToken({ interactive: true }, function(token) {
//     if (chrome.runtime.lastError) {
//         console.error("Error getting token:", chrome.runtime.lastError.message);
//         return;
//     }
//
//     fetch("https://graph.microsoft.com/v1.0/me/messages", {
//         headers: {
//             "Authorization": "Bearer " + token
//         }
//     })
//         .then(response => response.json())
//         .then(data => {
//             console.log("Emails:", data);
//         })
//         .catch(error => console.error("Error fetching emails:", error));
// });
// chrome.storage.local.set({calendars: []})
// Importing and using functionality from external files is also possible.
// importScripts('service-worker-utils.js')


// If you want to import a file that is deeper in the file hierarchy of your
// extension, simply do `importScripts('path/to/file.js')`.
// The path should be relative to the file `manifest.json`.
