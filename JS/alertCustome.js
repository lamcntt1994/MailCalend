const overlay = document.createElement("div");
overlay.id = "myAlertOverlay";
overlay.style.position = "fixed";
overlay.style.top = "0";
overlay.style.left = "0";
overlay.style.width = "100%";
overlay.style.height = "100%";
overlay.style.background = "rgba(0, 0, 0, 0.5)";
overlay.style.zIndex = "99999";
overlay.style.display = "flex";
overlay.style.justifyContent = "center";
overlay.style.alignItems = "center";

const modal = document.createElement("div");
modal.style.background = "white";
modal.style.padding = "20px";
modal.style.borderRadius = "8px";
modal.style.textAlign = "center";


// overlay.appendChild(modal);
// document.body.appendChild(overlay);

// Chặn scroll
// document.body.style.overflow = "hidden";

// Bắt sự kiện OK



function creat_modal_html(data){
    rp_data = get_data_for_Kot(data)
    innerHTML = `
    <p>KOTにデータを送信しますか？</p>
    <input type="checkbox" id="cb1" style="text-align: left"> <label for="cb1">出勤: ${rp_data.first}</label>
    <input type="checkbox" id="cb2" style="text-align: right"> <label for="cb2">休始: ${rp_data.breakIn}</label><br>
    <input type="checkbox" id="cb3" style="text-align: left"> <label for="cb3">休終: ${rp_data.breakOut}</label>
    <input type="checkbox" id="cb4" style="text-align: right"> <label for="cb4">退勤: ${rp_data.last}</label><br>
    
    <button class="ms-Button-label" id="okButton" style="padding:5px; margin:5px;border-radius:5px">OK</button>
    <button class="ms-Button-label" id="cancel" style="padding:5px; margin:5px;border-radius:5px">Cancel</button>
`;
    return innerHTML;

}
async function Confim_send_data_to_Kot(data){
    swKOT = await getSwichKOT();
    if (!swKOT) return;
    modal.innerHTML = creat_modal_html(data)
    overlay.appendChild(modal);

    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";
    document.getElementById("okButton").addEventListener("click", () => {
        send_data_to_service(data)
        document.body.removeChild(overlay);
        document.body.style.overflow = "";
    });
    document.getElementById("cancel").addEventListener("click", () => {
        document.body.removeChild(overlay);
        document.body.style.overflow = "";
    });
}

function send_data_to_service(data){
    rp_data = get_data_for_Kot(data)
    send_data = {};
    if (document.getElementById("cb1").checked){
        send_data.first = rp_data["first"]
    }
    if (document.getElementById("cb2").checked){
        send_data.breakIn = rp_data["breakIn"]
    }
    if (document.getElementById("cb3").checked){
        send_data.breakOut = rp_data["breakOut"]
    }
    if (document.getElementById("cb4").checked){
        send_data.last = rp_data["last"]
    }
    if(Object.keys(send_data).length === 0) return
    chrome.runtime.sendMessage({ type: "openAndReadLocalStorageKingOfTime", data:send_data}, (response)=>{

        if (response[0].result){
            alert("送信成功しました、念のためご確認宜しくお願い致します。")
        }
        else {
            alert("エラー：問題が発生されました、送信失敗です。")
        }
    });
}

async function getSwichKOT(){
    const result  = await getStorageData(["KOTSwich"]);
    return result.KOTSwich;
}