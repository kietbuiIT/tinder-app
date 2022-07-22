import React, { useState} from "react";
import axios from "axios";
import {useCookies} from "react-cookie";

const UploadMultipleImage = ({setStatus}) => {
    const [cookies] = useCookies(null)
    const [data, setData] = useState([])
    const [images, setImages] = useState([])
    const [newUser, setNewAuthor] = useState(
        {
            photo: '',
        }
    )

    const handlePhoto = (e) => {
        setNewAuthor({...newUser, photo: e.target.files});
        console.log(newUser.photo)

        //test
        const selectedFiles = []
        const targetFiles = e.target.files
        const targetFilesObject = [...targetFiles]
        targetFilesObject.map((file) => {
            return selectedFiles.push(URL.createObjectURL(file))
        })
        setData(selectedFiles)
    }



    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        let length = newUser.photo.length
        formData.append('userId', cookies.UserId)
        for (let i = 0; i < length; i++) {
            formData.append('images', newUser.photo[i])
        }
        axios.post('http://localhost:8000/images/add/', formData)
            .then(res => {
                console.log(res);
                setImages(data)
                setStatus(true)
            })
            .catch(err => {
                console.log(err);
            })
    }

    const modal = document.getElementById("myModal1");
    const modalImg = document.getElementById("img02");
    const myFunction = (index) => {
        modal.style.display = "block";
        modalImg.src = index.target.src;

    }
    const spanFunction = () => {
        modal.style.display = "none";
    }


    return(
        <div className="upload-multiple-images">
            <h1>Mời bạn tải ảnh liên quan</h1>
            <form onSubmit={handleSubmit} >
                <input
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    name="photo"
                    onChange={handlePhoto}
                    multiple
                />
                {data.length > 0 ?<button type="submit" className="style-4">Tải Ảnh Lên</button> : ""}
            </form>
            <div className="row">
                {images.map( (url, index) => {
                    return <div key = {index} className="column">
                        <img src={url} alt="hello" onClick={(index) => myFunction(index)} style={{width: '100%'}} id={"image"+ index}/>
                    </div>

                })}
            </div>
            <div id="myModal1" className="modal">
                <span className="close" onClick={spanFunction}>×</span>
                <img className="modal-content" id="img02" alt="image"/>
            </div>

        </div>
    )
}

export default UploadMultipleImage