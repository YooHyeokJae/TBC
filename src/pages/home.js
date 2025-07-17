import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useOutletContext} from "react-router-dom";

function Home() {
    const {loginUser, setLoginUser} = useOutletContext();
    const navigate = useNavigate();

    const [userId, setUserId] = useState('');
    const [userPw, setUserPw] = useState('');
    const [show, setShow] = useState(false);

    // ID/PW 찾기 버튼 클릭 함수
    const searchId = () => {
        alert('searchId >> 미구현');
    }

    // 회원가입 버튼 클릭 함수
    const join = () => {
        navigate("/join");
    }

    // 로그인 버튼 클릭 함수
    const login = () => {
        if(userId === '' || userPw === ''){
            alert('정보를 입력해주세요.');
            return false;
        }
        fetch(`/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userId, userPw: userPw })
        })
            .then(res => res.json())
            .then((data)=>{
                if(data.num === 0){
                    alert('일치하는 정보가 없습니다.');
                }else if(data.num === -1){
                    alert('비밀번호가 틀렸습니다.');
                }else{
                    setLoginUser(data);
                    sessionStorage.setItem('loginUser', JSON.stringify(data));
                }
            })
            .catch(err => console.log(err));
    }

    // 로그인 여부에 따라 업무 목록 화면으로 리다이렉팅
    useEffect(() => {
        if(loginUser && loginUser.userId !== '') {
            navigate('/toDo');
        }
    }, [loginUser]);

    return (
        <div className="mt-2">
            <div className="row me-0">
                <div className="offset-2 col-8">
                    <h2>home 페이지 / time</h2>
                    <p>여기는 home 페이지입니다.</p>
                    <div className="loginBox">
                        <div className="d-flex mb-2">
                            <div className="w-100">
                                <div className="d-flex align-items-center mb-2">
                                    <label htmlFor="userId" style={{minWidth: '80px'}}>아이디</label>
                                    <input type="text" id="userId" className="form-control"
                                           onChange={(e)=>{setUserId(e.target.value)}} />
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                    <label htmlFor="userPw" style={{minWidth: '80px'}}>비밀번호</label>
                                    <div className="input-group">
                                        <input type={show ? 'text' : 'password'} id="userPw" className="form-control"
                                               onChange={(e) => {
                                                   setUserPw(e.target.value)
                                               }}/>
                                        <button type="button" className={show ? "btn btn-secondary" : "btn btn-outline-secondary"}
                                                onClick={() => setShow(!show)}>
                                            <i className={show ? "bi bi-eye" : "bi bi-eye-slash"}></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="ms-2 mb-2">
                                <input type="button" className="btn btn-outline-dark h-100" value="로그인" onClick={login} />
                            </div>
                        </div>

                        <div className="d-flex justify-content-center">
                            <input type="button" className="btn btn-outline-dark ms-2" value="회원가입" onClick={join} />
                            <input type="button" className="btn btn-outline-dark ms-2" value="ID 찾기" onClick={searchId} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
