# Electron_React
### React-Electron 실행하기 위한 환경설정
---
**우선 아래 프로그램들을 설치해야 한다.**
1. node.js
2. npm (혹은 yarn)
- yarn이 npm보다 속도나 보안이 좋다고 했었으나, npm이 5.0 버전으로 업데이트 하면서 거의 차이가 없어졌다.
- 취향껏 yarn이나 npm 쓰면 됨
3. FrontEnd 개발 툴(별도로 사용하던 툴이 없다면 VSCode 권장)
4. 그 외 개발환경에 필요한 권한 설정 등

#### 설치 명령어
---
패키지 전역 설치
```shell
npm i -g <package-name>
yarn add global <package-name>
```

dependancy에 패키지 설치
```shell
npm i <package-name>
yarn add <package-name>
```

devDependancy에 패키지 설치
```shell
npm i <package-name> --save-dev
yarn add <package-name> --dev
```
- 패키지를 설치할 때 yarn install --production을 입력하거나 환경변수가 NODE_ENV=production 이면 dependancy에 있는 패키지만 설치해서 빌드 결과물 크기를 최적화할 수 있다.
- 그래서 프로젝트에 꼭 필요한 패키지만 dependancy로 설치하고, typescript나 eslint 등 빌드 파일 실행에 필요하지 않는 패키지는 devDependancy로 설치한다.
#### 1. react 프로젝트를 생성
```
npx create-react-app 프로젝트명
```

#### 2. react 프로젝트로 이동
```bash
cd 프로젝트명
```

#### 3. electron 모듈 설치
```bash
yarn add electron electron-builder concurrently wait-on cross-env --dev
```
- electron, electron-builder, concurrently, wait-on, cross-env 5가지 모듈을 설치합니다. (필요시 다른 모듈 추가로 설치)
- 모듈들에 대한 설명은 아래와 같다.

**- electron :** electron의 핵심 모듈
<br>

**- electron-builder :** electron 앱을 실행 파일로 빌드해준다.(배포)
<br>

**- concurrently :** react와 electron을 동시에 실행할 수 있도록 해주는 모듈, 설치하지 않으면 react와 electron을 따로 실행해야 한다.
<br>

**- wait-on :** electron과 react의 동작 순서를 제어하기 위한 모듈
<br>

**- cross-env :** CLI 환경에서 환경변수 설정(특정 OS에 상관없이 환경변수를 적용함)

#### 4. package.json의 "scripts"에 다음 코드 추가 --> concurrently 적용 동시 실행이 오류남, 해결중 
```javascript
..., 
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject",
  "electron": "electron ."
  ...
},
```

#### 5. package.json의 최상위에 다음 코드를 추가한다.
```javascript
{
  "main": "public/main.js",
  "homepage": "./",
  ...
}
```

#### 6. IPC 통신을 위한 모듈 설치
- IPC 통신 : 프로세스 간 통신(Inter Process Communication)으로 프로세스들 사이에 서로 데이터를 주고 받는 행위 또는 그에 대한 방법이나 경로를 뜻한다.
```bash
yarn add @electron/remote
```

#### 7. public폴더에 main.js 파일을 생성한 후 아래 코드를 적용합니다.
```javascript
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
```

#### 8. React & Electron 실행
```bash
# 둘 다 같이 실행되는 부분이 오류남. 더 찾아보기
# 원래는 yarn start 하나만 입력하면 react, electron 전부 실행되게 만들어야함.
yarn start
yarn electron
```

### 번외. Electron BrowserWindow 옵션
---
- [문법 사용 파일 참고](https://github.com/kdn00/Electron_React#7-public%ED%8F%B4%EB%8D%94%EC%97%90-mainjs-%ED%8C%8C%EC%9D%BC%EC%9D%84-%EC%83%9D%EC%84%B1%ED%95%9C-%ED%9B%84-%EC%95%84%EB%9E%98-%EC%BD%94%EB%93%9C%EB%A5%BC-%EC%A0%81%EC%9A%A9%ED%95%A9%EB%8B%88%EB%8B%A4)
<br>

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
- 윈도우 배경색을 설정하는 옵션 (기본값은 #FFFFFF, 흰색)

**webPreferences**
- Electron 웹 환경설정을 하는 옵션으로 하위에 여러 가지 옵션이 있다.
- 그 중 nodeIntegration 옵션이 있는데 Electron 내부에 Node.js를 통합할 것인지 설정하는 옵션이므로, 만약 Electron 내부에서 Node 기반 라이브러리를 사용한다면, 꼭 true로 설정해야한다.
- 기본값은 false

**그 외의 옵션 확인(공식 문서) : https://www.electronjs.org/docs/latest/api/browser-window**

<!-- 
electron 문서 참고
- https://tinydew4.gitbooks.io/electron-ko/content/tutorial/quick-start.html

electron 공식 문서
- https://www.electronjs.org/docs/latest/api/browser-window

글 작성 참고
- https://developer-talk.tistory.com/335

배포 참고
- https://jeongsu.tistory.com/208
- https://jetalog.net/106

- 다시 빌드 : https://junglow9.tistory.com/2
- 인스톨러 설정 : https://yeolceo.tistory.com/104

- electron, react 배포 시 빈화면 오류 : https://code-nen.tistory.com/125

전체적인 흐름 참고
- https://pks2974.medium.com/electron-%EC%97%90-react-%EC%A0%81%EC%9A%A9%ED%95%B4-%EB%B3%B4%EA%B8%B0-ebcea2bbbd27 이거 꼭 나도 참고!!! -->


### 배포하기
---
#### 1. 배포 라이브러리 설치
```
yarn add --save-dev electron-builder
```

#### 2. package.json에 설정 값 추가
```javascript
{
  "name": "프로젝트이름",
  "version": "1.0.0", // 어플리케이션 버전
  "description": "본인 일렉트론 앱 설명",
  "main": "main.js",
  "scripts": {
    ...
    "build:osx": "electron-builder --mac",
    "build:linux": "npm run build:linux32 && npm run build:linux64",
    "build:linux32": "electron-builder --linux --ia32",
    "build:linux64": "electron-builder --linux --x64",
    "build:win": "npm run build:win32 && npm run build:win64",
    "build:win32": "electron-builder --win portable --ia32",
    "build:win64": "electron-builder --win portable --x64"
  },

  "author": {
    "name": "프로그램 게시자 정보"
  },

  "build": {
    "productName": "어플리케이션 이름",
    "win": {
      "icon": "패키징 파일 이미지 경로"
    },
    "nsis": {
        "oneClick": true, // 원 클릭 설치 프로그램 설정
        "allowToChangeInstallationDirectory": true, // 사용자가 설치 디렉토리를 변경하도록 허용할지에 대한 설정
        "createDesktopShortcut": true, // 바탕화면에 바로가기 추가 설정
        "language": 1042, // 설치 프로그램 언어 : 한국어는 1042
        "shortcutName": "바로가기 이름",
        "artifactName": "배포 파일 이름",
        "uninstallDisplayName": "제어판>>프로그램>>프로그램 및 기능에 표시되는 이름"
    },
    "directories": {
      "output": "빌드를 끝낸 파일을 생성할 경로" // 별도로 지정하지 않으면 dist 디렉토리에 저장된다.
    }
  },
}
```

#### 3. 배포 명령어를 실행
- 아래의 명령어를 입력하여 설치 프로그램을 생성
- 각각 os에 맞는 설치 명령어
```bash
npm run deploy:osx   # macOS
npm run deploy:win   # Windows 32bit & 64bit
npm run deploy:win32 # Windows 32bit
npm run deploy:win64 # Windows 64bit
```