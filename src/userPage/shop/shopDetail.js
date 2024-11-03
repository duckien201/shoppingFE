import { useParams } from "react-router-dom"
import Header from "../Header"
import ShopInfo from "./ShopInfo"
import { useEffect, useState } from "react"
import axios from "axios"
import Footer from "../Footer"
import AllProduct from "./allProduct"
import { BASE_URL } from "../../constant/constant"

const ShopDetail = () => {
    const { id } = useParams()
    const [allProduct,setAllProduct]=useState()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const shopApi=await axios.get(`${BASE_URL}/shop/${id}`)
                setAllProduct(shopApi.data.products)
                console.log(shopApi.data.products);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData()
    }, [id])

    return (
        <div>
            <Header />
            <ShopInfo idShop={id}/>
            <br/>
            <AllProduct allProduct={allProduct} status={"ok"}/>
            <Footer/>
        </div>
    )
}
export default ShopDetail