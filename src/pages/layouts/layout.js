import React, {useEffect, useState} from 'react';
import {Link, Outlet, useNavigate} from "react-router-dom";
import ChatTools from "../../components/ChatTools";

function Layout() {
    const navigate = useNavigate();
    const [loginUser, setLoginUser] = useState(null);

    // 세션으로부터 로그인 유저 정보 가져오기
    useEffect(() => {
        const loginUserFromStorage = sessionStorage.getItem('loginUser');
        if(loginUserFromStorage) {
            setLoginUser(JSON.parse(loginUserFromStorage));
        }
    }, []);

    // 로그인 유저 정보 load 후 동작
    useEffect(() => {
        //
    }, [loginUser])

    return (
        <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            {/*header*/}
            <div className="row background_4d6594 m-0">
                <div className="offset-2 col-8">
                    <h2 className="text-center">
                        <Link to="/" style={{color: 'inherit', textDecoration: 'none'}}>ToBeContinue</Link>
                    </h2>
                </div>
                {loginUser && loginUser.id !== '' && (
                    <div className="col-2 d-flex align-items-center">
                        <input type="button" className="btn btn-secondary" value="로그아웃"
                               onClick={() => {
                                   sessionStorage.removeItem('loginUser');
                                   setLoginUser(null);
                                   navigate("/");
                               }} />
                    </div>
                )}
            </div>

            {/*body*/}
            <div style={{flex: 1}}>
                <Outlet context={{loginUser, setLoginUser}} />
                {loginUser && loginUser.id !== '' ? <ChatTools loginUser={loginUser} /> : ''}
            </div>

            {/*footer*/}
            <div className="background_d3d5d7">
                <h2 className="text-center">footer</h2>
            </div>
        </div>
    );
}

export default Layout;
