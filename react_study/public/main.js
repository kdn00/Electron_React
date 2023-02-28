const {app, BrowserWindow} = require('electron')
const remote = require('@electron/remote/main')
remote.initialize()

function createWindow() {
  const win = new BrowserWindow({
    // 윈도우의 기본 너비, 높이를 지정하는 옵션
    width:1457,
    height:940,
    
    // 윈도우의 크기를 조절 허용 여부를 지정하는 옵션, 기본값은 true
    // resizable: true

    // 앱 실행 시 윈도우를 화면 정 중앙에 위치시키는 옵션
    center: true,
    autoHideMenuBar: true,
    // Electron 웹 환경설정을 하는 옵션
    webPreferences: {
        // Electron 내부에 Node.js를 통합할 것인지 설정하는 옵션
        nodeIntegration: true,
        enableRemoteModule: true
    },
  });
  
  // 로드할 서버 링크
  win.loadURL('http://localhost:3000')
  remote.enable(win.webContents)
}

// Electron의 초기화가 끝나면 실행되며 브라우저 윈도우를 생성할 수 있다.
// 몇몇 API는 이 이벤트 이후에만 사용할 수 있다.
app.on('ready', createWindow)
 

// window들이 모두 닫혔을 때 발생하는 이벤트
// Mac의 경우 종료를 해도 최소화 상태가 된 것처럼 만들 수 있다.
app.on('window-all-closed', function() {
  // 모든 창이 꺼지면 어플리케이션 종료
    if(process.platform !== 'darwin') {
        app.quit()
    }
})


app.on('activate', function() {
    // 열린 윈도우가 없으면, 새로운 윈도우를 다시 만듭니다.
    if(BrowserWindow.getAllWindows().length === 0) createWindow()
})