// import fetchLocation from "./api/fetchLocations.js";
//API
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
// SetAPICalendar = function (datas){
//     var data = new FormData();
//     data.append( "json", JSON.stringify(datas) );
//     fetch(url, {
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
// data = {
//     "emplID": 3,
//     "calendasData": "test extension chrome",
//     "report_date": "2018-03-02"
// }
// SetAPICalendar(data);


// sendDataToAPI = function (dataCalendar) {
//     var today = new Date();
//     var month = today.getMonth()+1
//     var data = {
//         "emplID":"036379",
//         "calendasData":dataCalendar,
//         "report_date":today.getFullYear() + "-" + month + "-" + today.getDay()//"2018-03-02" today
//     };
//     SetAPICalendar(data)
// }
// getDataToDayByAPI = function () {
//     var today = new Date();
//     var month = today.getMonth()+1
//     var data = {
//         "emplID":"036379",
//         "report_date":today.getFullYear() + "-" + month + "-" + today.getDay()//"2018-03-02" today
//     };
//     GetDataAPICalendar(data)
// }
//////////////////////////////////////////////////////////////////////////////////////////////////////////

const noPlans = "<div class=\"elementToProof\" style=\"text-align: center; font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, Calibri, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);\">【朝メール送信し忘れました】</div>";
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
        //初月だったらローカルストーリーリサイクル
        if (date == 1){
            chrome.storage.local.set({calendars: []})
        }
        const result  = await getStorageData(["calendars"]);
        result.calendars[date] = data
        chrome.storage.local.set({calendars: result.calendars}).then(() => {
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
function sendDataToLocalStorage(data, date){
    try {
        SetCalenDataToLocal(data, date)
    }
    catch (error) {
        console.error("Error fetching data:", error);
    }
}

function BreaktimeData(data) {
    // data = data.split(",")
    const isLargeNumber = (element) => element.match(/^.*憩.*$/) || element.match(/^.*昼.*$/);
    Break = data[data.findIndex(isLargeNumber) - 1]
    starTime = Break.split("から")[0]
    endTime = Break.split("から")[1]
    return [starTime, endTime];
}
function get_data_for_Kot(data){
    rp_data = [];
    rp_data["first"] = data[2].split("から")[0];
    rp_data["breakIn"] = BreaktimeData(data)[0];
    rp_data["breakOut"] = BreaktimeData(data)[1 ];
    rp_data["last"] = data[data.length - 4].split("から")[1];
    return rp_data;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////

setTimeout(() =>
    yoteibutton(), "3000");
    function yoteibutton() {

        var btn = "<div id=\"yotei_container\" class=\"M3pcB5evSAtYMozck1WU7A==\"><div class=\"rSDngy50C4hLvjN77R3dbA==\"><button onclick=\"yoteiOnclick()\" class=\"clgiLVKPzugZZns0LiPTqw== o365sx-button\" id=\"yotei\" aria-label=\"予定メール作成\" role=\"button\" type=\"button\" title=\"予定メール作成\" aria-expanded=\"false\">"+
            "<svg height=\"1em\" width=\"1em\" fill=\"currentColor\" version=\"1.1\" style=\"font-size: 20px; vertical-align: text-bottom;\" id=\"Capa_1\" viewBox=\"0 0 59 59\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
            "<g style=\"\">\n" +
            "    <path d=\"M37,32h9V21h-9h-2h-7h-2h-7h-2H8v9v2v7v2v9h9h2h9v-9v-2v-7h7H37z M37,23h7v7h-7V23z M19,23h7v7h-7V23z M10,23h7v7h-7V23z M10,32h7v7h-7V32z M17,48h-7v-7h7V48z M26,48h-7v-7h7V48z M26,39h-7v-7h7V39z M28,30v-7h7v7H28z\" style=\"fill: rgb(255, 255, 255);\"/>\n" +
            "    <path d=\"M25,55H3V16h48v13c0,0.553,0.447,1,1,1s1-0.447,1-1V15V5c0-0.553-0.447-1-1-1h-5V1c0-0.553-0.447-1-1-1h-7 c-0.553,0-1,0.447-1,1v3H16V1c0-0.553-0.447-1-1-1H8C7.447,0,7,0.447,7,1v3H2C1.447,4,1,4.447,1,5v10v41c0,0.553,0.447,1,1,1h23 c0.553,0,1-0.447,1-1S25.553,55,25,55z M40,2h5v3v3h-5V5V2z M9,2h5v3v3H9V5V2z M3,6h4v3c0,0.553,0.447,1,1,1h7c0.553,0,1-0.447,1-1 V6h22v3c0,0.553,0.447,1,1,1h7c0.553,0,1-0.447,1-1V6h4v8H3V6z\" style=\"fill: rgb(255, 255, 255);\"/>\n" +
            "    <g style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;\" transform=\"matrix(2.81, 0, 0, 2.81, -66.384537, -94.730286)\">\n" +
            "      <path d=\"M 43.525 53.465 L 37.092 53.465 C 36.588 53.465 36.178 52.99 36.178 52.405 L 36.178 51.038 C 36.178 50.927 36.255 50.837 36.352 50.837 C 36.448 50.837 36.526 50.927 36.526 51.038 L 36.526 52.405 C 36.526 52.767 36.78 53.062 37.092 53.062 L 43.525 53.062 C 43.837 53.062 44.091 52.767 44.091 52.405 L 44.091 47.455 C 44.091 47.093 43.837 46.8 43.525 46.8 L 37.092 46.8 C 36.78 46.8 36.526 47.093 36.526 47.455 L 36.526 48.807 C 36.526 48.918 36.448 49.009 36.352 49.009 C 36.255 49.009 36.178 48.918 36.178 48.807 L 36.178 47.455 C 36.178 46.871 36.588 46.395 37.092 46.395 L 43.525 46.395 C 44.029 46.395 44.439 46.871 44.439 47.455 L 44.439 52.405 C 44.439 52.99 44.029 53.465 43.525 53.465 Z\" style=\"stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill-rule: nonzero; opacity: 1; transform-box: fill-box; transform-origin: 50% 50%; fill: rgb(255, 255, 255);\" stroke-linecap=\"round\"/>\n" +
            "      <path d=\"M 41.389 49.93 L 43.331 47.864 C 43.402 47.79 43.407 47.662 43.342 47.579 C 43.277 47.497 43.167 47.493 43.096 47.568 L 40.309 50.531 L 37.521 47.568 C 37.45 47.493 37.34 47.497 37.275 47.579 C 37.21 47.662 37.215 47.79 37.286 47.864 L 39.228 49.93 L 37.286 51.996 C 37.215 52.073 37.21 52.2 37.275 52.282 C 37.309 52.326 37.356 52.347 37.403 52.347 C 37.446 52.347 37.488 52.33 37.521 52.294 L 39.485 50.205 L 40.191 50.954 C 40.224 50.991 40.266 51.008 40.309 51.008 C 40.351 51.008 40.393 50.991 40.427 50.954 L 41.132 50.205 L 43.096 52.294 C 43.13 52.33 43.172 52.347 43.214 52.347 C 43.261 52.347 43.308 52.326 43.342 52.282 C 43.407 52.2 43.402 52.073 43.331 51.996 L 41.389 49.93 Z\" style=\"stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill-rule: nonzero; opacity: 1; transform-box: fill-box; transform-origin: 50% 50%; fill: rgb(255, 255, 255);\" stroke-linecap=\"round\"/>\n" +
            "      <path d=\"M 36.94 50.133 L 34.864 50.133 C 34.767 50.133 34.689 50.042 34.689 49.93 C 34.689 49.819 34.767 49.728 34.864 49.728 L 36.94 49.728 C 37.037 49.728 37.115 49.819 37.115 49.93 C 37.115 50.042 37.036 50.133 36.94 50.133 Z\" style=\"stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill-rule: nonzero; opacity: 1; transform-box: fill-box; transform-origin: 50% 50%; fill: rgb(255, 255, 255);\" stroke-linecap=\"round\"/>\n" +
            "      <path d=\"M 35.439 48.721 L 34.162 48.721 C 34.066 48.721 33.988 48.631 33.988 48.52 C 33.988 48.407 34.066 48.317 34.162 48.317 L 35.439 48.317 C 35.536 48.317 35.614 48.407 35.614 48.52 C 35.614 48.631 35.536 48.721 35.439 48.721 Z\" style=\"stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill-rule: nonzero; opacity: 1; transform-box: fill-box; transform-origin: 50% 50%; fill: rgb(255, 255, 255);\" stroke-linecap=\"round\"/>\n" +
            "      <path d=\"M 35.439 51.544 L 34.499 51.544 C 34.402 51.544 34.324 51.454 34.324 51.343 C 34.324 51.231 34.402 51.14 34.499 51.14 L 35.439 51.14 C 35.536 51.14 35.614 51.231 35.614 51.343 C 35.614 51.454 35.536 51.544 35.439 51.544 Z\" style=\"stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill-rule: nonzero; opacity: 1; transform-box: fill-box; transform-origin: 50% 50%; fill: rgb(255, 255, 255);\" stroke-linecap=\"round\"/>\n" +
            "    </g>\n" +
            "  </g>" +
            "</svg>" +
            "</button></div></div>"
        // let Interval = setInterval( ()=>{
        //     let elemen = document.getElementById("headerButtonsRegionId")
        //     if (elemen){
        //         document.getElementById("headerButtonsRegionId").innerHTML = btn + document.getElementById("headerButtonsRegionId").innerHTML
        //         document.getElementById("yotei").onclick =  yoteiOnclick()
        //         clearInterval(Interval)
        //     }
        // }, 100)
        document.getElementById("headerButtonsRegionId").innerHTML = btn + document.getElementById("headerButtonsRegionId").innerHTML
        document.getElementById("yotei").onclick = async function() {
             if (window.location.href.search("/calendar/view/day") < 0) {
                 alert("https://outlook.office*.com/calendar/view/day で再度作成してください。")
                 window.location.href = "https://outlook.office.com/calendar/view/day";
                 return;
             }
             // datas = $('div[data-app-section="calendar-view-0"]').find("div[role='button']")
             //表示している予定のデータを取得してlocalstoreに保存する
             let flgOffce = document.querySelectorAll('i[data-telemetry-id = "BuildingFilled"]').length;
             datas = document.querySelectorAll('div[data-app-section="calendar-view-0"]')[0].querySelectorAll('div[role="button"]');
             var arrayDatas = []
             var thisYear = datas[0].getAttribute("aria-label").slice(datas[0].getAttribute("aria-label").indexOf("年")-5, datas[0].getAttribute("aria-label").indexOf("年")).trim();
             var thisMonth = new Date().getMonth()+1//datas[0].getAttribute("aria-label").slice(datas[0].getAttribute("aria-label").indexOf("月")-3, datas[0].getAttribute("aria-label").indexOf("月")).trim();
             var thisDay = new Date().getDate()//datas[0].getAttribute("aria-label").slice(datas[0].getAttribute("aria-label").indexOf("日")-3, datas[0].getAttribute("aria-label").indexOf("日")).trim();
             for (var i = 0; i < datas.length; i++) {
                 //20250224:予定作成した後に直ぐに予定メール作成するバッグ対応
                 if(datas[i].getAttribute("id")) continue;
                 checkPrivate = datas[i].querySelectorAll('i[data-icon-name="LockClosedRegular"]').length ? 1 : 0;
                 time = datas[i].getAttribute("title").split("\n")[datas[i].getAttribute("title").split("\n").length - 1];
                 conten = datas[i].getAttribute("title").split("\n")[0];
                 if (i == 0) {
                     arrayDatas[arrayDatas.length] = time.split(" ")[0] + "まで";
                     arrayDatas[arrayDatas.length] = "空き時間";
                 }
                 arrayDatas[arrayDatas.length] = time;
                 if (checkPrivate) {
                     arrayDatas[arrayDatas.length] = "予定あります";
                     continue;
                 }
                 arrayDatas[arrayDatas.length] = conten;
             }
             //時間で並ぶ
             maxTime = "0:00"
             for (var i = 2; i < arrayDatas.length; i = i + 2) {
                 if (setTimeToday(arrayDatas[i].split(" ")[2]) > setTimeToday(maxTime)) {
                     maxTime = arrayDatas[i].split(" ")[2]
                 }
                 for (var y = 2; y < i; y = y + 2) {
                     if (setTimeToday(arrayDatas[y].split(" ")[0]) > setTimeToday(arrayDatas[i].split(" ")[0])) {
                         var tam1 = arrayDatas[y]
                         var tam2 = arrayDatas[y + 1]
                         arrayDatas[y] = arrayDatas[i]
                         arrayDatas[y + 1] = arrayDatas[i + 1]
                         arrayDatas[i] = tam1
                         arrayDatas[i + 1] = tam2
                     }
                 }
             }
             arrayDatas[arrayDatas.length] = maxTime + " から";
             arrayDatas[arrayDatas.length] = "空き時間";

             // メールアドレス作成する
             var adrdata = (await getStorageData(["mail_setting"])).mail_setting;
             var to = getAddr(adrdata, 1, checkActionNow(arrayDatas))
             var cc = getAddr(adrdata, 2, checkActionNow(arrayDatas))
             var today = new Date();
             var month = today.getMonth() + 1;
             // var day = today.getDate();
            //最後予定のお時間で4時間前であれば予定表、4時間後であれば実績表になる
             var headName = subtractHours(today, 4) >= setTimeToday(arrayDatas[arrayDatas.length - 4].split(" ")[0]) ? "実績" : "予定";　//時間によって予定表と実績を決める
             var where = flgOffce ? "八丁堀" : "リモートワーク";
             var subject = thisMonth + "/" + thisDay + "の" + headName + "表、" + where;
             // var arrayDatas = localStorage.getItem("arrayDatas");
             if (checkActionNow(arrayDatas)) {
                 try {
                     var oldData = (await getStorageData(["calendars"])).calendars[thisDay];
                     var bodyHTML = getMailContent(oldData, thisDay, thisMonth, "予定") + getMailContent(arrayDatas, thisDay, thisMonth) + "<p class=\"x_MsoNormal\"><span style=\"font-size:11.0pt\">反省・気づき<span lang=\"EN-US\"></span></span></p>";
                 } catch (e) {
                     var bodyHTML = noPlans + getMailContent(arrayDatas, thisDay, thisMonth)+ "<p class=\"x_MsoNormal\"><span style=\"font-size:11.0pt\">反省・気づき<span lang=\"EN-US\"></span></span></p>";;
                 }
             } else {
                 var bodyHTML = getMailContent(arrayDatas, thisDay, thisMonth);
             }
             var webUrl = window.location.href
             var outlookWebURL = "https://outlook.office.com/mail/deeplink/compose?to=" + encodeURIComponent(to) + "?cc=" + encodeURIComponent(cc) +
                 "&subject=" + encodeURIComponent(subject);

             // メール作成Tabを開く
            var newWindow = window.open(outlookWebURL, '_blank', 'height=800,width=1000');

            if (newWindow) {
                let checkInterval = setInterval(() => {
                    try {
                        let elements = newWindow.document.querySelectorAll('[id*="editorParent_"] div div');
                        if (elements.length > 0) {
                            elements[0].innerHTML = bodyHTML;
                            clearInterval(checkInterval); // Stop once the element is found and updated
                        }
                    } catch (error) {
                        console.error("Cannot access new window's content due to cross-origin restrictions.");
                        clearInterval(checkInterval);
                    }
                }, 1000); // Check every second
                await Confim_send_data_to_Kot(arrayDatas);
                // Store data in localStorage
                sendDataToLocalStorage(arrayDatas, thisDay);
            } else {
                console.error("Popup blocked! Allow pop-ups for this site.");
            }
         };

        //inset bodyHtml
        function insetBody(bodyHTML, newWindow){
            check = newWindow.document.querySelectorAll('[id*="editorParent_"] div div').length
            if(check){
                newWindow.document.querySelectorAll('[id*="editorParent_"] div div')[0] = bodyHTML
                return;
            }
            newWindow.setTimeout(()=>insetBody(bodyHTML, newWindow), 3000);
        }
        //メール内容作成する
        function getMailContent(arrayDatas,　day, month, headName = null){
            if (arrayDatas.length == 0) {
                return "";
            }
            var today = new Date();
            today.setDate(day);
            today.setMonth(month-1)
            var daysOfWeek = ["日", "月", "火", "水", "木", "金", "土"];
            var month = today.getMonth() + 1; //月取る
            var day = today.getDate();//日取る
            var dayweek = today.getDay()//週の日取る
            //get data calendar by localStorage
            if (!headName){
                var headName = checkActionNow(arrayDatas) ? "実績" : "予定";　//時間によって予定表か実績かを決める
            }
            // var head = "<div align=\"center\"><table style=\"width: 375pt; border-collapse: collapse; border-spacing: 0px; box-sizing: border-box;\"><tbody><tr><td style=\"padding: 1.5pt; width: 15pt;\"><p align=\"center\" style=\"margin: 0mm; font-family: 游ゴシック; font-size: 10.5pt;\"><span style=\"color: rgb(0, 0, 0);\">&nbsp;</span></p></td><td style=\"padding: 1.5pt; width: 360pt;\"><p align=\"left\" style=\"margin: 0mm; font-family: 游ゴシック; font-size: 10.5pt;\"><span style=\"color: rgb(49, 82, 123);\">" +
            //     month +"月" + day + "日(" + daysOfWeek[dayweek] + ")" +
            //     headName +
            //     "&nbsp;</span><span style=\"color: rgb(0, 0, 0);\">&nbsp;</span></p></td></tr></tbody></table></div>";
            // var head = "【"+month+"月"+day+"日 (月) の"+headName+"】";
            var head = "<div align=\"center\"><table style=\"width: 375pt; border-collapse: collapse; border-spacing: 0px; box-sizing: border-box;\"><tbody><tr><td style=\"padding: 1.5pt; width: 15pt;\"><p align=\"center\" style=\"margin: 0mm; font-family: 游ゴシック; font-size: 10.5pt;\"><span style=\"color: rgb(0, 0, 0);\">&nbsp;</span></p></td><td style=\"padding: 1.5pt; width: 360pt;\"><p align=\"left\" style=\"margin: 0mm; font-family: 游ゴシック; font-size: 10.5pt;\"><span style=\"color: rgb(49, 82, 123);\">" +
                month +"月" + day + "日(" + daysOfWeek[dayweek] + ")" +
                headName +
                "&nbsp;</span><span style=\"color: rgb(0, 0, 0);\">&nbsp;</span></p></td></tr></tbody></table></div>";

            var yotei = "<div align=\"center\">" + "<table style=\"width: 375pt; box-sizing: border-box; border-collapse: collapse; border-spacing: 0px;\">";
            for (var i = 0; i < arrayDatas.length; i = i+2) {
                if(i<2 || i >= arrayDatas.length - 2){
                    bgr = "background-color: rgb(247, 247, 247)";
                }
                else {
                    bgr = "";
                }
                yotei = yotei + "<tr><td style=\"padding: 1.5pt; width: 15pt;\"></td>" +
                    "<td style=\"" +
                    bgr +
                    "; padding: 1.5pt; vertical-align: top; width: 9pt;\"><p style=\"text-align: justify; margin: 0mm; font-family: 游ゴシック; font-size: 10.5pt;\"><span style=\"font-family: &quot;ＭＳ Ｐゴシック&quot;; font-size: 12pt; color: rgb(0, 0, 0);\">&nbsp;</span></p></td>" +
                    "<td style=\"" +
                    bgr +
                    "; padding: 1.5pt; vertical-align: top; width: 112.5pt;\"><p align=\"right\" style=\"margin: 0mm; font-family: 游ゴシック; font-size: 10.5pt;\"><span style=\"font-size: 10pt; color: black;\">" +
                    arrayDatas[i] +
                    "</span><span style=\"color: rgb(0, 0, 0);\">&nbsp;</span></p></td>" +
                    "<td style=\"" +
                    bgr +
                    "; padding: 1.5pt; width: 7.5pt;\"></td><td style=\"" +
                    bgr +
                    "; padding: 1.5pt; vertical-align: top; width: 231pt;\"><p style=\"text-align: justify; margin: 0mm; font-family: 游ゴシック; font-size: 10.5pt;\"><span style=\"font-size: 10pt; color: black;\">" +
                    arrayDatas[i+1] +
                    "</span><span style=\"font-family: &quot;ＭＳ Ｐゴシック&quot;; font-size: 12pt; color: rgb(0, 0, 0);\">&nbsp;</span></p></td></tr>" +
                    "</tr>"
            }
            yotei = yotei + "</table></div><br>"

            return head + yotei;
        }
        function setTimeToday(time) {
            var today = new Date()
            today.setHours(time.split(":")[0])
            today.setMinutes(time.split(":")[1])
            return today;
        }

        function subtractHours(date, hours) {
            return new Date(date.getTime() + hours * 60 * 60 * 1000);
        }
        function checkActionNow(arrayDatas){
            const  timeStr = arrayDatas[arrayDatas.length-4].split(" ")[0]
            const targetTime = setTimeToday(timeStr)
            const targetMinus4Hours = subtractHours(targetTime, -4);
            const now = new Date();
            return now >= targetMinus4Hours;
        }
        function getAddr(adrData , flg = 1, action) {
            adr = []
            var today = new Date();
            actionFlg = action ? 3 : 2;
            for (i =0; i < adrData.length; i++){
                e = adrData[i]
                if (e == null){
                    continue;
                }
                var dateStart =  new Date(e[4])
                var dateEnd =  new Date(e[5])
                if(e[0] == flg && dateEnd > today &&  today >dateStart && e[actionFlg]){
                    adr.push(e[1])
                }
            }
            return adr;
        }

    }
