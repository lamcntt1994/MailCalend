const workList = ["00：勤務", "91：休憩", "05：公休", "06：有休", "08：慶弔休暇", "11：欠勤", "12：夜勤明け", "13：入退", "14：特別休暇(有給)", "07：特別休暇(無給)", "17：半日勤務", "18：半日有休", "20：半日特休(無給)"]
var ExportDetailtable = function (tabName, data) {
    table = $('#' + tabName).DataTable({
        'dom': 'Bfrtip',
        'orderable': false,
        'searching': false,
        'stateSave': true,
        'paging': false,
        'bInfo': false,
        "bLengthChange": false,
        'autoWidth': false,
        'scrollY': 300,
        'scrollCollapse': true,
        'scrollX': false,
        'processing': true,
        "data":data,
        "columns": [
            {"data": "day"},
            {"data": "starth"},
            {"data": "startm"},
            {"data": "stoph"},
            {"data": "stopm"},
            {"data": "workFlag"},
            {"data": "workTime"},
            {"data": "TrainH"},
            {"data": "commen"}
        ],
        buttons: [
            {
                extend: 'copyHtml5',
                text: 'コピー',
                header:false,
                title : '',
                exportOptions: {columns: [0, 1, 2, 3, 4, 5, 6, 7, 8]},
                className: 'btn-third valid btn_copy',
                copyTitle: 'Copy to clipboard',
            }
        ],
        layout: {
            topStart: {
                buttons: [
                    { extend: 'create', editor: "" },
                    { extend: 'edit', editor: "" },
                    { extend: 'remove', editor: "" }
                ]
            }
        },
        language: {
            buttons: {
                copyTitle: 'コピー成功',
                // copyKeys: 'Appuyez sur <i>ctrl</i> ou <i>\u2318</i> + <i>C</i> pour copier les données du tableau à votre presse-papiers. <br><br>Pour annuler, cliquez sur ce message ou appuyez sur Echap.',
                copySuccess: {
                    _: '%d 行 コピーしました',
                }
            }
        },
        'order': [[0, 'asc']],

    })
    table.buttons().containers().appendTo( '.'+tabName +' #btn_copy');
    $( '.'+tabName +' #btn_copy button').removeClass("dt-button buttons-copy buttons-html5")
};

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
function setTimeToday(time) {
    var today = new Date()
    today.setHours(time.split(":")[0])
    today.setMinutes(time.split(":")[1])
    return today;
}
async function CoppyThisMonthCalen(){
    const result  = await getStorageData(["calendars"]);
    data = result.calendars
    repon = []
    var date = new Date()
    var lastdate = new Date(date.getFullYear(), date.getMonth()+1, 0)
    console.log(data)
    for (let i = 1; i <= date.getDate(); i++) {
        if(data[i]){
            repon.push(workDataEdit(data[i], i))
            repon.push(BreaktimeData(data[i], i))
        }
        else
        {
            repon.push({"day":i, "starth":"00", "startm":"00", "stoph":"00", "stopm":"00", "workFlag":workList[2], "workTime":"", "TrainH":"", "commen":""})
        }
    }
    ExportDetailtable("thisMonhtData", repon)
}
function workDataEdit(data, day){
    // data = data.split(",")
    console.log(data[0].replace("まで", ""))
    starTime = setTimeToday(data[0].replace("まで", ""))
    endTime = setTimeToday(data[data.length-2].replace("から", ""))
    data = {"day":day, "starth":starTime.getHours(), "startm":starTime.getMinutes(), "stoph":endTime.getHours(), "stopm":endTime.getMinutes(), "workFlag":workList[0], "workTime":"", "TrainH":"", "commen":""}
    return data;
}
function BreaktimeData(data, day){
    // data = data.split(",")
    const isLargeNumber = (element) => element.match(/^.*憩.*$/) || element.match(/^.*昼.*$/);
    Break = data[data.findIndex(isLargeNumber)-1]
    starTime = setTimeToday(Break.split("から")[0])
    endTime = setTimeToday(Break.split("から")[1])
    rp = {"day":day, "starth":starTime.getHours(), "startm":starTime.getMinutes(), "stoph":endTime.getHours(), "stopm":endTime.getMinutes(), "workFlag":workList[1], "workTime":"", "TrainH":"", "commen":""}
    return rp
}
CoppyThisMonthCalen();

$('.opennav').click(function () {
    // $(this).toggleClass('active'), $('.form-infor').toggleClass('extra');
    $(this).toggleClass('active');
    //$('.form-infor').toggleClass('pushmenu-compact');
    $('.tab-push-left li').toggleClass('active');
    $('.sidenav').toggleClass('active');
});

//add mail addr
let addMailAddr = function addMailAddr(Cli = "", mailAddr="", timeMoning =0, timeEvening =0, dateStart ="", dateEnd="" ) {
    let settingTable = document.getElementById("settingTable");
    let addrInfo = document.getElementsByName("addrInfo")["0"];
    let createNew = addrInfo.cloneNode(true);
    createNew.style.display = ""
    ClassificationSelect = createNew.querySelector('select[name="Classification"]');
    ClassificationSelect.selectedIndex = Cli;
    mailAddrInput = createNew.querySelector('input[name="mailAddr"]');
    mailAddrInput.value = mailAddr;
    timeMorningCheck = createNew.querySelector('input[name="timeMorning"]');
    timeMorningCheck.checked = timeMoning;
    timeEveningCheck = createNew.querySelector('input[name="timeEvening"]');
    timeEveningCheck.checked = timeEvening;
    dateStartInput = createNew.querySelector('input[name="dateStart"]');
    dateStartInput.value = dateStart;
    dateEndInput = createNew.querySelector('input[name="dateEnd"]');
    dateEndInput.value = dateEnd;
    createNew.querySelector('button[name="delete"]').onclick = function (){
        deleteClick(this)
    }
    settingTable.appendChild(createNew);

}
async function loadSettingForm(){
    const result  = await getStorageData(["mail_setting"]);
    data = result.mail_setting
    data.forEach(function (value){
        if(value){
            addMailAddr(value[0], value[1], value[2], value[3], value[4], value[5])
        }
    })
}
function deleteClick(event){
    event.closest(".addrInfo").remove();
}
let addMailSave = function (){
    data = document.getElementsByName("addrInfo")
    settingSave = []
   data.forEach(function (value){
       array = [];
       array.push(value.querySelector('select[name="Classification"]').selectedIndex);
       array.push(value.querySelector('input[name="mailAddr"]').value);
       array.push(value.querySelector('input[name="timeMorning"]').checked);
       array.push(value.querySelector('input[name="timeEvening"]').checked);
       array.push(value.querySelector('input[name="dateStart"]').value);
       array.push(value.querySelector('input[name="dateEnd"]').value);
       settingSave.push(array)
   })
    delete settingSave[0]
    chrome.storage.local.set({mail_setting: settingSave})
    location.reload();
}


$("#btnAdd").on("click", function (){
    addMailAddr();
});
$("#btnSave").on("click", function (){
    addMailSave();
});
loadSettingForm();

document.querySelectorAll('#mySidenav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute("href")
        window.location.href = "thisMonthCalen.html" + targetId;
        window.location.reload()
    });
});

function loadPage(){
    console.log(window.location.hash);
    const mytab = document.getElementsByName("myTab");
    const targetId = window.location.hash
    if (targetId){
        mytab.forEach(elm=>{
            elm.classList.remove("active");
        })
        const targetElement = document.querySelector(targetId);
        console.log(targetElement)
        if (targetElement) {
            targetElement.classList.add('active')
        }
    }
}
loadPage();