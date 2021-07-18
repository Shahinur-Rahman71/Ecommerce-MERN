import React, { useContext } from 'react';
import {Switch, Route} from 'react-router-dom';
import DetailProduct from './detailproducts/DetailProduct';
import Login from './auth/Login';
import Register from './auth/Register';
import Cart from './cart/Cart';
import Products from './products/Products';
import NotFounds from './utils/not_founds/NotFounds';
import { GlobalState } from '../../GlobalState';
// import OrderHistory from './history/OrderHistory';
import OrderDetails from './history/OrderDetails';
import Categories from './categories/Categories';
import CreateProduct from './createProducts/CreateProduct';
import Bkash from './cart/Bkash';
import Profile from './userProfile/Profile';

const Pages = () => {
    const state = useContext(GlobalState);
    const [isLogged] = state.userAPI.isLogged;
    const [isAdmin] = state.userAPI.isAdmin;


    return (
        <Switch>
            <Route path="/" exact component={Products}/>
            <Route path="/detail/:id" exact component={DetailProduct}/>

            <Route path="/login" exact component={isLogged ? NotFounds : Login}/>
            <Route path="/register" exact component={isLogged ? NotFounds : Register}/>

            <Route path="/category" exact component={isAdmin ? Categories : NotFounds}/>

            <Route path="/create_product" exact component={isAdmin ? CreateProduct : NotFounds}/>
            <Route path="/edit_product/:id" exact component={isAdmin ? CreateProduct : NotFounds}/>

            {/* <Route path="/history" exact component={isLogged ? OrderHistory : NotFounds}/>
            <Route path="/history/:id" exact component={isLogged ? OrderDetails : NotFounds}/> */}

            <Route path="/payment" exact component={isLogged ? Bkash : NotFounds}/>
            <Route path="/cart" exact component={Cart}/>

            <Route path="/profile" exact component={Profile}/>
            <Route path="/profile/:id" exact component={isLogged ? OrderDetails : NotFounds}/>

            <Route path="*" exact component={NotFounds}/>
        </Switch>
    );
};

export default Pages;