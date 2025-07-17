import React, {useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";

function Join() {
    const navigate = useNavigate();
    const idRef = useRef(null);
    const pwRef = useRef(null);
    const pwChkRef = useRef(null);
    const emailRef = useRef(null);

    const [dupChk, setDupChk] = useState(false);
    const [show, setShow] = useState(false);

    const info = [
        {label: '아이디', id: 'userId', type: 'text', placeholder: ''},
        {label: '비밀번호', id: 'userPw', type: 'password', placeholder: '영어, 숫자, 특수기호 필수 포함'},
        {label: '비밀번호 확인', id: 'userPwChk', type: 'password', placeholder: ''},
        {label: '이름', id: 'name', type: 'text', placeholder: ''},
        {label: '생일', id: 'birth', type: 'date', placeholder: ''},
        {label: '전화번호', id: 'telNo', type: 'text', placeholder: '-없이 숫자만 입력'},
        {label: '이메일', id: 'email', type: 'text', placeholder: ''}
    ];

    const initialFormData = info.reduce((acc, cur) => {
        acc[cur.id] = '';
        return acc;
    }, {});

    const [formData, setFormData] = useState(initialFormData);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
        if(id === 'userId') setDupChk(false);
    };

    const join = () => {
        let flag = validation();
        if(!flag){
            return false;
        }
        fetch(`/user/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        }).then(res => res.text())
            .then(data => {
                if(data === 'success'){
                    alert('회원가입이 완료되었습니다.\n입력하신 정보로 로그인해주세요.')
                    navigate('/');
                }
            })
            .catch(err => console.log(err));

    }

    const dupIdChk = () => {
        fetch(`/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        }).then(res => res.json())
            .then(data => {
                if(data.num !== 0){
                    alert('중복된 아이디입니다.');
                }else{
                    alert('사용가능한 아이디입니다.');
                    setDupChk(true);
                }
            })
            .catch(err => console.log(err));
    }

    const validation = () => {
        const regexPw = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]+$/;
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!dupChk) {
            alert('아이디 중복검사를 해주세요.');
            idRef.current.focus();
            return false;
        }
        if(!regexPw.test(formData.userPw)) {
            alert('조건에 맞는 비밀번호를 입력해주세요.');
            pwRef.current.focus();
            return false;
        }
        if(formData.userPw !== formData.userPwChk) {
            alert('비밀번호가 일치하지 않습니다.')
            pwChkRef.current.focus();
            return false;
        }
        if(formData.email !== '' && !regexEmail.test(formData.email)) {
            alert('조건에 맞는 이메일을 입력해주세요.');
            emailRef.current.focus();
            return false;
        }

        return true;
    }

    return (
        <div className="mt-2">
            <div className="row me-0">
                <div className="offset-2 col-8">
                    <h2>회원가입</h2>
                    <p>여기는 join 페이지입니다.</p>
                    <table className="table table-striped">
                        <tbody>
                        <tr>
                            <td rowSpan={info.length+1} width="30%">
                                <input type="file" className="form-control" onChange={() => {}} />
                            </td>
                        </tr>
                        {info.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td width="15%" className="align-content-center">
                                        <label htmlFor={item.id}>{item.label}</label>
                                    </td>
                                    <td width="55%">
                                        <div className="input-group">
                                            <input type={item.id === 'userPw' ? (show ? 'password' : 'text') : item.type} id={item.id} className="form-control"
                                                   placeholder={item.placeholder}
                                                   ref={item.id === 'userId' ? idRef :
                                                       item.id === 'userPw' ? pwRef :
                                                       item.id === 'userPwChk' ? pwChkRef :
                                                       item.id === 'email' ? emailRef : null}
                                                   value={formData[item.id]} onChange={handleInputChange} />
                                            {item.id === 'userId' && <input type="button" className="btn btn-primary" value="중복검사" onClick={dupIdChk} />}
                                            {item.id === 'userPw' &&
                                                <button type="button" className={show ? "btn btn-secondary" : "btn btn-outline-secondary"}
                                                        onClick={() => setShow(!show)}>
                                                    <i className={show ? "bi bi-eye" : "bi bi-eye-slash"}></i>
                                                </button>
                                            }
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                    <div className="text-end">
                        <input type="button" className="btn btn-outline-danger" value="뒤로가기" onClick={()=>{navigate("/")}} />
                        <input type="button" className="btn btn-outline-success" value="회원가입" onClick={join} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Join;
