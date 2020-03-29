import axios from "axios";
import history from '../history'
import {
  formatDatePost
} from '../helpers/formatFlighAPI'

// const params = {
//   "ViewMode": "",
//   "Adt": "1",
//   "Chd": "1",
//   "Inf": "1",
//   "ListFlight": [{
//     "StartPoint": "SGN",
//     "EndPoint": "HAN",
//     "DepartDate": "12032020"
//   }]
// }

// const data = {
//   "error": 200,
//   "message": "Successfully",
//   "data": {
//     "FlightType": "domestic",
//     "Session": "DC9919SGNHAN120320111155339",
//     "Itinerary": 1,
//     "ListFareData": [{
//         "FareDataId": 0,
//         "Airline": "VJ",
//         "Itinerary": 1,
//         "Leg": 0,
//         "Promo": true,
//         "Currency": "VND",
//         "System": "LOWCOST",
//         "FareType": "Guest",
//         "Adt": 1,
//         "Chd": 1,
//         "Inf": 1,
//         "FareAdt": 99000,
//         "FareChd": 99000,
//         "FareInf": 0,
//         "TaxAdt": 34900,
//         "TaxChd": 34900,
//         "TaxInf": 10000,
//         "FeeAdt": 370000,
//         "FeeChd": 310000,
//         "FeeInf": 100000,
//         "ServiceFeeAdt": 0,
//         "ServiceFeeChd": 0,
//         "ServiceFeeInf": 0,
//         "TotalNetPrice": 1057800,
//         "TotalServiceFee": 0,
//         "TotalDiscount": 0,
//         "TotalCommission": 0,
//         "TotalPrice": 1057800,
//         "ListFlight": [{
//           "FlightId": 0,
//           "Leg": 0,
//           "Airline": "VJ",
//           "StartPoint": "SGN",
//           "EndPoint": "HAN",
//           "StartDate": "2020-03-12T05:30:00",
//           "EndDate": "2020-03-12T07:35:00",
//           "StartDt": "12032020 05:30:00",
//           "EndDt": "12032020 07:35:00",
//           "FlightNumber": "VJ120",
//           "StopNum": 0,
//           "HasDownStop": false,
//           "Duration": 125,
//           "NoRefund": true,
//           "GroupClass": "Promo",
//           "FareClass": "E_Promo",
//           "FareBasis": null,
//           "Promo": true,
//           "FlightValue": "0E_Promo_VJ120SGNHAN202003120530",
//           "ListSegment": [{
//             "Id": 0,
//             "Airline": "VJ",
//             "MarketingAirline": "VJ",
//             "StartPoint": "SGN",
//             "EndPoint": "HAN",
//             "StartTime": "2020-03-12T05:30:00",
//             "EndTime": "2020-03-12T07:35:00",
//             "StartTm": "12032020 05:30:00",
//             "EndTm": "12032020 07:35:00",
//             "FlightNumber": "VJ120",
//             "Duration": 125,
//             "Class": "E",
//             "Plane": "320",
//             "StartTerminal": "",
//             "EndTerminal": "",
//             "HasStop": false,
//             "StopPoint": "",
//             "StopTime": 0,
//             "DayChange": false,
//             "StopOvernight": false,
//             "ChangeStation": false,
//             "ChangeAirport": false,
//             "LastItem": true,
//             "HandBaggage": "7kg",
//             "AllowanceBaggage": ""
//           }]
//         }]
//       }
//     ],
//     "Status": true,
//     "ErrorCode": "000",
//     "ErrorValue": "",
//     "ErrorField": "",
//     "Message": "OK",
//     "Language": "vi"
//   }
// };

export const submitSearchAction = (dispatch, params) => {
  dispatch({
    type: 'LOADING',
    payload: 'Hệ thống đang thực hiện tìm kiếm'
  });

  dispatch({
    type: 'START_SEARCH',
    payload: params
  });

  let optionAxios = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  return axios.post('https://api.atrip.vn/v1/flights/search', buildSearchParams(params, params.is_return), optionAxios)
    .then((result) => {
      dispatch({
        type: 'LOADING_FINISHED'
      });

      if(result.data.error !== 200){
        dispatch({
          type: 'SEARCH_FAILED',
          payload: result.data.message
        })
      } else {
        dispatch({
          type: 'SEARCH_SUCCESS',
          payload: result.data.data
        })

        history.push('/search/result')
      }
    });
};

const buildSearchParams = (params, is_return) => {
  let searchParams = {
    "ViewMode": "",
    "Adt": params.adt,
    "Chd": params.chd,
    "Inf": params.inf,
    "ListFlight": [{
      "StartPoint": params.startAirport["key"],
      "EndPoint": params.endAirport["key"],
      "DepartDate": formatDatePost(params.startDate)
    }]
  }

  if (is_return) {
    searchParams = {
      "ViewMode": "",
      "Adt": params.adt,
      "Chd": params.chd,
      "Inf": params.inf,
      "ListFlight": [
        {
          "StartPoint": params.startAirport["key"],
          "EndPoint": params.endAirport["key"],
          "DepartDate": formatDatePost(params.startDate)
        },
        {
          "StartPoint": params.endAirport["key"],
          "EndPoint": params.startAirport["key"],
          "DepartDate": formatDatePost(params.endDate)
        }
      ]
    }
  }

  return searchParams;
}
