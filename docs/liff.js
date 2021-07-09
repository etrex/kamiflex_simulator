async function liff_init(){
  console.log("liff_init")
  await liff.init({
    liffId: "1656198526-p1wZyEGE"
  });
  if (!liff.isLoggedIn()) {
    liff.login();
  }
}

async function share_target_picker(){
  /* JS 不支援的情況 */
  if (!liff.isApiAvailable('shareTargetPicker')){
    return;
  }

  let messages = [flexMessage];

  /* 分享訊息給好友 */
  const response = await liff.shareTargetPicker(messages);

  /* 分享訊息失敗 */
  if(!response){
    const [majorVer, minorVer] = (liff.getLineVersion() || "").split('.');
    if (parseInt(majorVer) == 10 && parseInt(minorVer) < 11) {
      alert("你的 LINE 版本太舊，無法使用分享訊息功能。");
    } else {
      alert("你已取消分享訊息。");
    }
  }
}

window.onload = async function() {
  console.log("init")
  if(typeof(liff) !== 'undefined'){
    await liff_init();
    document.querySelector("#share").addEventListener("click", share_target_picker);
  }
};


