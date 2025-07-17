import React, {useState} from 'react';
import '../styles/chat.css';

function ChatTools({loginUser}) {
    const [isOpen, setIsOpen] = useState(false);
    const [targetId, setTargetId] = useState('');
    const [chatRoom, setChatRoom] = useState(null); // 채팅방 정보가 들어갈 객체

    const searchTarget = () => {
        let params = {
            userId: loginUser.userId,
            targetId: targetId,
        }

        fetch(`/chat/searchTarget`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        }).then(res => res.json())
            .then(data => {
                setChatRoom(data);
                // chatRoom.num 이 0일 경우 아이디 잘못 입력했다고 표현해줘야 함
                console.log(data);
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="position-fixed z-3">
            <button type="button" className={isOpen ? "chatBtn open" : "chatBtn"}
                    onClick={() => setIsOpen(!isOpen)}>
                <i className="bi bi-chat-dots"></i>
            </button>

            <div className={isOpen ? "chatDiv open" : "chatDiv"}>
                <div className="row m-0 mt-2">
                    <div className="col-4">
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder="input target's ID"
                                   onChange={(e) => {setTargetId(e.target.value)}} />
                            <button className="btn btn-light border" onClick={searchTarget}><i className="bi bi-search"></i></button>
                        </div>
                        <div>
                            채팅방 목록
                        </div>
                    </div>
                    <div className="col-8">
                        채팅 기록
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatTools;
