import React, { useContext, useEffect, useState } from 'react'
import { GlobalState } from '../../../GlobalState'
import { Link } from 'react-router-dom'
import axios from 'axios'
// import profileIcon from '../../headers/icon/user.svg'

const editStyles = { textTransform: 'lowercase', paddingLeft: '15px', color: 'gray', fontStyle: 'italic', fontSize: '15px' }
const inputStyles = { height: '27px', width: '200px', borderRadius: '5px', marginLeft: '20px' }
const buttonStyles = { color: 'white', fontWeight: 'bold', height: '27px', width: '70px', borderRadius: '5px', marginLeft: '5px', backgroundColor: 'gray' }

function Profile() {
    const state = useContext(GlobalState)
    const [history, setHistory] = state.userAPI.history
    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token
    const [editname, setEditname] = useState(true)
    const [change, setChange] = useState({
        name: ''
    });
    const [getUser, setGetuser] = useState([]);

    useEffect(() => {
        if (token) {
            const getHistory = async () => {
                if (isAdmin) {
                    const res = await axios.get('/api/payment', {
                        headers: { Authorization: token }
                    })
                    setHistory(res.data)
                } else {
                    const res = await axios.get('/user/history', {
                        headers: { Authorization: token }
                    });
                    const userInfo = await axios.get('/user/infor', {
                        headers: { Authorization: token }
                    });

                    setHistory(res.data)
                    setGetuser(userInfo.data)
                }
            }
            getHistory()
        }
    }, [token, isAdmin, setHistory])

    // const newHistory = history.slice(0,1);
    // console.log(getUser._id)

    const onChangeInputValue = (e) => {
        const { name, value } = e.target;
        setChange({[name]: value })
    }

    const nameButtonHandler = async () => {
        // e.preventDefault()
        try {
            if(change.name.length === 0) return setEditname(true)
            await axios.put(`/user/infor/${getUser._id}`,{...getUser, name: change.name}, {
                headers: {Authorization: token}
            })
            setEditname(true)
            setChange('');
            window.location.href = "/profile";
        } catch (error) {
            alert(error.response.data.msg)
        }       
    }
    // image uploader
    const handleImageUploader = async (e) => {
        e.preventDefault();
        try {
            const file = e.target.files[0]
            // console.log(file)

            if (file.size > 1024 * 1024) // 1mb
                return alert("File size is too large.")

            // if (file.type !== 'image/jpeg' && file.type !== 'image/png')
            //     return alert("File format is incurrect")

            let formData = new FormData()
            formData.append('file', file)
            // console.log(formData)

            const res = await axios.post('/api/profileUpload', formData, {
                headers: { 'content-type': 'multipart/form-data', Authorization: token }
            })
            // console.log(res.data.url)

            await axios.put(`/user/infor/${getUser._id}`,{...getUser, images: res.data.url}, {
                headers: {Authorization: token}
            })
            window.location.href = "/profile";

        } catch (error) {
            alert(error.response.data.msg)
        }
    }

    return (
        <div className="history-page">
            <div className="profileImage">
                <img src={getUser.images} alt="profile_Image" />
                <span>
                    <i className="fas fa-camera"></i>
                    <p>Change</p>
                    <input type="file" name="file" id="file_up" accept="image/*" onChange={handleImageUploader}/>
                </span>
            </div>

            <div>
                <h2 style={{ color: "darkblue" }}>
                    {getUser.name}
                    {editname ? (
                        <Link to="/profile" onClick={() => setEditname(false)} style={editStyles}>Edit</Link>
                    ) : (
                        <>
                            <input onChange={onChangeInputValue} value={change.name} name="name" type="text" style={inputStyles} />
                            <button type="submit" onClick={nameButtonHandler} style={buttonStyles}>Submit</button>
                        </>
                    )}

                </h2>
                <h3 style={{ color: "darkblue", textTransform: 'lowercase', textAlign: 'center' }}>
                    {getUser.email}
                </h3>
            </div>


            <h4 style={{ color: 'green' }}>You have {history.length} ordered</h4>

            <table>
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Date of Ordered</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        history.map(items => (
                            <tr key={items._id}>
                                <td>{items._id}</td>
                                <td>{new Date(items.createdAt).toLocaleDateString()}</td>
                                <td><Link to={`/history/${items._id}`}>View</Link></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Profile