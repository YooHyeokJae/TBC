import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useOutletContext} from "react-router-dom";
import FormattedDateTime from "../components/FormattedDateTime";
import Pagination from "../components/Pagination";

function Board() {
    const {loginUser, setLoginUser} = useOutletContext();
    const navigate = useNavigate();

    const [keyword, setKeyword] = useState('');
    const [grid, setGrid] = useState(10);
    const [boardList, setBoardList] = useState([]);
    const [page, setPage] = useState(1);
    const [totalCnt, setTotalCnt] = useState(0);

    const search = () => {
        getTotalCount();
    }

    const getTotalCount = () => {
        let params = {}

        fetch(`/board/getTotalCount`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify(params)
        }).then(res => res.json())
            .then(data => {setTotalCnt(data)})
            .catch(err=>{console.log(err)});
    }

    const getBoardList = () => {
        let params = {
            page: page,
            grid: grid,
        }

        fetch('/board/getBoardList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        }).then(res => res.json())
            .then(data => {setBoardList(data);})
            .catch(err => console.log(err));
    }

    useEffect(() => {
        if(loginUser === null) {
            navigate('/');
        }else{
            getTotalCount();
            getBoardList();
        }
    }, []);

    useEffect(() => {
        getBoardList();
    }, [page, grid])

    return (
        <div className="mt-2">
            <div className="row me-0 pb-2">
                <div className="offset-2 col-8">
                    <h2 className="mb-2"><Link to="/todo">업무 목록으로</Link></h2>

                    <div className="card">
                        <div className="card-header d-flex justify-content-center">
                            <input type="text" id="keyword" value={keyword} className="form-control"
                                   onChange={e => setKeyword(e.target.value)}/>
                            <div className="selectGrid ms-1" style={{width: '130px'}}>
                                <select className="form-select" value={grid}
                                        onChange={(e) => {
                                            setGrid(Number(e.target.value));
                                            setPage(1)
                                        }}>
                                    <option value="5">5개</option>
                                    <option value="10">10개</option>
                                    <option value="25">25개</option>
                                    <option value="50">50개</option>
                                    <option value="100">100개</option>
                                </select>
                            </div>
                            <input type="button" className="btn btn-primary ms-1" value="검색" onClick={search}/>

                            <Link to="/board/insert" className="btn btn-outline-primary ms-1" style={{width: '130px'}}>새 글작성</Link>
                        </div>
                        <div className="card-body">
                            <table className="table table-striped table-hover">
                                <thead>
                                <tr className="text-center">
                                    <th width="5%" scope="col">#</th>
                                    <th width="*" scope="col">제목</th>
                                    <th width="10%" scope="col">작성자</th>
                                    <th width="18%" scope="col">작성일</th>
                                    <th width="18%" scope="col">수정일</th>
                                    <th width="7%" scope="col">조회수</th>
                                </tr>
                                </thead>
                                <tbody id="tbd">
                                {boardList.map(board => (
                                    <tr key={board.num} style={{cursor: 'pointer'}}
                                        onClick={() => navigate(`/board/${board.num}`)}>
                                        <td className="text-center">{board.num}</td>
                                        <td className="text-start">{board.title}</td>
                                        <td className="text-start">{board.userName}</td>
                                        <td className="text-center"><FormattedDateTime date={board.regDate}/></td>
                                        <td className="text-center"><FormattedDateTime date={board.updDate}/></td>
                                        <td className="text-center">{board.view}</td>
                                    </tr>
                                ))}
                                {Array.from({length: Math.max(0, grid - boardList.length)}, (_, i) => (
                                    <tr key={`empty-${i}`}>
                                        <td colSpan="6">&nbsp;</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="card-footer">
                            <Pagination page={page} setPage={setPage} grid={grid} totalCnt={totalCnt}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Board;
