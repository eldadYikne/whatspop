import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import db from "../firebase"
import { SideBarChat } from "./side-bar-chat"

export function FriendsChat({ chatWithFreind }) {
    const user = useSelector(state => state.userModule.user)
    const rooms = useSelector(state => state.userModule.rooms)
    const navigator = useNavigate()
    const [friends, setFriends] = useState()
    useEffect(() => {
        getFriends()
    }, [])

    const getFriends = async () => {
        const unsubscribe = await db.collection('users').onSnapshot(snapshot => (
            setFriends(snapshot.docs.map(doc => (
                {
                    id: doc.id,
                    data: doc.data()

                }
            )))
        ));
        return () => {
            unsubscribe()
        }
    }
    setTimeout(() => {
        console.log('friends', user)
    }, 1000)

    const createChat = (roomName) => {
      if(rooms.some(room=>room.data.name===roomName) ) return chatWithFreind()

        if (roomName) {
            db.collection('rooms').add({
                name: roomName,
                contact1: user.displayName,
                contact2: roomName,
            })

        }
        chatWithFreind()
    }

    if (!friends) return <img src="https://loading.io/asset/615631" />
    return <div className="sidebar-chats-friend">
        {friends && <div className="sidbar-chats">
            {friends.map(friend => {

                return <a onClick={() => createChat(friend.data.name)}>
                    <SideBarChat friend={friend} id={friend.id}
                        name={friend.data.name} />
                </a>
              

            })}
        </div>}
    </div>
}