import axios from "axios"
import { BASE_URL } from "../constant/constant"

const reloadUser = async (idUser) => {
    try {
        const response = await axios.post(`${BASE_URL}/reloadUser?idUser=${idUser}`)
        localStorage.setItem("user",JSON.stringify(response.data))
        return response.data
    } catch (error) {
        console.log(error);
    }
    return null
}
export default reloadUser