import moment from "moment";

const formatDate = (isoString) => {
    return moment(isoString).format('YYYY-MM-DD HH:mm');
};

export default formatDate