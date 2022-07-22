import TinderCard from 'react-tinder-card'
import React, {useEffect, useState} from 'react'
import ChatContainer from '../components/ChatContainer'
import {useCookies} from 'react-cookie'
import axios from 'axios'

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import {Pagination, Navigation, EffectFade, Mousewheel, Keyboard, EffectFlip} from "swiper";



const Dashboard = () => {
    const [user, setUser] = useState(null)
    const [genderedUsers, setGenderedUsers] = useState(null)
    const [lastDirection, setLastDirection] = useState()
    const [cookies, setCookie, removeCookie] = useCookies(['user'])

    const [images, setImages] = useState([])



    const getUser = async () => {
        try {
            const response = await axios.get('http://localhost:8000/user', {
                params: {userId}
            })
            setUser(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const userId = cookies.UserId


    const getGenderedUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/gendered-users', {
                params: {gender: user?.gender_interest}
            })
            setGenderedUsers(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUser()

    }, [])

    useEffect(() => {
        if (user) {
            getGenderedUsers()
        }
    }, [user])

    const updateMatches = async (matchedUserId) => {
        try {
            await axios.put('http://localhost:8000/addmatch', {
                userId,
                matchedUserId
            })
            getUser()
        } catch (err) {
            console.log(err)
        }
    }


    const swiped = (direction, swipedUserId) => {
        if (direction === 'right') {
            updateMatches(swipedUserId)
        }
        setLastDirection(direction)
    }


    const outOfFrame = (name) => {
        console.log(name + ' left the screen!')
    }

    const matchedUserIds = user?.matches.map(({user_id}) => user_id).concat(userId)

    const filteredGenderedUsers = genderedUsers?.filter(genderedUser => !matchedUserIds.includes(genderedUser.user_id))

    const getAge = (dateString) => {
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }


    const modal = document.getElementById("myModal1");
    const saveImage = (images) => {
        modal.style.display = "block";
        setImages(images)
    }

    const spanFunction = () => {
        modal.style.display = "none";
    }

    return (
        <>
            {user &&
            <div className="dashboard">
                <ChatContainer user={user}/>
                <div className="swipe-container">
                    <div className="card-container">

                        {filteredGenderedUsers?.map((genderedUser) =>
                            <TinderCard
                                className="swipe"
                                key={genderedUser.user_id}
                                onSwipe={(dir) => swiped(dir, genderedUser.user_id)}
                                onCardLeftScreen={() =>
                                    outOfFrame(genderedUser.first_name + genderedUser.last_name )}>
                                <div style={{backgroundImage: "url(" + genderedUser.image_avatar + ")"}}
                                    className="card">
                                    <div className="container_center">
                                        <p>{genderedUser.first_name + " "+ genderedUser.last_name + " "}
                                            {getAge(genderedUser.date)}</p>
                                        <p>{genderedUser.show_gender? genderedUser.gender_identity : ""}</p>
                                        <p>{genderedUser.interests}</p>
                                        <p>{genderedUser.education}</p>
                                        <p>{genderedUser.about}</p>
                                    </div>
                                    <div className="about">
                                        <p onClick={() => saveImage(genderedUser.relate_image)}>Xem Thêm</p>
                                    </div>
                                </div>
                            </TinderCard>
                        )}

                        <div className="swipe-info">
                            <div id="myModal1" className="modal">
                                <span className="close" onClick={spanFunction}>×</span>
                                <div>
                                    <Swiper
                                        effect={"flip"}
                                        grabCursor={true}
                                        pagination={true}
                                        navigation={true}
                                        modules={[EffectFlip, Pagination, Navigation]}
                                        className="mySwiper"
                                    >
                                        {
                                            images?.map(src =>
                                                <SwiperSlide><img src={src} alt=""/></SwiperSlide>
                                            )
                                        }
                                    </Swiper>
                                </div>
                                </div>
                            {lastDirection ? <p>You swiped {lastDirection}</p> : <p/>}
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}
export default Dashboard
