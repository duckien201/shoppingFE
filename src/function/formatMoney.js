const formatMoney = (number) => {
    return new Intl.NumberFormat('de-DE').format(number);
};

export default formatMoney