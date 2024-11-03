import { Routes, Route, Navigate } from "react-router-dom";
import Home from '../userPage/Home';
import Signin from '../userPage/authenticate/Signin';
import SignupE from '../userPage/authenticate/SignupE';
import VerifyEmail from "../userPage/authenticate/VerifyEmail";
import SignupS from "../userPage/authenticate/SignupS";
import DetailProduct from "../userPage/product/detailProduct";
import ShopDetail from "../userPage/shop/shopDetail";
import Cart from "../userPage/cart/Cart";
import Order from "../userPage/order/Order";
import SellerHome from "../userPage/seller/SellerHome";
import User from "../userPage/user/User";
import ViewAllProduct from "../userPage/ViewAllProduct";
import SigninAdmin from "../adminPage/authenticate/Signin";
import DetailAccount from "../adminPage/component/DetailAccount";
import ListUser from "../adminPage/component/ListUser";
import Categories from "../adminPage/component/Categories";
import ProductAdmin from "../adminPage/component/ProductAdmin";
import OrderAdmin from "../adminPage/component/OrderAdmin";
import ReportAdmin from "../adminPage/component/ReportAdmin";
import Overview from "../adminPage/component/Overview";
import CSKH from "../CSKH";
import NotificationAdmin from "../adminPage/component/NotificationAdmin";
import ResponseAfterPayment from "../userPage/payment/ResponseAfterPayment";
import ResponseAfterDeposit from "../userPage/payment/ResponseAfterDeposit";
import { useEffect, useState } from "react";
import ForgetPassword from "../userPage/authenticate/ForgetPassword";
import {Chat} from "../userPage/chatbot/Chat";
const AppRoutes = () => {
    const [isUser, setIsUser] = useState(false)

    useEffect(() => {


        const userData = JSON.parse(localStorage.getItem("user"));
        setIsUser(!!userData);
    }, []);

    return (
        <Routes>
            {/* Public Routes */}
            <Route path='/' element={<Home />} />
            <Route path='/signin' element={<Signin />} />
            <Route path='/signupS' element={<SignupS />} />
            <Route path='/signupE' element={<SignupE />} />
            <Route path="/forgetPassword" element={<ForgetPassword />} />
            <Route path="/verifyEmail" element={<VerifyEmail />} />
            <Route path="/cskh" element={<CSKH />} />
            <Route path="/product/:id" element={<DetailProduct />} />
            <Route path="/shop/:id" element={<ShopDetail />} />

            <Route path="/cart/" element={<Cart />} />
            <Route path="/order" element={<Order />} />
            <Route path="/seller" element={<SellerHome />} />
            <Route path="/user" element={<User />} />
            <Route path="/user/profile" element={<User view={"profile"} />} />
            <Route path="/user/phone" element={<User view={"phone"} />} />
            <Route path="/user/address" element={<User view={"address"} />} />
            <Route path="/user/pickupAddress" element={<User view={"pickupAddress"} />} />
            <Route path="/user/password" element={<User view={"password"} />} />
            <Route path="/user/wallet" element={<User view={"wallet"} />} />
            <Route path="/user/detailHistory" element={<User view={"detailHistory"} />} />
            <Route path="/user/purchaseOrder" element={<User view={"purchaseOrder"} />} />
            <Route path="/user/detailOrder" element={<User view={"detailOrder"} />} />
            <Route path="/user/notification" element={<User view={"notification"} />} />
            <Route path="/payment-response-info" element={<ResponseAfterPayment />} />
            <Route path="/deposit-response-info" element={<ResponseAfterDeposit />} />

            <Route path="/allProduct" element={<ViewAllProduct />} />

            <Route path="/admin/signin" element={<SigninAdmin />} />


            <Route path="/admin" element={<Overview />} />
            <Route path="/admin/overview" element={<Overview />} />
            <Route path="/admin/accounts" element={<ListUser />} />
            <Route path="/admin/detailAccount" element={<DetailAccount />} />
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/products" element={<ProductAdmin />} />
            <Route path="/admin/orders" element={<OrderAdmin />} />
            <Route path="/admin/reports" element={<ReportAdmin />} />
            <Route path="/admin/notification" element={<NotificationAdmin />} />
            {/* <Route path= "/" element ={<Chat/>}/> */}
        </Routes>
    )
}

export default AppRoutes