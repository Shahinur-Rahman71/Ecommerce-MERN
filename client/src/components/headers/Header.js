import React, { useContext, useState, useEffect } from 'react';
import { GlobalState } from '../../GlobalState';
import Menu from './icon/menu.svg';
import Close from './icon/close.svg';
import Cart from './icon/cart.svg';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
    const state = useContext(GlobalState);
    //console.log(state);
    const [isLogged] = state.userAPI.isLogged
    const [isAdmin] = state.userAPI.isAdmin;
    const [cart] = state.userAPI.cart;
    const [menu, setMenu] = useState(false)
    const [token] = state.token
    const [getUser, setGetuser] = useState([]);

    useEffect(() => {
        if (token) {

            const getUserHistory = async ()=> {
                const userInfo = await axios.get('/user/infor', {
                    headers: { Authorization: token }
                });

                setGetuser(userInfo.data)
            }
            getUserHistory()
        }
    }, [token]);

    const adminRouter = () => {
        return (
            <>
                <li><Link to="/create_product">Create Products</Link></li>
                <li><Link to="/category">Categories</Link></li>
            </>
        )
    }

    const logoutUser = async () => {
        await axios.get('/user/logout');

        localStorage.removeItem('firstLogin')
        window.location.href = "/";
    }

    const loggedRouter = () => {
        return (
            <>
                {/* <li><Link to="/history">History</Link></li> */}
                {!isAdmin ? (
                    <li>
                        {/* <Link to="/profile"><i className="fas fa-user-circle"></i></Link> */}
                        <Link to="/profile"><img style={{width: '25px', height: '20px',borderRadius: '50%',position: 'relative'}} src={getUser.images} alt="profile" /></Link>
                    </li>) : <li><Link to="/history">History</Link></li>
                }

                <li><Link to="/" onClick={logoutUser}>Logout</Link></li>
            </>
        )
    }


    const styleMenu = {
        left: menu ? 0 : "-100%"
    }

    return (
        <header>

            <div className="menu" onClick={() => setMenu(!menu)}>
                <img src={Menu} alt="" width="30" />
            </div>

            <div className="logo">
                <h1>
                    <Link to="/">{isAdmin ? 'Admin' : 'ameerah.shop'}</Link>
                </h1>
            </div>

            <ul style={styleMenu}>
                <li><Link to="/">{isAdmin ? 'All Products' : 'Products'}</Link></li>

                {isAdmin && adminRouter()}

                {
                    isLogged ? loggedRouter() : <li><Link to="/login">Signup / Login</Link></li>
                }

                <li onClick={() => setMenu(!menu)}>
                    <img src={Close} alt="Close icon" width="30" className="menu" />
                </li>
            </ul>

            {
                isAdmin ? '' : (
                    <div className="cart-icon">
                        <span>{cart.length}</span>
                        <Link to="/cart">
                            <img src={Cart} alt="Cart icon" width="30" />
                        </Link>
                    </div>
                )
            }


        </header>
    );
};

export default Header;