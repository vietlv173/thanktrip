/* eslint-disable default-case */
import { airportConst } from "../constants/airport";

export const formatHourMitues = (value) => {
  let date =  new Date(value);

  return date.getHours() + " : " + date.getMinutes();
}

export const formatHMDFlight = (value) => {
  let date = new Date(value);

  return date.getHours() + "h" + date.getMinutes() + " - " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
}

export const intToTime = value => {
  var num = value;
  var hours = (num / 60);
  var rhours = Math.floor(hours);
  var minutes = (hours - rhours) * 60;
  var rminutes = Math.round(minutes);

  return rhours + "h" + rminutes + "m";
}

export const formatDatePost = (date) => {
  let day = ("0" + date.getDate()).slice(-2);
  let month = ("0" + (date.getMonth() + 1)).slice(-2)

  return (day + month + date.getFullYear())
}

export const formatDDMY = (value) => {
  let date = new Date(value);

  let day_name = '';
  let current_day = date.getDay();

  // Lấy tên thứ của ngày hiện tại
  switch (current_day) {
    case 0:
      day_name = "Chủ nhật";
      break;
    case 1:
      day_name = "Thứ hai";
      break;
    case 2:
      day_name = "Thứ ba";
      break;
    case 3:
      day_name = "Thứ tư";
      break;
    case 4:
      day_name = "Thứ năm";
      break;
    case 5:
      day_name = "Thứ sau";
      break;
    case 6:
      day_name = "Thứ bảy";
  }

  return day_name + ", " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
}

export const getAirportCity = value => {
  return airportConst.find(element => element["key"] === value)["airport"]
}
