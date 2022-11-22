import { Button } from "@material-ui/core";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import db, { auth, provider } from "../firebase";
import { logIn } from "../store/action";

export function Login() {
    const dispatch = useDispatch()

    const user = useSelector(state => state.userModule.user)
    const [usersList, setUserList] = useState(null)

    const onSignIn = () => {
        auth.signInWithPopup(provider).then(res => {
            console.log(res.user);
            dispatch(logIn(res.user))
            const userExist= usersList.find(user=>user.name===res.name)
            if(!userExist){
                db.collection('users').add({
                        name: res.user.multiFactor.user.displayName,
                        imgUrl: res.user.multiFactor.user.photoURL
                    })
                }
        
            db.collection('users').onSnapshot(snapshot => {
                const usersNew = snapshot.docs.map(doc => {
                    console.log('docc', doc);
                    return {
                        id: doc.id,
                        data: doc.data()
                    }
                })
                console.log('usersNew',usersNew)
                
                setUserList(usersNew)
            });
        })
            .catch(err => {
                console.log(err);
            })

    }


    return <div className="login">
        <h1>login</h1>
        <div className="green-bgc">
        </div>
        <div className="login-container">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png" />
            <div className="login-text">
                <h1>
                    Sign in to WhatsApp
                </h1>
            </div>
            <Button type="submit" onClick={onSignIn}>
                Sign In With Google
            </Button>

        </div>
    </div>
}