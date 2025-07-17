import React, {useEffect, useRef, useState} from 'react';
import {Link, useNavigate, useOutletContext} from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import DatePicker from 'react-datepicker';
import Swal from 'sweetalert2';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/style.css'

function ToDo() {
    const navigate = useNavigate();
    const {loginUser, setLoginUser} = useOutletContext();
    const contentRef = useRef(null);
    const periodPicker = useRef(null);
    const [grid, setGrid] = useState('day');
    const [period, setPeriod] = useState('');
    const [content, setContent] = useState('');
    const [deadline, setDeadline] = useState(new Date());
    const [status, setStatus] = useState(false);
    const [workList, setWorkList] = useState([])

    const insertWork = () => {
        let params = {
            userId: loginUser.userId,
            content: content,
            deadline: deadline ? deadline.toISOString().split('T')[0] : ''
        }
        if(params.userId === '' || params.content === '' || params.deadline === ''){
            alert('값을 입력해주세요.');
            return false;
        }
        fetch(`/toDo/insertWork`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        }).then(res => res.text())
            .then(data => {
                if(data === 'success'){
                    contentRef.current.value = '';
                    setContent('');
                    setDeadline(new Date());
                    getWorkList();
                }
            })
            .catch(err => console.log(err));
    }

    const getWorkList = () => {
        let params = {
            userId: loginUser.userId,
            status: status ? 1 : 0,
            period: period
        }
        fetch(`/toDo/getWorkList`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        }).then(res => res.json())
            .then(data => {
                setWorkList(data);
            })
            .catch(err => console.log(err));
    }

    const deleteWork = (workNum) => {
        Swal.fire({
            title: '작업을 삭제하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '예',
            confirmButtonColor: '#3085d6',
            cancelButtonText: '아니요'
        }).then((result) => {
            if(result.isConfirmed) {
                fetch(`/toDo/deleteWork`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({num: workNum})
                }).then(res => res.text())
                    .then(data => {
                        if(data === 'success'){
                            getWorkList();
                        }
                    })
                    .catch(err => console.log(err));
                }
            }
        )
    }

    const changeStatus = (num, status) => {
        fetch(`/toDo/changeStatus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ num: num, status: status })
        }).then(res => res.text())
            .then(data => {
                if(data === 'success'){
                    getWorkList();
                }
            })
            .catch(err => console.log(err));
    }

    function parsePeriod(str) {
        const match = str.match(/(\d{4})년\s*(\d{1,2})월(?:\s*(\d{1,2})일)?/);
        if (!match) return new Date();

        const year = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1;
        const day = match[3] ? parseInt(match[3], 10) : 1;  // 일 없으면 1일로

        return new Date(year, month, day);
    }

    function gridChange(type) {
        let now;
        if(type instanceof Date){
            now = type;
            type = 0;
        } else {
            now = type === 0 ? new Date() : parsePeriod(period)
        }

        if(grid === 'month'){
            now.setMonth(now.getMonth() + type);
            let month = now.toLocaleString('default', { year: 'numeric', month: 'long' });
            setPeriod(month);
        } else if (grid === 'week'){
            now.setDate(now.getDate() + type * 7);
            const { strOfWeek, endOfWeek } = getWeekRange(now);
            let start = strOfWeek.toLocaleString('default', { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' });
            let end = endOfWeek.toLocaleString('default', { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' });
            setPeriod(start + ' ~ ' + end);
        } else{
            now.setDate(now.getDate() + type);
            let date = now.toLocaleString('default', { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' });
            setPeriod(date);
        }
    }

    function getWeekRange(date) {
        const day = date.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
        const diffToSunday = -day;
        const diffToSaturday = 6 - day;

        const strOfWeek = new Date(date);
        strOfWeek.setDate(date.getDate() + diffToSunday);

        const endOfWeek = new Date(date);
        endOfWeek.setDate(date.getDate() + diffToSaturday);

        return { strOfWeek, endOfWeek };
    }

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const newList = Array.from(workList);
        const [movedItem] = newList.splice(result.source.index, 1);
        newList.splice(result.destination.index, 0, movedItem);

        setWorkList(newList);

        console.log(workList)
        // 서버에 순서 저장하기 (fetch)
    };

    useEffect(() => {
        if(loginUser === null) {
            navigate('/');
        } else {
            gridChange(parsePeriod(period));
        }
    }, [loginUser, grid]);

    useEffect(() => {
        if(loginUser === null) {
            navigate('/');
        } else {
            getWorkList();
        }
    }, [period, status]);

    return (
        <div className="mt-2">
            <div className="row me-0">
                <div className="offset-2 col-8">
                    <h2 className="mb-2"><Link to="/board">게시판으로</Link></h2>
                    <div className="card" style={{minHeight: '400px'}}>
                        <div className="card-header d-flex justify-content-between">
                            <h4 className="d-flex w-100 align-content-center align-items-center m-0 p-0">
                                <button className="btn btn-light" onClick={() => {gridChange(-1)}}><i className="bi bi-arrow-left-short"></i></button>
                                <span style={{cursor: 'pointer'}} onClick={()=>{periodPicker.current.input.click()}}>{period}</span>
                                <DatePicker ref={periodPicker} className="d-none" onChange={(e)=>{gridChange(e)}} selected={parsePeriod(period)} showMonthYearDropdown={false} />
                                <button className="btn btn-light" onClick={() => {gridChange(1)}}><i className="bi bi-arrow-right-short"></i></button>
                            </h4>
                            <div className="d-flex justify-content-end align-items-center" style={{minWidth: '300px'}}>
                                <div className="form-check form-switch me-3">
                                    <input className="form-check-input" type="checkbox" role="switch" id="showAll" onClick={() => {setStatus(!status)}} />
                                    <label className="form-check-label" htmlFor="showAll">모든 작업 보기</label>
                                </div>

                                <select className="form-select w-25" defaultValue='day'
                                        onChange={(e) => {
                                            setGrid(e.target.value)
                                        }}>
                                    <option value="month">달</option>
                                    <option value="week">주</option>
                                    <option value="day">일</option>
                                </select>
                            </div>
                        </div>
                        <div className="card-body">
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="workList">
                                    {(provided) => (

                            <div className="workList"
                                 {...provided.droppableProps}
                                 ref={provided.innerRef}>
                                {workList.map((work, index) => (
                                    <Draggable key={work.num} draggableId={work.num.toString()} index={index}>
                                        {(provided) => (

                                        <div key={work.num} className="d-flex form-control align-items-center"
                                             ref={provided.innerRef}
                                             {...provided.draggableProps}>
                                            <div className="btn-group" role="group">
                                                <input type="radio" className="btn-check" name={"status_"+work.num} id={"0_"+work.num} checked={work.status === 0} onChange={()=>{changeStatus(work.num, 0)}} />
                                                <label htmlFor={"0_"+work.num} className="btn btn-outline-primary btn-group-nowrap">진행</label>
                                                <input type="radio" className="btn-check" name={"status_"+work.num} id={"1_"+work.num} checked={work.status === 1} onChange={()=>{changeStatus(work.num, 1)}} />
                                                <label htmlFor={"1_"+work.num} className="btn btn-outline-primary btn-group-nowrap">완료</label>
                                                <input type="radio" className="btn-check" name={"status_"+work.num} id={"2_"+work.num} checked={work.status === 2} onChange={()=>{changeStatus(work.num, 2)}} />
                                                <label htmlFor={"2_"+work.num} className="btn btn-outline-primary btn-group-nowrap">보류</label>
                                            </div>
                                            <div className="form-control">{work.content}</div>
                                            <div className="btn" {...provided.dragHandleProps}><i className="bi bi-arrow-down-up"></i></div>
                                            <button className="btn btn-danger" onClick={() => {deleteWork(work.num)}}><i className="bi bi-trash"></i></button>
                                        </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </div>
                        <div className="card-footer">
                            <div className="input-group">
                                <span className="text-center align-content-center background_cccccc ps-2 pe-2" style={{borderTopLeftRadius: '0.375rem', borderBottomLeftRadius: '0.375rem'}}>작업 내용</span>
                                <input type="text" ref={contentRef} className="form-control"
                                       onChange={e => setContent(e.target.value)} />
                                <span className="text-center align-content-center background_cccccc ps-2 pe-2">마감일</span>
                                <DatePicker name="deadline" selected={deadline} dateFormat="yyyy-MM-dd" placeholderText="날짜 선택"
                                            onChange={(date) => setDeadline(date)}
                                            customInput={ <input className="form-control" style={{ borderRadius: 0, width: '120px' }} /> } showMonthYearDropdown={false} />
                                <input type="button" className="btn btn-outline-secondary" value="작업추가"
                                       onClick={insertWork} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ToDo;
