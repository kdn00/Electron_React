### 웹뷰에서 rn으로 데이터 송신
---
- 웹뷰 -> rn으로 데이터를 보내는 예시입니다.
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