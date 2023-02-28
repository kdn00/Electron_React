const {app, BrowserWindow} = require('electron')
const remote = require('@electron/remote/main')
remote.initialize()

function createWindow() {
  const win = new BrowserWindow({
    // 윈도우의 기본 너비, 높이를 지정하는 옵션
    width:1440,
    height:900,
    
    // 윈도우의 크기를 조절 허용 여부를 지정하는 옵션, 기본값은 true
    // resizable: true

    // 앱 실행 시 윈도우를 화면 정 중앙에 위치시키는 옵션
    center: true,
    
    // Electron 웹 환경설정을 하는 옵션
    webPreferences: {
        // Electron 내부에 Node.js를 통합할 것인지 설정하는 옵션
        nodeIntegration: true,
        enableRemoteModule: true
    },
  });
  win.loadURL('http://localhost:3000') //생성한 창에 url 실행, url 없으면 index.html
  remote.enable(win.webContents);
}

app.on('ready', createWindow)
 
app.on('window-all-closed', function() {
    if(process.platform !== 'darwin') {
        app.quit()
    }
})
 
app.on('activate', function() {
    if(BrowserWindow.getAllWindows().length === 0) createWindow()
})