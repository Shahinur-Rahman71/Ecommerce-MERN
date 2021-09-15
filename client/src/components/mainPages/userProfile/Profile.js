import React, { useContext, useEffect, useState } from 'react'
import { GlobalState } from '../../../GlobalState'
import { Link } from 'react-router-dom'
import axios from 'axios'
// import profileIcon from '../../headers/icon/user.svg'
import {showNotifications} from '../notification/Notifications'

const editStyles = { textTransform: 'lowercase', paddingLeft: '15px', color: 'gray', fontStyle: 'italic', fontSize: '15px' }
const inputStyles = { height: '27px', width: '200px', borderRadius: '5px', marginLeft: '20px' }
const buttonStyles = { color: 'white', fontWeight: 'bold', height: '27px', width: '70px', borderRadius: '5px', marginLeft: '5px', backgroundColor: 'gray' }

function Profile() {
    const state = useContext(GlobalState)
    const [history, setHistory] = state.userAPI.history
    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token
    const [editphone, setEditphone] = useState(true)
    const [editaddress, setEditaddress] = useState(true)
    const [change, setChange] = useState({
        phone: '',
        address: ''
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

    const phoneButtonHandler = async () => {
        try {
            if(change.phone.length === 0) return setEditphone(true)
            await axios.put(`/user/infor/${getUser._id}`,{...getUser, phone: change.phone}, {
                headers: {Authorization: token}
            })
            setEditphone(true);
            setChange('');
            window.location.href = "/profile";
        } catch (error) {
            // alert(error.response.data.msg)
            showNotifications('Warning', error.response.data.msg, 'warning')
        }       
    }
    const addressButtonHandler = async () => {
        try {
            if(change.address.length === 0) return setEditaddress(true)
            await axios.put(`/user/infor/${getUser._id}`,{...getUser, address: change.address}, {
                headers: {Authorization: token}
            })
            setEditaddress(true);
            setChange('');
            window.location.href = "/profile";
        } catch (error) {
            // alert(error.response.data.msg)
            showNotifications('Warning', error.response.data.msg, 'warning')
        }       
    }
    // image uploader
    const handleImageUploader = async (e) => {
        e.preventDefault();
        try {
            const file = e.target.files[0]
            // console.log(file)

            if (file.size > 1024 * 1024) // 1mb
                return showNotifications('Warning', "File size is too large", 'warning')

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
            // alert(error.response.data.msg)
            showNotifications('Warning', error.response.data.msg, 'warning')
        }
    }

    return (
        <div className="history-page">
            <h2 >User Profile</h2>
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
                </h2>
                <h3 style={{ color: "darkblue", textTransform: 'capitalize', textAlign: 'center' }}>
                    {`Mobile No: ${getUser.phone}`}
                    {editphone ? (
                        <Link to="/profile" onClick={() => setEditphone(false)} style={editStyles}>Edit</Link>
                    ) : (
                        <>
                            <input onChange={onChangeInputValue} value={change.phone} name="phone" type="text" style={inputStyles} />
                            <button type="submit" onClick={phoneButtonHandler} style={buttonStyles}>Update</button>
                        </>
                    )}
                </h3>
                <h3 style={{marginTop: '5px', color: "darkblue", textTransform: 'capitalize', textAlign: 'center' }}>
                    {`Address: ${getUser.address}`}
                    {editaddress ? (
                        <Link to="/profile" onClick={() => setEditaddress(false)} style={editStyles}>Edit</Link>
                    ) : (
                        <>
                            <input onChange={onChangeInputValue} value={change.address} name="address" type="text" style={inputStyles} />
                            <button type="submit" onClick={addressButtonHandler} style={buttonStyles}>Update</button>
                        </>
                    )}
                </h3>
                <h3 style={{marginTop: '5px', color: "darkblue", textTransform: 'lowercase', textAlign: 'center' }}>
                    {`Email: ${getUser.email}`}
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