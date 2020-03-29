exports = module.exports = {};

exports.convertDate = function(str){
    let months = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12"
    };

    let date = (str+"").split(" ");

    return [date[2], months[date[1]], date[3]].join("/");
};

exports.convertTime = function(str){
    let date = (str+"").split(" ");

    return date[4];
};

exports.formatNumber = function(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
};