import "../css/admin.css";
import logo from "../images/avatar.png"
import {
    UilEstate,
    UilFilesLandscapes,
    UilChart,
    UilThumbsUp,
    UilComment,
    UilShare,
    UilSignout, UilSearch, UilHtml5Alt, UilUser
} from '@iconscout/react-unicons'
import axios from "axios";
import {useEffect, useState} from "react";


const AdminDashboard = () => {

    const [users, setUsers] = useState([])

    const getUsers = async () => {
      try {
          const response = await axios.get('http://localhost:8000/userall')
          console.log(response.data)
          setUsers(response.data)
      }catch (error) {
          console.log(error)
      }
    }

    useEffect(async () => {
      await  getUsers()
    }, [])

    return(
        <div>
      <div className="nav">
          <div className="logo-name">
              <div className="logo-image">
                  <img src={logo} alt="avatar"/>
              </div>

              <span className="logo_name">Tinder Admin</span>
          </div>

          <div className="menu-items">
              <ul className="nav-links">
                  <li><a href="#">
                      <i className="uil uil-estate"> <UilEstate/> </i>
                      <span className="link-name">Dahsboard</span>
                  </a></li>
                  <li><a href="#">
                      <i className="uil uil-files-landscapes"><UilFilesLandscapes/></i>
                      <span className="link-name">Content</span>
                  </a></li>
                  <li><a href="#">
                      <i className="uil uil-chart"><UilChart/></i>
                      <span className="link-name">Analytics</span>
                  </a></li>
                  <li><a href="#">
                      <i className="uil uil-thumbs-up"><UilThumbsUp/></i>
                      <span className="link-name">Like</span>
                  </a></li>
                  <li><a href="#">
                      <i className="uil uil-comments"><UilComment/></i>
                      <span className="link-name">Comment</span>
                  </a></li>
                  <li><a href="#">
                      <i className="uil uil-share"><UilShare/></i>
                      <span className="link-name">Share</span>
                  </a></li>
              </ul>

              <ul className="logout-mode">

                  <li><a href="#">
                      <i className="uil uil-signout"><UilSignout/></i>
                      <span className="link-name">Logout</span>
                  </a>
                  </li>
              </ul>
          </div>
        </div>

        <section className="dashboard1">
            <div className="top">
                <i className="uil uil-bars sidebar-toggle"></i>

                <div className="search-box">
                    <i className="uil uil-search"><UilSearch/></i>
                    <input type="text" placeholder="Search here..."/>
                </div>

                <img src={logo} alt=""/>
            </div>

            <div className="dash-content">
                <div className="overview">
                    <div className="title">
                        <i className="uil uil-tachometer-fast-alt"><UilHtml5Alt/></i>
                        <span className="text">Dashboard</span>
                    </div>

                    <div className="boxes">
                        <div className="box box1">
                            <i className="uil uil-thumbs-up"></i>
                            <span className="text">Total Users</span>
                            <span className="number">{users.length}</span>
                        </div>
                        <div className="box box2">
                            <i className="uil uil-comments"></i>
                            <span className="text">Comments</span>
                            <span className="number">20,120</span>
                        </div>
                        <div className="box box3">
                            <i className="uil uil-share"></i>
                            <span className="text">Total Share</span>
                            <span className="number">10,120</span>
                        </div>
                    </div>
                </div>

            <div className="activity">
                <div className="title">
                    <i className="uil uil-user"><UilUser/></i>
                    <span className="text"></span>
                </div>

                <div className="activity-data">
                    <div className="data names">
                        <span className="data-title">Name</span>
                        {users.map( (user, index ) => {
                            return <span className="data-list" key={index}>{user.first_name + " " + user.last_name}</span>
                        })}
                    </div>
                    <div className="data email">
                        <span className="data-title">Email</span>
                        {users.map( (user, index ) => {
                            return <span className="data-list" key={index}>{user.email}</span>
                        })}
                    </div>
                    <div className="data joined">
                        <span className="data-title">Phone</span>
                        {users.map( (user, index ) => {
                            return <span className="data-list" key={index}>{user.phone}</span>
                        })}
                    </div>
                    <div className="data joined">
                        <span className="data-title">Birthday</span>
                        {users.map( (user, index ) => {
                            return <span className="data-list" key={index}>{user.date}</span>
                        })}
                    </div>
                    <div className="data type">
                        <span className="data-title">Gender</span>
                        {users.map( (user, index ) => {
                            return <span className="data-list" key={index}>{user.gender_identity}</span>
                        })}
                    </div>
                    <div className="data status">
                        <span className="data-title">Education</span>
                        {users.map( (user, index ) => {
                            return <span className="data-list" key={index}>{user.education}</span>
                        })}
                    </div>
                    <div className="data status">
                        <span className="data-title">Status</span>
                        {users.map( (user, index ) => {
                            return <span className="data-list" key={index}>{user.status}</span>
                        })}
                    </div>
                </div>
            </div>
            </div>

        </section>
        </div>

    )

}


export default AdminDashboard