### rn에 webview 추가하기
---
- firebase cloud message를 추가합니다.
- fcm은 프로젝트의 가장 최상단(App.js)에 위치해야합니다.
- 그러므로 webview는 App.js의 하위 컴포넌트에서 구성합니다.
```javascript
//App.js
const App = () => {
  // 웹뷰와 rn과의 소통은 아래의 ref 값을 이용하여 이루어집니다.
  let webviewRef = useRef();

  /** 웹뷰 ref */
  const handleSetRef = _ref => {
    webviewRef = _ref;
  };

  /** webview 로딩 완료시 */
  const handleEndLoading = e => {
    console.log("handleEndLoading");
    /** rn에서 웹뷰로 정보를 보내는 메소드 */
    webviewRef.postMessage("로딩 완료시 webview로 정보를 보내는 곳");
  };

  return (
    <WebviewContainer
      webviewRef={webviewRef}
      handleSetRef={handleSetRef}
      handleEndLoading={handleEndLoading}
    />
  );
};
```
<br>

```javascript
// WebView.js
import { WebView } from "react-native-webview";

const WebviewContainer = ({ handleSetRef, handleEndLoading }) => {
  const url = "localhost:3000";

  /** 웹뷰에서 rn으로 값을 보낼때 거치는 함수 */
  const handleOnMessage = ({ nativeEvent: { data } }) => {
    // data에 웹뷰에서 보낸 값이 들어옵니다.
    console.log(data);
  };

  return (
    <WebView
      onLoadEnd={handleEndLoading}
      onMessage={handleOnMessage}
      ref={handleSetRef}
      source={{ uri }}
    />
  );
};
```

### 웹뷰에서 rn으로 데이터 송신
---
- 웹뷰 → react-native으로 데이터를 보내는 예시입니다.
- 노트북, 컴퓨터로 접속하는 웹에는 없지만 모바일로 웹에 접속하면 해당 웹에는 ReactNativeWebView 객체가 생성됩니다.
- 이 객체를 이용하면 rn에게 데이터를 전달할 수 있습니다.
```javascript
const requestPermission = () => {
  if (window.ReactNativeWebView) {
    // 모바일이라면 모바일의 카메라 권한을 물어보는 액션을 전달합니다.
    window.ReactNativeWebView.postMessage(
      JSON.stringify({ type: "REQ_CAMERA_PERMISSION" })
    );
  } else {
    // 모바일이 아니라면 모바일 아님을 alert로 띄웁니다.
    alert({ message: ERROR_TYPES.notMobile });
  }
};
```
<br>

- 위처럼 webview에 함수를 만들고 requestPermission함수를 실행하면, 우리가 rn에서 정의한 onMessage 메소드에 넣어준 함수가 실행됩니다.
```javascript
/** 웹뷰에서 rn으로 값을 보낼때 거치는 함수 */
const handleOnMessage = ({ nativeEvent: { data } }) => {
  console.log(data); // { type: "REQ_CAMERA_PERMISSION" }
};

```

### rn에서 webview로 데이터 송신
---
- react-native → webview로 데이터를 보내는 예시입니다.
- rn에서는 ```webviewRef.postMessage({type: TOKEN, data: xxxxx});```를 이용하여 webview로 데이터를 전송합니다.
- 위 함수를 이용해 전송하면 웹뷰에서는 웹뷰 프로젝트의 최상단에 rn 정보를 listen한다는 함수를 실행합니다. react-router를 사용한 예시는 아래와 같습니다.

```javascript
// routes.js
export default function Routes() {
  return (
    <Router>
      <RNListener>
      <Switch>
        ...
      </Switch>
    </Router>
  )
}
```

- 위처럼 어느 라우트에서든 RNListener가 실행되도록 만들어줍니다.
- 다음으로는 RNListener입니다. rn에서 ```webviewRef.postMessage({type: TOKEN, data: xxxxx});```으로 전송을 보냈다고 가정하면
```javascript
const RNListener = () => {
  /** react native 환경에서만 가능 */
  const listener = event => {
    const { data, type } = JSON.parse(event.data);
    if (type === "TOKEN") {
      // type이 TOKEN이기 때문에 이곳에 콘솔이 찍히게 됩니다.
      console.log(data) // xxxxx
      ...
    } else if (type === "NOTIFICATION") {
      ...
    }
  };

  if (window.ReactNativeWebView) {
    /** android */
    document.addEventListener("message", listener);
    /** ios */
    window.addEventListener("message", listener);
  } else {
    // 모바일이 아니라면 모바일 아님을 alert로 띄웁니다.
    alert({ message: ERROR_TYPES.notMobile });
  }
};
```

**주의사항 : rn을 듣는 listener함수가 android와 ios가 다름을 인지하고 확실히 분기처리 해야합니다.**

### rn 모듈 설치 시
---
- 모듈을 설치했다면 프로젝트와 연결해야한다.
```shell
# 예시
# 1. 설치
npm install react-native-send-intent --save
yarn add react-native-send-intent

# 2. 프로젝트와 연결
react-native link react-native-send-intent
```