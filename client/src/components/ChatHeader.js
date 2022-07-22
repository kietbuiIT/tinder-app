import { useCookies } from 'react-cookie'
import {Link, Redirect} from "react-router-dom";

const ChatHeader = ({ user }) => {
    const [ cookies, setCookie, removeCookie ] = useCookies(['user'])

    const logout = () => {
        removeCookie('UserId', cookies.UserId)
        removeCookie('AuthToken', cookies.AuthToken)
      //  window.location.reload()


    }

    return (
        <div className="chat-container-header">
            <div className="profile">
                <div className="img-container">
                    <img src={user.image_avatar} alt={"photo of " + user.first_name + user.last_name}/>
                </div>
                <h3>{user.first_name+ ' ' + user.last_name}</h3>
            </div>
           <Link to="/"><i className="log-out-icon" onClick={logout}>⇦(LogOut)</i></Link>
        </div>
    )
}

export default ChatHeader