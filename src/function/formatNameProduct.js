const formatNameProduct = (str) => {
    if (!str || str.length <= 44) {
        return str;
    }
    return str.substring(0, 37) + "...";
};

export default formatNameProduct