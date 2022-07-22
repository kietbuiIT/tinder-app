import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'


const AuthModal = ({ setShowModal,  isSignUp }) => {
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)

     const [phone, setPhone] = useState(null)


    const [errorCheckLogin, setErrorCheckLogin] = useState(null)
    const [ cookies, setCookie, removeCookie] = useCookies(null)

    let navigate = useNavigate()

    const handleClick = () => {
        setShowModal(false)
    }

    function validatePhoneNumber(input_str) {
        const re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
        return re.test(input_str);
    }

    const checkPhone = (phone) => {
        const formPhone = document.getElementById('phone-error')
        if (!validatePhoneNumber(phone)) {
            formPhone.classList.add('display-error')
            formPhone.classList.remove('phone-error')
            formPhone.innerText = ("Bạn phải nhập đúng định dạng số điện thoại")
        }else {
            formPhone.classList.remove('display-error')
            formPhone.classList.add('phone-error')
            formPhone.innerText = ("")
            setPhone(phone)
        }
    }

    const checkConfirmPassword = (confirmPassword) => {
        const checkConfirmPassword = document.getElementById('confirm-password-error')
        if (isSignUp && (password !== confirmPassword)) {
            checkConfirmPassword.classList.add('display-error')
            checkConfirmPassword.classList.remove('confirm-password-error')
            checkConfirmPassword.innerText = ('Password không khớp nhau!')
        }else {
            checkConfirmPassword.classList.remove('display-error')
            checkConfirmPassword.classList.add('confirm-password-error')
            checkConfirmPassword.innerText = ("")
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            if (isSignUp && (password !== confirmPassword)) {
                const checkConfirmPassword = document.getElementById('confirm-password-error')
                checkConfirmPassword.classList.add('display-error')
                checkConfirmPassword.classList.remove('confirm-password-error')
                checkConfirmPassword.innerText = ('Password không khớp nhau!')
                return
            }

            const response = await axios.post(`http://localhost:8000/${isSignUp ? 'signup' : 'login'}`, { email, phone, password })

            setCookie('AuthToken', response.data.token)
            setCookie('UserId', response.data.userId)

            const success = response.status === 201
            if (success && isSignUp) navigate ('/onboarding')
            if (success && !isSignUp) navigate ('/dashboard')

            window.location.reload()

        } catch (error) {
            setErrorCheckLogin("Bạn đã Nhập sai Email hoặc Password!")
            checkError(error.response.status)

        }

    }


    const checkError = (input) => {
        const formEmail = document.getElementById('email-error')
      if (input === 409){
             formEmail.classList.add('display-error')
             formEmail.innerText = "Email Này đã có người sử dụng!"
      }
    }



    return (
        <div className="auth-modal">
            <div className="close-icon" onClick={handleClick}>ⓧ</div>

            <h2>{isSignUp ? 'Đăng kí tài khoản': 'Đăng Nhập'}</h2>
            <p>Khi bạn nhấn vào đăng kí nghĩa là bạn đã đồng ý với điều khoản của chúng tôi.</p>
            <form className={isSignUp ? "signup" : "login"} onSubmit={handleSubmit}>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder={isSignUp ? "Mời Nhận Email " : "Mời bạn nhập Email đã đăng kí."}
                    required={true}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <p id="email-error" className="error email-error"></p>
                {isSignUp && <input
                    type="phone"
                    id="phone"
                    name="phone"
                    placeholder="Mời bạn nhập số điện thoại"
                    required={true}
                    onBlur={(e) => checkPhone(e.target.value)}
                />}
                <p id="phone-error" className="error phone-error"></p>

                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Mời bạn nhập mật khẩu"
                    required={true}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {isSignUp && <input
                    type="password"
                    id="password-check"
                    name="password-check"
                    placeholder="Xác nhận lại mật khẩu"
                    required={true}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={(e) => checkConfirmPassword(e.target.value)}
                />}
                <p id="confirm-password-error" className="error confirm-password-error"></p>

                {/*<input className="secondary-button" type="submit"/>*/}
                <button type="submit" className="secondary-button">{isSignUp ? "Đăng Kí" : "Đăng Nhập"}</button>
                <p>{!isSignUp ? errorCheckLogin : ""}</p>
            </form>

            <hr/>
            <h2><a href="/forgot">{isSignUp ? " " : "Quên mật khẩu"}</a></h2>
        </div>
    )
}
export default AuthModal
