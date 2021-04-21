import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

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
    
            localStorage.setItem('firstLogin', true)
            window.location.href = "/";
            
        } catch (error) {
            alert(error.response.data.msg)
        }
    }

    return (
        <div className="login-page">
            <form onSubmit={registerSubmit}>
                <h2>Signup</h2>
                <input type="text" name="name" required placeholder="Name" 
                    value={user.name} onChange={onChangeInputValue}/>

                <input type="email" name="email" required placeholder="Email" 
                    value={user.email} onChange={onChangeInputValue}/>

                <input type="password" name="password" required placeholder="Password" 
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