import React, {useState} from "react";
import Nav from "../components/Nav";
import UploadMultipleImage from "../components/UploadMultipleImage";
import UploadImage from "../components/UploadImage";
import {useNavigate} from "react-router-dom";

const PageUploadImages = () => {

    const [status, setStatus] = useState(false)
    const [status1, setStatus1] = useState(true)
    let navigate = useNavigate()
    const handleSubmit = () => {
      if (status || status1){
            navigate('/dashboard')
      }else {
          console.log('error')
      }
    }

    return(
        <div>
            <Nav
                minimal={true}
                setShowModal={() => {
                }}
                showModal={false}
            />
            <div className="pageImage">
                <UploadImage setStatus = {setStatus}/>
                <UploadMultipleImage setStatus = {setStatus1} />
            </div>


            <button type="submit" className="fill" onClick={handleSubmit}>Hoàn Thành</button>
        </div>
    )
}

export default PageUploadImages