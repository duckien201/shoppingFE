// src/api/ApiFunction.js

import axios from "axios";
import { BASE_URL } from "../constant/constant";

// Hàm để lấy danh sách sản phẩm
export const getProduct = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/products`);
        return response.data; // Trả về dữ liệu sản phẩm
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

// Hàm để lấy danh sách danh mục
export const getCategory = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/category`);
        return response.data; // Trả về dữ liệu danh mục
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

export const getShop = async (shopId) => {
    try {
        const response = await axios.get(`${BASE_URL}/shop/${shopId}`);
        return response.data; // Trả về dữ liệu cửa hàng
    } catch (error) {
        console.error(`Error fetching shop with ID ${shopId}:`, error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};