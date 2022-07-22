import {useCookies} from "react-cookie";
import React, {useState} from "react";
import axios from "axios";

const UploadImages = ({ setStatus }) => {
    const [cookies, setCookie, removeCookie] = useCookies(null)
    const [newUser, setNewAuthor] = useState(
        {
            photo: '',
        }
    )
    const [file, setFile] = useState('')
    const [data, setData] = useState('')


    const handlePhoto = (e) => {
        setNewAuthor({...newUser, photo: e.target.files});
        setData(e.target.files[0])
    }
    const ImageThumb = ({ image }) => {
        return <img src={URL.createObjectURL(image)} alt={image.name} className="avatar__image" id="myImg"/>;
    };

    const handleSubmit = async  (e) => {
        console.log(newUser.photo)
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', newUser.photo[0])
        formData.append('userId', cookies.UserId)

       await axios.post('http://localhost:8000/image/add/', formData)
            .then(res => {
                console.log(res);
                setFile(data)
                setStatus(true)
            })
            .catch(err => {
                console.log(err);
            })
    }

    const modal = document.getElementById("myModal");
    const img = document.getElementById("myImg");
    const modalImg = document.getElementById("img01");
    const imageFunction = (id) => {
        modal.style.display = "block";
        modalImg.src = img.src;
    }
    
    const spanFunction = () => {
        modal.style.display = "none";
    }

    return(
        <div className="upload-one-image">
            <h1>Mời bạn tải ảnh đại diện</h1>
            <form onSubmit={handleSubmit} >
                <input
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    name="photo"
                    onChange={handlePhoto}
                />
                { data !== '' ? <button type="submit" className="style-4">Tải Ảnh Lên</button> : ""}
            </form>
            <div className="avatar" onClick={(id) => imageFunction(id)}>
                {file && <ImageThumb image={file} />}
            </div>
            <div id="myModal" className="modal">
                <span className="close" onClick={spanFunction}>×</span>
                <img className="modal-content" id="img01" alt="image"/>
            </div>
        </div>
    )
}

export default UploadImages