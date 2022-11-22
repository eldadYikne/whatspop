import { Avatar, IconButton } from "@material-ui/core";
import { AttachFile, InsertEmoticon, Mic, MoreVert, SearchOutlined, Send } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import db from "../firebase";
import { utilService } from "../service/util";
import EmojiPicker from 'emoji-picker-react';
import { storageService } from "../service/storage.service";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { uploadService } from "../service/upload.service";
import sound from '../assets/sound/message.wav'

export function Chat() {

    const [input, setInput] = useState('')
    const [roomName, setRoom] = useState()
    const [messages, setMessages] = useState(null)
    const [audio, setAudio] = useState(new Audio(sound))
    const { roomId } = useParams()
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [openEmoji, setOpenEmoji] = useState(false);
    const navigate = useNavigate()
    const user = storageService.load('user')
    const rooms = useSelector(state => state.userModule.rooms)
    const moveHere = useRef();

    useEffect(() => {
        getChats()

        return () => {
            setRoom(null)
        }


    }, [roomId])

    const getChats = async () => {
        setRoom('')
        if (roomId) {
            await db.collection('rooms').doc(roomId).
                onSnapshot(snapshot => {
                    if (snapshot.data()) {

                        setRoom(snapshot.data().name)

                        if (snapshot.data().name) {

                            db.collection('rooms').doc(roomId).collection('messages').orderBy('timestamp', 'asc')
                                .onSnapshot(snapshot => {
                                    setMessages(snapshot.docs.map(doc => doc.data()))
                                    let mess = snapshot.docs.map(doc => doc.data())
                                    if (!mess.length > 0) return
                                    let time= utilService.getDate(new Date())
                                    if (mess[mess?.length - 1].name !== user.displayName && time === utilService.getDate(mess[mess?.length - 1].timestamp)) {
                                        audio.play()
                                    }
                                })
                        }
                        const room = rooms.find(room => room.id === roomId)
                      
                        if (room?.data.contact2 === user.displayName) {
                            setRoom(room.data.contact1)
                        } else if (!room?.data.contact1 && user.displayName)
                            setRoom(snapshot.data().name)

                    }
                })

        }

    }
    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
        const newInput = [input, event.emoji].join('')
        setInput(newInput)
        setOpenEmoji(!openEmoji)



    };

    const sendMassage = (ev) => {
        ev.preventDefault()
        if (!input) return
        const name = 'rooms'

        if (user) {
            db.collection(name).doc(roomId).collection('messages').add({
                message: input,
                name: user.displayName,
                timestamp: Date.now(),
            })
        }

        setInput('')
        moveHere.current.scrollIntoView()
    }
    const onGoBack = () => {
        navigate('/rooms')
    }

    const onUploadImg = async (ev) => {
        try {
            const data = await uploadService.uploadImg(ev)

            if (user) {
                db.collection('rooms').doc(roomId).collection('messages').add({
                    message: input,
                    name: user.displayName,
                    timestamp: Date.now(),
                    img: {
                        name: data.original_filename,
                        url: data.secure_url
                    },
                })
            }

        } catch (err) {
            console.log(err);
        }
    }



    if (!messages) return ''
    return <div className="chat">
        <div className="chat-header">
            <span className="back" onClick={onGoBack}>
                <ChevronLeftIcon />
            </span>
            <Avatar src={`https://avatars.dicebear.com/api/avataaars/${roomName}.svg`} />
            <div className="chat-header-info">
                <h3>{roomName} </h3>
                <p>  {messages?.length > 0 ?
                    `Last seen at ${utilService.getDate(messages[messages.length - 1]?.timestamp)}` : 'Last seen '

                }</p>
            </div>
            <div className="chat-header-right">
                <IconButton>
                    <SearchOutlined />
                </IconButton>
                <IconButton>

                    <div className="upload-source">
                        <input className="input-upload" type="file" onChange={onUploadImg} />
                        <AttachFile />
                    </div>
                </IconButton>
                <IconButton>
                    <MoreVert />
                </IconButton>
            </div>
        </div>
        <div className="chat-body">
            {messages && messages.map(message => {
                return <p key={message.timestamp} className={`chat-massage ${user.displayName === message.name && 'chat-reciever'} ${message.img ? 'message-img' : ''}`}>
                    <span className="chat-name " style={{color: utilService.getRandomColor(message.name.length)}}>{message.name}</span>

                    {message.img ? <img src={message.img.url} className="img" /> : <span className="chat-text ">{message.message}</span>}

                    <span className="chat-time ">
                        {utilService.getDate(message.timestamp)}
                    </span>

                </p>
            })}



            <div ref={moveHere}></div>
        </div>
        <div className="chat-footer">
            <IconButton onClick={() => setOpenEmoji(!openEmoji)}>
                <InsertEmoticon />
            </IconButton>
            {openEmoji && <EmojiPicker height={400} onEmojiClick={onEmojiClick} />}

            <form onSubmit={sendMassage}>
                <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Type a massage" />
                <button >send</button>
            </form>
            {input ? <IconButton><Send onClick={sendMassage} /></IconButton> : <Mic />}
        </div>
    </div>

}