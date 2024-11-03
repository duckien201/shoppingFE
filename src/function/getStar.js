import axios from "axios"
import { BASE_URL } from "../constant/constant"

const getStar = async (idProduct) => {
    try {
        const response = await axios.get(`${BASE_URL}/product/rate/${idProduct}`)
        if (response.data.length === 0) {
            return 0
        } else {
            const totalStar = response.data.reduce((total, rate) => total + rate.star, 0)
            return totalStar / (response.data.length) ? totalStar / (response.data.length) : 0
        }
    } catch (error) {
        console.log(error);
    }
}
export default getStar