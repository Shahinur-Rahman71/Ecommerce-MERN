import React, { useState, useContext } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';


const Bkash = () => {
    const state = useContext(GlobalState);
    const [cart, setCart] = state.userAPI.cart;
    const [token] = state.token


    const [user, setUser] = useState({
        phone: '',
        address: ''
    });

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

    return (
        <div className="login-page">
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
        </div>
    );
};

export default Bkash;
