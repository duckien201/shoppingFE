import axios from "axios";

const uploadImg = async (files) => {
    if (files) {
        const CLOUD_NAME = "dcicp94vu";
        const PRESET_NAME = "dukinshop";
        const urlImage = [];
        const FOLDER_NAME = "dukinshop";
        const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

        // Ensure files is an array, even if it's a single file
        const filesArray = Array.isArray(files) ? files : [files];

        for (const file of filesArray) {
            const formData = new FormData();
            formData.append("upload_preset", PRESET_NAME);
            formData.append("folder", FOLDER_NAME);
            formData.append("file", file);

            const response = await axios.post(api, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            urlImage.push(response.data.url);
        }
        return urlImage;
    }
    return null;
};

export default uploadImg;