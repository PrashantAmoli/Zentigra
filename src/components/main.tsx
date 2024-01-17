
export function Main({ name = "Extension" }) {

  const changeState = (newState) =>{
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTabId = tabs[0].id;
      chrome.tabs.sendMessage(activeTabId, { action: newState });
    });
  }


  return (
    <div>
      <div id="id1">-</div>
      <button onClick={()=>changeState('start')}>Start</button>
      {/* <button onClick={()=>changeState('pause')}>Pause</button> */}
      <button onClick={()=>changeState('stop')}>Stop</button>
    </div>
  )
}
