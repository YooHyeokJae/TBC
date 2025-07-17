import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useOutletContext, useParams} from "react-router-dom";
import FormattedDateTime from "../components/FormattedDateTime";
import Swal from "sweetalert2";

function BoardDetail() {
    const {loginUser, setLoginUser} = useOutletContext();
    const { num } = useParams();
    const navigate = useNavigate();
    const [board, setBoard] = useState({num: '', replyList: []});
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [replyTo, setReplyTo] = useState('');
    const [reply, setReply] = useState('');
    const [parentNum, setParentNum] = useState(0);
    const [modifyFlag, setModifyFlag] = useState(false);

    const countView = (num) => {
        fetch(`/board/countView`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ num: num }),
        }).then(res => res.text())
            .then(data => {
                if(data === 'success')  getDetail();
            })
            .catch(err => console.log(err));
    }

    const getDetail = () => {
        setReply('');
        setReplyTo('');
        setParentNum(0);

        fetch(`/board/getDetail`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({num: num})
        }).then(res => res.json())
            .then(data => {
                setBoard(data);
                setTitle(data.title);
                setContent(data.content);
            })
            .catch(err => console.log(err));
    }

    const modifyBoard = () => {
        Swal.fire({
            title: '게시글을 수정하시겠습니까?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '예',
            confirmButtonColor: '#3085d6',
            cancelButtonText: '아니요'
        }).then((result) => {
            if(result.isConfirmed) {
                fetch(`/board/modifyBoard`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({num: num, title: title, content: content})
                }).then(res => res.text())
                    .then(data => {
                        if(data === 'success')  getDetail();
                    })
                    .catch(err => console.log(err));
            } else {
                setTitle(board.title);
                setContent(board.content);
            }
        }).then(()=>{setModifyFlag(false)})
    }

    const deleteBoard = () => {
        Swal.fire({
            title: '게시글을 삭제하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '예',
            confirmButtonColor: '#3085d6',
            cancelButtonText: '아니요'
        }).then((result) => {
            if(result.isConfirmed) {
                fetch(`/board/deleteBoard`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({num: num})
                }).then(res => res.text())
                    .then(data => {
                        if(data === 'success')  navigate("/board");
                    })
                    .catch(err => console.log(err));
            }
        })
    }

    const insertReply = () => {
        let params = {
            boardNum: num,
            writerId: loginUser.userId,
            parentNum: parentNum,
            content: reply
        }

        fetch(`/board/insertReply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        }).then(res => res.text())
            .then(getDetail)
            .catch(err => console.log(err));
    }

    const deleteReply = (replyNum) => {
        Swal.fire({
            title: '댓글을 삭제하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '예',
            confirmButtonColor: '#3085d6',
            cancelButtonText: '아니요'
        }).then((result)=>{
            if(result.isConfirmed) {
                fetch(`/board/deleteReply`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({num: replyNum})
                }).then(res => res.text())
                    .then(getDetail)
                    .catch(err => console.log(err));
            }
        })
    }

    useEffect(() => {
        countView(num);
    }, [num])

    if(board.num === 0) return (
        <div className="mt-2">
            <div className="row me-0">
                <div className="offset-2 col-8">
                    <h2>잘못된 접근입니다.</h2>
                    <Link to="/board">목록으로</Link>
                </div>
            </div>
        </div>
    )

    return (
        <div className="mt-2">
            <div className="row me-0">
                <div className="offset-2 col-8">
                    <div className="d-flex justify-content-end mb-2">
                        <input type="button" className="btn btn-outline-secondary me-2" value="목록" onClick={()=>{navigate("/board")}} />
                        {loginUser != null && loginUser.userId === board.writerId && (
                            <div>
                                {modifyFlag ?
                                    (<input type="button" className="btn btn-outline-warning me-2" value="저장" onClick={modifyBoard} />) :
                                    (<input type="button" className="btn btn-outline-warning me-2" value="수정" onClick={()=>{setModifyFlag(true)}}/>)
                                }
                                <input type="button" className="btn btn-outline-danger me-2" value="삭제" onClick={deleteBoard} />
                            </div>
                        )}
                    </div>
                    <div className="card mb-3">
                        <div className="card-header">
                            <div className="d-flex align-items-end">
                                <h4 className="d-flex m-0" style={{width: '45%'}}>
                                    <i className="bi bi-book"></i>&nbsp;
                                    {modifyFlag ?
                                        (<input type="text" className="form-control m-0 p-0" value={title}
                                                onChange={(e)=>{setTitle(e.target.value)}} />) :
                                        (<span>{board.title}</span>)}
                                </h4>
                                <h6 className="m-0" style={{width: '14%'}}><i className="bi bi-person"></i> <span>{board.userName}</span></h6>
                                <h6 className="m-0" style={{width: '5%'}}><i className="bi bi-eye"></i> <span>{board.view}</span></h6>
                                <h6 className="m-0" style={{width: '18%'}}><i className="bi bi-clock"></i> <span><FormattedDateTime date={board.regDate}/></span></h6>
                                <h6 className="m-0" style={{width: '18%'}}><i className="bi bi-clock"></i> <span><FormattedDateTime date={board.updDate}/></span></h6>
                            </div>
                        </div>
                        <div className="card-body">
                            <div style={{minHeight: '200px'}}>
                                {modifyFlag ?
                                    (<textarea className="form-control m-0 p-0" rows="10" style={{resize: 'none'}} value={content}
                                               onChange={(e)=>{setContent(e.target.value)}} />) :
                                    (<span>{board.content}</span>)}
                            </div>
                        </div>
                        <hr className="mb-0"/>
                        <div className="card-body pt-0">
                            <table className="table table-striped">
                                <thead>
                                <tr className="text-center">
                                    <th width="15%">작성자</th>
                                    <th width="*">댓글</th>
                                    <th width="20%">작성일</th>
                                    <th width="3%"></th>
                                </tr>
                                </thead>
                                <tbody>
                                {board.replyList.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center">
                                            <span>등록된 댓글이 없습니다.</span>
                                        </td>
                                    </tr>
                                    ) : board.replyList.map(reply => (
                                        <tr key={reply.num} style={{cursor: "pointer"}}
                                            onClick={() => {
                                                setParentNum(reply.parentNum);
                                                setReplyTo(reply.userName + '에게 대답');
                                            }}>
                                            <td>{reply.userName}</td>
                                            <td>{reply.parentNum === reply.num ? '' : <i className="bi bi-arrow-return-right"></i>} {reply.content}</td>
                                            <td><FormattedDateTime date={reply.regDate} /></td>
                                            <td>{loginUser != null && loginUser.userId === reply.writerId &&
                                                <i className="bi bi-trash" onClick={() => {deleteReply(reply.num)}}></i>
                                            }</td>
                                        </tr>
                                ))
                                }
                                </tbody>
                            </table>
                            <div className="input-group">
                                {replyTo !== '' && (
                                    <span className="badge bg-dark-subtle text-dark d-flex align-items-center">
                                        {replyTo}&nbsp;
                                        <button className="badge bg-white border-0 text-black" onClick={()=>{
                                            setParentNum(0);
                                            setReplyTo('')
                                        }}>X</button>
                                    </span>
                                )}
                                <input type="text" className="form-control" value={reply} onChange={(e) => {setReply(e.target.value)}} />
                                <input type="button" className="btn btn-primary" value="등록" onClick={insertReply}/>
                            </div>
                        </div>
                        <div className="card-footer">
                            <span>다음글: {board.nextNum !== 0 ? (<Link to={"/board/"+board.nextNum}>{board.nextTitle}</Link>) : ('다음글이 없습니다.')}</span>
                        </div>
                        <div className="card-footer">
                            <span>이전글: {board.prevNum !== 0 ? (<Link to={"/board/"+board.prevNum}>{board.prevTitle}</Link>) : ('이전글이 없습니다.')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BoardDetail;
