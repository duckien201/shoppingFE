import moment from "moment";

const formatDate = (isoString) => {
    return moment(isoString).format('YYYY-MM-DD');
};

export default formatDate