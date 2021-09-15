import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {showNotifications} from '../notification/Notifications'

const Register = () => {
    const [user,setUser] = useState({
        name: '',
        email: '',
        password: ''
    });

    const onChangeInputValue= (e) => {
        const {name,value} = e.target;
        setUser({...user, [name]: value});
    }

    const registerSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/user/register', {...user})
        
            // localStorage.setItem('firstLogin', true)
            // window.location.href = "/";
            // alert('Registration done !! Please check your email for activation')
            showNotifications('Success', 'Registration done !! Please check your email for activation', 'success')
            
        } catch (error) {
            // alert(error.response.data.msg)
            showNotifications('Warning', error.response.data.msg, 'warning')
        }
    }

    return (
        <div className="login-page">
            <form onSubmit={registerSubmit}>
                <h2>Signup</h2>
                <input type="text" name="name" placeholder="Name" 
                    value={user.name} onChange={onChangeInputValue}/>

                <input type="email" name="email" placeholder="Email" 
                    value={user.email} onChange={onChangeInputValue}/>

                <input type="password" name="password" placeholder="Password" 
                value={user.password} autoComplete="on" onChange={onChangeInputValue}/>

                <div className="row">
                    <button type="submit">Signup</button>
                    <Link to="/login">Login</Link>
                </div>
            </form>
        </div>
    );
};

export default Register;