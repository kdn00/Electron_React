# Electron_React
### React-Electron 실행하기 위한 환경설정
---
**우선 아래 프로그램들을 설치해야 한다.**
node.js
npm (혹은 yarn)
- yarn이 npm보다 속도나 보안이 좋다고 했었으나, npm이 5.0 버전으로 업데이트 하면서 거의 차이가 없어졌다.
FrontEnd 개발 툴(별도로 사용하던 툴이 없다면 VSCode 권장)
그 외 개발환경에 필요한 권한 설정 등
   
#### 1. react 프로젝트를 생성
```
npx create-react-app 프로젝트명
```

#### 2. react 프로젝트로 이동
```
cd 프로젝트명
```

#### 3. electron 모듈 설치
```
npm i electron electron-builder concurrently wait-on cross-env
```
electron, concurrently, wait-on, cross-env 4가지 모듈을 설치합니다. (필요시 다른 모듈 추가로 설치)
**electron**
- electron의 핵심 모듈

**electron-builder**
- electron 앱을 실행 파일로 빌드해준다.

**concurrently**
- react와 electron을 동시에 실행할 수 있도록 해주는 모듈, 설치하지 않으면 react와 electron을 따로 실행해야 한다.

**wait-on**
- electron과 react의 동작 순서를 제어하기 위한 모듈

**cross-env**
- CLI 환경에서 환경변수 설정(특정 OS에 상관없이 환경변수를 적용함)

#### 4. package.json의 "scripts"에 다음 코드 추가
```
"scripts": {
  "electron:serve": "concurrently -k \"cross-env BROWSER=none npm start\" \"npm electron:start\"",
  "electron:build": "",
  "electron:start": "wait-on tcp:3000 && electron .",
  //...
},
```

#### 5. package.json의 최상위에 다음 코드를 추가한다.
```
{
  "main": "public/main.js",
  "homepage": "./",
  //...
}
```

#### 6. IPC 통신을 위한 모듈 설치
- IPC 통신 : 프로세스 간 통신(Inter Process Communication)으로 프로세스들 사이에 서로 데이터를 주고 받는 행위 또는 그에 대한 방법이나 경로를 뜻한다.
```
npm add @electron/remote
```

#### 7. public폴더에 main.js 파일을 생성한 후 아래 코드를 적용합니다.
```javascript
const {app,BrowserWindow} = require('electron');
 
const remote = require('@electron/remote/main')
remote.initialize()
 
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            enableRemoteModule: true
        }
    })
 
    win.loadURL('http://localhost:3000')
 
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
```

#### 8. React & Electron 실행
```
npm electron:serve
```


배포 참고 : https://jeongsu.tistory.com/208
전체적인 흐름 참고 : https://pks2974.medium.com/electron-%EC%97%90-react-%EC%A0%81%EC%9A%A9%ED%95%B4-%EB%B3%B4%EA%B8%B0-ebcea2bbbd27

#### 번외. Electron BrowserWindow 옵션
**width, height**
- 윈도우의 기본 너비, 높이를 지정하는 옵션

**minWidth, minHeight**
- 윈도우의 최소 너비, 높이를 지정하는 옵션 (기본값은 너비와 높이 모두 0)

**maxWidth, maxHeight**
- 윈도우의 최대 너비, 높이를 지정하는 옵션 (기본값은 너비와 높이 모두 제한이 없다.)

**resizable**
- 윈도우의 크기를 조절 허용 여부를 지정하는 옵션 (기본값은 true)

**center**
- 앱 실행 시 윈도우를 화면 정중앙에 위치시키는 옵션

**alwaysOnTop**
- 윈도우를 다른 창들 위에 항상 유지되는 옵션 (기본값은 false)

**fullscreen**
- 윈도우를 전체 화면으로 활성화시키는 옵션 (기본값은 false)

**autoHideMenuBar**
- 윈도우의 메뉴바를 숨기는 옵션
- MAC OS의 경우 메뉴바가 작업표시줄에 나타나므로 상관이 없지만, Windows OS의 경우 메뉴바가 윈도우 상단바 바로 아래에 나타난다.
- 미관상 별로이기도 하고, 메뉴바가 차지하는 공간 때문에 운영체제마다 CSS 높이 조절이 달라지게 되므로 여러모로 숨기는 편이 좋다.
- 기본값은 false이며, true인 상태에서 Alt 키를 누르면 다시 나타난다.

**backgroundColor**
윈도우 배경색을 설정하는 옵션 (기본값은 #FFFFFF, 흰색)

**webPreferences**
- Electron 웹 환경설정을 하는 옵션으로 하위에 여러 가지 옵션이 있다.
- 그 중 nodeIntegration 옵션이 있는데 Electron 내부에 Node.js를 통합할 것인지 설정하는 옵션이므로, 만약 Electron 내부에서 Node 기반 라이브러리를 사용한다면, 꼭 true로 설정해야한다.
- 기본값은 false