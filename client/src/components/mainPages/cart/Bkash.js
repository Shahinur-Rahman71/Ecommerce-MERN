import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';


const Bkash = () => {
    const state = useContext(GlobalState);
    const [cart, setCart] = state.userAPI.cart;
    const [token] = state.token
    const [design, setDesign] = useState('false');
    const [user, setUser] = useState({
        phone: '',
        address: ''
    });

    useEffect(() => {
        if (token) {
            const getHistory = async () => {
                const userInfo = await axios.get('/user/infor', {
                    headers: { Authorization: token }
                });
                setUser({phone: userInfo.data.phone, address: userInfo.data.address})
            }
            getHistory()
        }
    }, [token])


    const onChangeInputValue = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    }

    const paymentSubmit = async (e) => {
        e.preventDefault();
        try {

            await axios.post('/api/payment', {cart, ...user}, {
                headers: {Authorization: token}
            })

            setCart([])
            //addToCart([])
            alert("you have successfully placed an order.")
            window.location.href = "/profile";

        } catch (error) {
            alert(error.response.data.msg)
        }
    }

    const cashOnOnclick = (e) => {
        e.preventDefault();
        setDesign('true')
    }
    const bkashOnclick = (e) => {
        e.preventDefault();
    }

    return (
        <div className="login-page">
            {(design === 'true') ? (
                <form onSubmit={paymentSubmit}>
                    <h3 style={{ color: "white"}}>Payment Information</h3><br/>

                    <input type="text" name="phone" required placeholder="Phone no"
                        value={user.phone} onChange={onChangeInputValue} />

                    <input type="text" name="address" required placeholder="Present Address"
                        value={user.address} onChange={onChangeInputValue} />

                    <div className="row">
                        <button type="submit">Submit</button>
                    </div>
                </form>

            ) : (
                <div className="row">
                    <form>
                        <button onClick={bkashOnclick} type="submit" style={{marginLeft: "10px"}}>Pay By Bkash</button>
                        <button onClick={cashOnOnclick} type="submit" style={{marginLeft: "50px", width: "200px"}}>Cash On Delivery</button>
                    </form>
                    
                </div>
            )}
        </div>
    );
};

export default Bkash;
