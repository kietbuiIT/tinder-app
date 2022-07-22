import Nav from '../components/Nav'
import React, {useState} from 'react'
import {useCookies} from 'react-cookie'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

const OnBoarding = () => {
    const [cookies] = useCookies(null)
    const [formData, setFormData] = useState({
        user_id: cookies.UserId,
        first_name: "",
        last_name: "",
        date: "",
        show_gender: false,
        gender_identity: "man",
        gender_interest: "woman",
        about: "",
        matches: [],
        birthplace: "",
        location: "",
        interests: "",
        education: "",
    })

    let navigate = useNavigate()

    const handleSubmit = async (e) => {
        console.log('submitted')
        e.preventDefault()

        try {
            const response = await axios.put('http://localhost:8000/user', {formData})
            console.log(response)
            console.log(formData)
            const success = response.status === 200
            if (success) navigate('/uploadimage')
        } catch (err) {
            console.log(err)
        }
    }

    const handleChange = (e) => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
        const name = e.target.name
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }

    const options = [
        {
            label: "Tiến Sĩ",
            value: "Tiến Sĩ",
        },
        {
            label: "Thạc Sĩ",
            value: "Thạc Sĩ",
        },
        {
            label: "Đại Học",
            value: "Đại Học",
        },
        {
            label: "Cao Đẳng",
            value: "Cao Đẳng",
        },{
            label: "Khác",
            value: "Khác",
        }
    ];

    return (
        <>
            <Nav
                minimal={true}
                setShowModal={() => {
                }}
                showModal={false}
            />

            <div className="onboarding">
                <h2>Tạo Thông Tin Hiển Thị</h2>

                <form onSubmit={handleSubmit}>
                    <section>
                        <section className="section1">
                            <div>


                        <label htmlFor="first_name">Họ</label>
                        <input
                            id="first_name"
                            type='text'
                            name="first_name"
                            placeholder="Mời Bạn Nhập Họ"
                            required={true}
                            style={{width: "310px"}}
                            value={formData.first_name}
                            onChange={handleChange}
                        />
                            </div>
                            <div>
                        <label htmlFor="last_name">Tên</label>
                        <input
                            id="last_name"
                            type='text'
                            name="last_name"
                            placeholder="Nhập Bạn Nhập Tên"
                            required={true}
                            style={{width: "310px"}}
                            value={formData.last_name}
                            onChange={handleChange}
                        />
                            </div>
                        </section>
                        <label>Ngày Sinh</label>
                        <input type="date" min="1982-01-01" max="2005-01-01"
                               name="date" onChange={handleChange} id="date"
                               required={true}
                        />

                        <label>Giới Tính</label>
                        <div className="multiple-input-container">
                            <input
                                id="man-gender-identity"
                                type="radio"
                                name="gender_identity"
                                value="man"
                                onChange={handleChange}
                                checked={formData.gender_identity === "man"}
                            />
                            <label htmlFor="man-gender-identity">Nam</label>
                            <input
                                id="woman-gender-identity"
                                type="radio"
                                name="gender_identity"
                                value="woman"
                                onChange={handleChange}
                                checked={formData.gender_identity === "woman"}
                            />
                            <label htmlFor="woman-gender-identity">Nữ</label>
                            <input
                                id="more-gender-identity"
                                type="radio"
                                name="gender_identity"
                                value="more"
                                onChange={handleChange}
                                checked={formData.gender_identity === "more"}
                            />
                            <label htmlFor="more-gender-identity">More</label>
                        </div>

                        <label htmlFor="show-gender">Bạn có muốn hiển thị giới tính của mình trên hồ sơ không?</label>

                        <input
                            id="show-gender"
                            type="checkbox"
                            name="show_gender"
                            onChange={handleChange}
                            checked={formData.show_gender}
                        />

                        <label>Bạn kết bạn với ai?</label>

                        <div className="multiple-input-container">
                            <input
                                id="man-gender-interest"
                                type="radio"
                                name="gender_interest"
                                value="man"
                                onChange={handleChange}
                                checked={formData.gender_interest === "man"}
                            />
                            <label htmlFor="man-gender-interest">Nam</label>
                            <input
                                id="woman-gender-interest"
                                type="radio"
                                name="gender_interest"
                                value="woman"
                                onChange={handleChange}
                                checked={formData.gender_interest === "woman"}
                            />
                            <label htmlFor="woman-gender-interest">Nữ</label>
                            <input
                                id="everyone-gender-interest"
                                type="radio"
                                name="gender_interest"
                                value="everyone"
                                onChange={handleChange}
                                checked={formData.gender_interest === "everyone"}
                            />
                            <label htmlFor="everyone-gender-interest">Tất cả mọi người</label>
                        </div>

                        <label htmlFor="birthplace" >Nơi sinh</label>
                        <input
                            id="birthplace"
                            type="text"
                            name="birthplace"
                            required={true}
                            placeholder="Mời bạn nhập nơi sinh của bạn."
                            value={formData.birthplace}
                            onChange={handleChange}
                        />

                        <label htmlFor="location" >Chỗ ở hiện tại</label>
                        <input
                            id="location"
                            type="text"
                            name="location"
                            required={true}
                            placeholder="Mời bạn nhập nơi ở hiện tại."
                            value={formData.location}
                            onChange={handleChange}
                        />

                        <label htmlFor="education" >Trình Độ Học Vấn</label>
                        <select onChange={handleChange} name="education" id="education" required={true}>
                            {options.map((option, index) => (
                                <option value={option.value} key={index}>{option.label}</option>
                            ))}
                        </select>

                        <label htmlFor="interests" >Đơn vị công tác</label>
                        <input
                            id="interests"
                            type="text"
                            name="interests"
                            placeholder="Mời bạn nhập Đơn vị công tác."
                            value={formData.interests}
                            onChange={handleChange}
                        />

                        <label htmlFor="about">Mô tả về bản thân</label>
                        <textarea
                            id="about"
                            name="about"
                            required={true}
                            placeholder="Mời bạn viết đôi dòng về bản thân hay về sở thích của bạn ...."
                            value={formData.about}
                            onChange={handleChange}
                        />
                        <button type="submit" className="submit fill" id="submit">Tiếp Theo</button>
                    </section>
                </form>

            </div>
        </>
    )
}
export default OnBoarding
