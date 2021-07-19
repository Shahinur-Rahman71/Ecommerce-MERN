import React, {useContext, useEffect} from 'react'
import {GlobalState} from '../../../GlobalState'
import {Link} from 'react-router-dom'
import axios from 'axios'
import profileIcon from '../../headers/icon/user.svg'


function Profile() {
    const state = useContext(GlobalState)
    const [history, setHistory] = state.userAPI.history
    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token

    useEffect(() => {
        if(token){
            const getHistory = async() =>{
                if(isAdmin){
                    const res = await axios.get('/api/payment', {
                        headers: {Authorization: token}
                    })
                    setHistory(res.data)
                }else{
                    const res = await axios.get('/user/history', {
                        headers: {Authorization: token}
                    })
                    setHistory(res.data)
                }
            }
            getHistory()
        }
    },[token, isAdmin, setHistory])
    // console.log(history)
    const newHistory = history.slice(0,1);

    return (
        <div className="history-page">
            <h2><img src={profileIcon} alt="Cart icon" /></h2>
            {newHistory.map(temp => (
                <div key={temp._id}>
                    <h2 style={{color: "darkblue"}}>{temp.name}</h2>
                    <h3 style={{color: "darkblue", textTransform: 'lowercase',textAlign: 'center'}}>{temp.email}</h3>
                </div>       
            ))}

            <h4 style={{color: 'green'}}>You have {history.length} ordered</h4>

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