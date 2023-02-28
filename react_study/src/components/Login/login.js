import './login.css';
import React from 'react';

function App() {
  return (
    <div className='App-body'>
      <div className='logo-size'/>
      <div className='program-name'>한케어<br></br>노인 장기 요양 뉴스</div>
      

    <form method='post' action='./process/login'>
      <div className='login-box'>
        <input className='Box agencyNumber-Box' name='agencyNumber' id='agencyNumber' placeholder='기관번호를 입력하세요. (숫자만 입력)'/>  
        <input className='Box id-Box' name='id' placeholder='아이디를 입력하세요.'/>  
        <input className='Box password-Box' type='password' name='pw' placeholder='비밀번호를 입력하세요.'/>  
        
        <div>
            <input className='checkBox agency-check' type='checkbox' name='agencyCheck'></input>
            <div className='checkText agency-checkText'>기관번호 저장</div>
            <input className='checkBox id-check' type='checkbox' name='idCheck'></input>
            <div className='checkText id-checkText'>아이디 저장</div>
            <input className='checkBox login-check' type='checkbox' name='loginCheck'></input>
            <div className='checkText login-checkText'>로그인 유지</div>
        </div>

        <button className='BigBlue-Btn login-btn' type='submit'>
            <span className='Btn-font'>로그인</span>
        </button>

        <div>
            <a className='middle-font join-font' href='./Join/join.js'>회원가입</a>
            <div className='middle-Box'/>
            <a>
            <a className='middle-font find-font' href=''>아이디/비밀번호 찾기</a>
            </a>

        </div>

      </div>
    </form>
    </div>
  );
}
export default App;


