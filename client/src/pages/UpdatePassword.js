
import "../css/updatePassword.css"

const UpdatePassword = () => {

    return(
        <div>
        <div className="bg"></div>
            <div className="modalUpdate">
                <div className="cardUpdate">
                    <div className="title">Change Password</div>
                        <div className="input-group">
                            <input type="email" placeholder="Email" required={true}/>
                        </div>
                        <div className="input-group">
                            <input type="text" placeholder="Password"/>
                        </div>
                        <div className="input-group">
                            <input type="text" placeholder="New password"/>
                        </div>
                        <div className="input-group">
                            <input type="text" placeholder="Password confirm"/>
                        </div>
                        <button type="submit" className="submit">Thay Đổi</button>

                </div>
            </div>
        </div>
    )
}

// export default UpdatePassword