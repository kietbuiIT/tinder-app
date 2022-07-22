import React, {useState} from "react";
import "../css/forgotPassword.css"
import axios from "axios";


const ForgotPassword = () => {

    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        newpassword: "",
    })
    const [check, setCheck] = useState("")
    const [error, setError] = useState(null)

    const handleChange = (e) => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
        const name = e.target.name
        console.log(name)
        console.log(value)
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }

    const formPhone = document.getElementById('phone-error')


    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.newpassword !== check){
            console.log(formData.newpassword)
            setError("Password không khớp nhau!")
            return
        }

        axios.post('http://localhost:8000/forgotpassword', {formData})
            .then(res => {
                console.log(res)
                formPhone.classList.add('display-error')
                formPhone.classList.remove('phone-error')
                formPhone.innerHTML = (`Cập nhật thành công! <a href="/">Home</a>`)
            })
            .catch(err => {
                console.log(err)
                formPhone.classList.add('display-error')
                // formPhone.classList.add('phone-error')
                formPhone.innerText = ("Lỗi Email hoặc Password!")
            })
    }
    
    return(
        <div className="container">
            <div className="sign-in-section">
                <h1>Forgot Password</h1>
                <p>Liên Hệ Với chúng tôi</p>
                <ul>
                    <li><i className="fa fa-facebook-f"></i></li>
                    <li><i className="fa fa-linkedin"></i></li>
                </ul>
                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="email">Email</label>
                        <input id="emailForgot" type="email"
                               name= "email"
                               placeholder="Email" required={true}
                               onChange={handleChange}
                        />
                        
                    </div>
                    <div className="form-field">
                        <label htmlFor="phone">Phone</label>
                        <input id="phoneForget" type="phoneForgot"
                               name = "phone"
                               placeholder="Phone" required={true}
                               onChange={handleChange}
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="newPassword">New Password</label>
                        <input id="newPassword" type="password"
                               name = "newpassword"
                               placeholder="New Password" required={true}
                               onChange={handleChange}
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="newPasswordCheck">Confirm Password</label>
                        <input id="newPasswordCheck" type="password"
                               name = "confirmpassword"
                               placeholder="Confirm Password" required={true}
                               onChange={(e) => setCheck(e.target.value) }
                        />
                    </div>
                    <div className="form-options">
                        <p>{error}</p>
                        <p id="phone-error" className="error phone-error"></p>
                        {/*<p>{success ? "Đã cập nhận thành công" +   : "Email hoặc Phone bị lỗi" }</p>*/}
                    </div>
                    <div className="form-field">
                        <button type="submit" className="btn btn-signin">Gửi </button>
                    </div>
                </form>
            </div>
        </div>
    )
}


export default ForgotPassword