import { Avatar } from "@material-ui/core";
import { Close, DoneAll, Photo } from "@mui/icons-material";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import db from "../firebase";
import { utilService } from "../service/util";

export function SideBarChat({ id, name, addNewChat, friend, isPrivate }) {

    const [messages, setMessages] = useState()
    const [openProfileImg, setOpenImg] = useState(false)
    const user = useSelector(state => state.userModule.user)

    useEffect(() => {
        if (id) {
            db.collection('rooms').doc(id).collection('messages').orderBy('timestamp', 'desc').
                onSnapshot(snapshot => (
                    setMessages(snapshot.docs.map(doc => doc.data()))
                ))
        }

    }, [id])

    const createChat = () => {
        const roomName = prompt("please enter room name")
        if (roomName) {
            db.collection('rooms').add({
                name: roomName
            })
        }
    }
    const nameToShow = () => {
        console.log('messages',messages)
        
        if (messages[0].name === user.displayName) {
            if (isPrivate) {
                return ''
            } else {
                return 'You :'
            }
        } else {
            if (isPrivate) {
                return ''
            }
            return `${messages[0].name} :`
        }
    }

    const openImg = (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        setOpenImg(!openProfileImg)
        console.log('hello');
    }
    return !addNewChat ? (<section className="sidebar-chat">
        <Avatar src={`https://avatars.dicebear.com/api/avataaars/${name}.svg`} onClick={openImg} />
        <div className={`open-img ${openProfileImg ? ' block' : ''}`}>
            <div className="title-opne-img">
                <Close onClick={openImg} />
                <h3> {name}</h3>
            </div>
            <img className={`img-big`} src={`https://avatars.dicebear.com/api/avataaars/${name}.svg`} />
        </div>
        <div className="sidebar-chat-info">
            <div className="info-chat">

                <h2> {name}</h2>

                <p className="last-message">{messages?.length > 0 ? `${nameToShow()} ${messages[0].message}` : ''} {messages?.length > 0 ?messages[0]?.img? `Photo` :'' :''} </p>
            </div>

            <div className="time-chat">
                <p className="last-message">{messages?.length > 0 ? utilService.getDate(messages[0].timestamp) : ''}</p>
            </div>
        </div>
    </section>) : (
        <section onClick={createChat} className="sidebar-chat add">
            <span className="new-group">New group</span>
        </section>)
}