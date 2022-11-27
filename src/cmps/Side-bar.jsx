
import { AddComment, Chat, DonutLarge, MoreVert, SearchOutlined } from '@mui/icons-material';
import { Avatar, IconButton } from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';
import { SideBarChat } from './side-bar-chat';
import db from '../firebase';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { logOut, setRoomList } from '../store/action';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as Loading } from '../assets/img/svg-load.svg'
import { ReactComponent as Load } from '../assets/img/load.svg'
import { FriendsChat } from './friends-chat';
import { storageService } from '../service/storage.service';

export function SideBar() {
    const [rooms, setRooms] = useState()
    const [optionWindow, setOptionWindow] = useState(false)
    const [friendsOpen, setFriendsOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const user = storageService.load('user')
    const { roomId } = useParams()

    const dispatch = useDispatch()
    const navigate = useNavigate();

    useEffect(() => {
        window.addEventListener("resize", handleResize, true);
        handleResize()
        // getRooms()
        const unsubscribe = db.collection('rooms').onSnapshot(snapshot => {
            const rooms = snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            }))
            dispatch(setRoomList(rooms))
            setRooms(rooms)

            console.log(rooms);
            console.log(user.displayName);
        });

        return () => {
            unsubscribe()
        }
    }, [])


    const handleResize = () => {
        if (window.innerWidth < 650) {
            setIsMobile(true)


        } else {
            setIsMobile(false)
        }
        isMobileSideBar()
    }
    const onOpenOption = () => {
        setOptionWindow(!optionWindow)
    }

    // const getRooms = async () => {
    //     const unsubscribe = await db.collection('rooms').onSnapshot(snapshot => {
    //         const rooms = snapshot.docs.map(doc => ({
    //             id: doc.id,
    //             data: doc.data()
    //         }))
    //         setRooms(rooms)
    //         dispatch(setRoomList(rooms))

    //         console.log(rooms);
    //     });

    //     return () => {
    //         unsubscribe()
    //     }
    // }

    const onLogOut = () => {
        dispatch(logOut())
        navigate('/login')
    }
    const chatWithFreind = () => {
        setFriendsOpen(!friendsOpen)

    }
    const isMobileSideBar = () => {
        if (isMobile && roomId) {
            return 'sidebar none'
        } else if (isMobile && !roomId) {
            return 'sidebar'
        } else {
            return 'sidebar'

        }
    }
    const loadingIsMobile = () => {
        return isMobile ? 'loading none' : 'loading'

    }
    const onSearchContact = (ev) => {
        ev.preventDefault()
        db.collection('rooms').onSnapshot(snapshot => {
            const rooms = []
            snapshot.docs.map(doc => {
                if (doc.data()?.contact1) {
                    if (doc.data()?.contact1.includes(ev.target.value)) {
                        rooms.push({
                            id: doc.id,
                            data: doc.data()
                        })
                    }

                } else if (doc.data().name.includes(ev.target.value)) {
                    rooms.push({
                        id: doc.id,
                        data: doc.data()
                    })
                }
            })
            setRooms(rooms)

        });
    }
    if (!rooms) return <Load />
    return user && <section className='app-body relative'>

        <div className={isMobileSideBar()}  >

            <div className="sidbar-header">
                <div className='user-img'>
                    <Avatar src={user?.photoURL} />
                    {isMobile ? <span>Whatspop </span> : ''}
                </div>
                <div className="sidebar-header-right">
                    <IconButton>
                        <DonutLarge />
                    </IconButton>
                    <IconButton onClick={chatWithFreind}>
                        <AddComment />
                    </IconButton>
                    <IconButton onClick={onOpenOption}>
                        <MoreVert />
                        {optionWindow && <div className='option-window'>
                            <ul>
                                <li >
                                    <SideBarChat addNewChat={true} />
                                </li>
                                <li onClick={onLogOut}>Log Out </li>
                            </ul>

                        </div>}
                    </IconButton>

                </div>
            </div>
            <div className="sidbar-search">
                <div className="sidebar-search-container">
                    <SearchOutlined />
                    <input type="text" placeholder="Search or start new chat" onChange={onSearchContact} />
                </div>
            </div>

            {rooms && !friendsOpen ? <div className="sidbar-chats">
                {rooms.map(room => {
                    if (!room.data.contact1) {

                        return <Link key={room.id} to={`${room.id}`}>
                            <SideBarChat id={room.id}
                                name={room.data.name} isPrivate={false} />     </Link>
                    } else {
                        if (room.data.contact1 === user.displayName) {
                            return <Link key={room.id} to={`${room.id}`}>
                                <SideBarChat id={room.id}
                                    name={room.data.name} isPrivate={true} />     </Link>
                        } else if (room.data.contact2 === user.displayName) {
                            return <Link key={room.id} to={`${room.id}`}>
                                <SideBarChat id={room.id}
                                    name={room.data.contact1} isPrivate={true} />     </Link>
                        }
                    }
                })}
            </div> :
                <FriendsChat chatWithFreind={chatWithFreind} />
            }

        </div>

        {roomId && !isMobile ? <Outlet /> : roomId && isMobile ? <Outlet /> : !roomId && isMobile ? '' : !roomId && !isMobile ?
            <div className={loadingIsMobile()}>
                <Loading />
                <h1> WhatsApp Web</h1>
                <p>
                    Send and receive messages without keeping your phone online.
                    <br />
                    Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
                </p>

            </div> : ''
        }

    </section>

}