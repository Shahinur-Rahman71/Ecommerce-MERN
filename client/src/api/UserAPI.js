import { useEffect, useState } from 'react';
import axios from 'axios'
import {showNotifications} from '../components/mainPages/notification/Notifications'

const UserAPI = (token) => {

    const [isLogged, setIsLogged] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [cart, setCart] = useState([]);
    const [history, setHistory] = useState([])

    useEffect(() => {
        if (token) {

            const getUser = async () => {
                try {
                    const res = await axios.get('/user/infor', {
                        headers: { Authorization: token }
                    });

                    setIsLogged(true);
                    res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false)

                    setCart(res.data.cart)
                    // console.log(res.data.name)
                } catch (err) {
                    // alert(err.response.data.msg);
                    showNotifications('Warning', err.response.data.msg, 'warning')
                }
            }

            getUser()
        }
    }, [token])


    const addCart = async (product) => {
        if (!isLogged) return showNotifications('Warning', "Please login", 'warning');

        const check = cart.every(item => {
            return item._id !== product._id
        })

        if (check) {
            setCart([...cart, { ...product, quantity: 1 }]);

            await axios.patch('/user/addcart', { cart: [...cart, { ...product, quantity: 1 }] }, {
                headers: { Authorization: token }
            })

        } else {
            // alert("This product already added to the cart.")
            showNotifications('Warning', "This product already added to the cart", 'warning')
        }
    }

    return {
        isLogged: [isLogged, setIsLogged],
        isAdmin: [isAdmin, setIsAdmin],
        cart: [cart, setCart],
        addCart: addCart,
        history: [history, setHistory],
    }
};

export default UserAPI;