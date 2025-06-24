function sendMailCalendar() {
    let newtab = window.open("https://outlook.office.com/calendar/view/day", '_blank');

    if (newtab) {
        newtab.onload = function () {
            let checkInterval = setInterval(() => {
                try {
                    let elements = newtab.document.querySelectorAll('div[data-app-section="calendar-view-0"]');
                    if (elements.length > 0) {
                        newtab.close();
                        clearInterval(checkInterval);
                    }
                } catch (error) {
                    console.log("Không thể truy cập nội dung trang (CORS policy).", error);
                    clearInterval(checkInterval);
                }
            }, 100);
        };
    } else {
        console.log("Trình duyệt đã chặn pop-up.");
    }
}

function getCalenData(){
    fetch("https://outlook.office.com/calendar/view/day")
        .then(response => response.text())
        .then(html => {
            console.log(html); // In ra nội dung HTML của trang
        })
        .catch(error => console.error("Lỗi:", error));
}
function thisMonthCalendar() {
    // navigator.clipboard.writeText("lamcntt1994");
    window.open(chrome.runtime.getURL('HTML/thisMonthCalen.html#setting'), '_blank');
    CoppyThisMonthCalen()
}
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
async function CoppyThisMonthCalen(){
    const result  = await getStorageData(["calendars"]);
    data = result.calendars
    for (let i = 0; i < data.length; i++) {
        console.log(data[i])
    }
}

function KOT_swich(){
    swich = document.getElementById("KOT_check").checked;
    chrome.storage.local.set({KOTSwich: swich})
}
window.onload =
    async function (){
        const KOTSwich  = (await getStorageData(["KOTSwich"])).KOTSwich;
        console.log(KOTSwich);
        document.getElementById("KOT_check").checked = KOTSwich;
    }

document.getElementById("sendMailCalendar").addEventListener('click', sendMailCalendar);
document.getElementById("toThisMonthData").addEventListener('click', thisMonthCalendar);
document.getElementById("KOT_check").addEventListener("click", KOT_swich);


///////////////////////////////////////////////////////////////////////////////////////////////
