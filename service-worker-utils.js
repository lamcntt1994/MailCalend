// This file can be imported inside the service worker,
// which means all of its functions and variables will be accessible
// inside the service worker.
// The importation is done in the file `service-worker.js`.

// console.log("External file is also loaded!")
//
// //API
// const url= "https://localhost.test/api/calendas";
// getAPICalendar = function (){
//     fetch(url)
//         .then(respose => respose.json())
//         .then(data => {
//             console.log(data)
//         })
//         .catch(error => {
//             console.log(error)
//         })
// }
// SetAPICalendar = function (data){
//     console.log(JSON.stringify(data))
//     fetch(url, {
//         method:"POST",
//         headers:{
//             Accept:'application/json',
//             'Content-type':'application/json'
//         },
//         body:JSON.stringify(data)
//     })
//         .then(respose => respose.json())
//         .then(data => {
//             console.log(data)
//         })
//         .catch(error => {
//             console.log(error)
//         })
// }
// data = {
//     "emplID":3,
//     "calendasData":"test extension chrome",
//     "report_date":"2018-03-02"
// }
// SetAPICalendar(data);
//
// function init() {
    // fetch(chrome.runtime.getURL('/test'))
    // fetch('https://scweb.saint-care.com/sites/limited/is/DocLib18/0-1_共通/30_運用保守/43_保守管理/xx.会社コードリスト/company_code.txt')
    //     .then(response => response.text())
    //     .then(text => {
    //         text = text + "31\t12\t00\t13\t00\t91：休憩"
    //         // navigator.clipboard.writeText("lamcntt1994");
    //         console.log(text)
    //        return text;
    //     });

    // document.getElementById('saveFile').addEventListener('click', saveFile, false);
// }
// chrome.runtime.sendMessage({ type: 'text', url: 'https://scweb.saint-care.com/sites/limited/is/DocLib18/0-1_共通/30_運用保守/43_保守管理/xx.会社コードリスト/company_code.txt' }, response => {
//     console.log(response)
//     console.log("lamtest")
// })
// GetDataAPICalendar = function (datas){
//     var data = new FormData();
//     data.append( "json", JSON.stringify(datas) );
//     fetch(url + "/show", {
//         method:"POST",
//         body: data
//     })
//         .then(respose => respose.json())
//         .then(data => {
//             console.log(data)
//         })
//         .catch(error => {
//             console.log(error)
//         })
// }


// console.log(chrome.runtime.getURL("/fixedFile.txt"))
// var text = init();
// saveFile(text)
// chrome.storage.local.clear()

// test = "9:00 まで,空き時間, 9:00 から 10:00,環境整備＆朝メール, 10:00 から 11:00,branch life/develop + PRE_20240522, 11:00 から 12:00,PRESQL確認, 12:00 から 13:00,休憩, 13:00 から 19:00,PRE確認, 16:00 から 16:30,【Web会議】コウェル社週次定例, 17:30 から 18:00,夜メール, 18:00から,空き時間"
// console.log(SetCalenDataToLocal(test, 3));
// i = 3
// console.log(data)
// data[1] = test;
// console.log(data)
// set = {calendars: data}
// chrome.storage.local.set(set).then(() => {
// });
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getStorageData(keys) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(keys, function(result) {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(result);
        });
    });
}
async function SetCalenDataToLocal(data, date) {
    try {
        const result  = await getStorageData(["calendars"]);
        console.log(result)
        result.calendars[date] = data
        chrome.storage.local.set({calendars: result.calendars}).then(() => {
            console.log(result.calendars)
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
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
        chrome.tabs.create({ url: "https://example.com" }, (tab) => {
            // Đợi tab mới load xong rồi chèn content script
            chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                if (tabId === tab.id && info.status === "complete") {
                    chrome.tabs.onUpdated.removeListener(listener);

                    // Inject content script
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        func: () => {
                            const result = {};
                            for (let i = 0; i < localStorage.length; i++) {
                                const key = localStorage.key(i);
                                result[key] = localStorage.getItem(key);
                            }
                            console.log("LocalStorage:", result);
                            // Gửi về background nếu muốn xử lý
                            chrome.runtime.sendMessage({ type: "localStorageData", data: result });
                        }
                    });
                }
            });
        });
    }
    if (message.type === "localStorageData") {
        console.log("LocalStorage từ tab mới:", message.data);
    }
});

////////////////////////////////////////////////////


