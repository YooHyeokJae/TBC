import React, {useState} from 'react';
import {Link, useNavigate, useOutletContext} from "react-router-dom";

function BoardInsert() {
    const {loginUser, setLoginUser} = useOutletContext();
    const navigate = useNavigate();
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');

    const insertBoard = () => {
        let params = {
            writerId: loginUser.userId,
            title: title,
            content: content,
        }
        fetch(`/board/insertBoard`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        }).then(res => res.text())
            .then(data => {
                if(data === 'success')  navigate('/board');
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="mt-2">
            <div className="row me-0">
                <div className="offset-2 col-8">
                    <h2>새 글 작성</h2>
                    <div className="card">
                        <div className="card-header">
                            <div className="d-flex align-items-center">
                                <label style={{width: "5%"}} htmlFor="title">제목</label>
                                <input style={{width: "95%"}} type="text" id="title" className="form-control" onChange={(e) => {setTitle(e.target.value)}} />
                            </div>
                        </div>
                        <div className="card-body">
                            <textarea id="content" rows="10" cols="130" className="form-control" style={{resize: "none"}} onChange={(e) => {setContent(e.target.value)}} ></textarea>
                        </div>
                        <div className="card-footer text-end">
                            <Link to="/board" className="btn btn-outline-warning me-2">취소</Link>
                            <input type="button" className="btn btn-outline-success" value="작성" onClick={insertBoard} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BoardInsert;
