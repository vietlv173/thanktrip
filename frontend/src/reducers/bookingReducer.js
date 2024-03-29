const initialState = {
  fareData: {
    // "FareDataId": 0,
    // "Airline": "VJ",
    // "Itinerary": 1,
    // "Leg": 0,
    // "Promo": true,
    // "Currency": "VND",
    // "System": "LOWCOST",
    // "FareType": "Guest",
    // "Adt": 3,
    // "Chd": 2,
    // "Inf": 1,
    // "FareAdt": 99000,
    // "FareChd": 99000,
    // "FareInf": 0,
    // "TaxAdt": 34900,
    // "TaxChd": 34900,
    // "TaxInf": 10000,
    // "FeeAdt": 370000,
    // "FeeChd": 310000,
    // "FeeInf": 100000,
    // "ServiceFeeAdt": 0,
    // "ServiceFeeChd": 0,
    // "ServiceFeeInf": 0,
    // "TotalNetPrice": 2509500,
    // "TotalServiceFee": 0,
    // "TotalDiscount": 0,
    // "TotalCommission": 0,
    // "TotalPrice": 2509500,
    // "ListFlight": [{
    //   "FlightId": 0,
    //   "Leg": 0,
    //   "Airline": "VJ",
    //   "StartPoint": "SGN",
    //   "EndPoint": "HAN",
    //   "StartDate": "2020-03-12T05:30:00",
    //   "EndDate": "2020-03-12T07:35:00",
    //   "StartDt": "12032020 05:30:00",
    //   "EndDt": "12032020 07:35:00",
    //   "FlightNumber": "VJ120",
    //   "StopNum": 0,
    //   "HasDownStop": false,
    //   "Duration": 125,
    //   "NoRefund": true,
    //   "GroupClass": "Promo",
    //   "FareClass": "E_Promo",
    //   "FareBasis": null,
    //   "Promo": true,
    //   "FlightValue": "0E_Promo_VJ120SGNHAN202003120530",
    //   "ListSegment": [{
    //     "Id": 0,
    //     "Airline": "VJ",
    //     "MarketingAirline": "VJ",
    //     "StartPoint": "SGN",
    //     "EndPoint": "HAN",
    //     "StartTime": "2020-03-12T05:30:00",
    //     "EndTime": "2020-03-12T07:35:00",
    //     "StartTm": "12032020 05:30:00",
    //     "EndTm": "12032020 07:35:00",
    //     "FlightNumber": "VJ120",
    //     "Duration": 125,
    //     "Class": "E",
    //     "Plane": "320",
    //     "StartTerminal": "",
    //     "EndTerminal": "",
    //     "HasStop": false,
    //     "StopPoint": "",
    //     "StopTime": 0,
    //     "DayChange": false,
    //     "StopOvernight": false,
    //     "ChangeStation": false,
    //     "ChangeAirport": false,
    //     "LastItem": true,
    //     "HandBaggage": "7kg",
    //     "AllowanceBaggage": ""
    //   }]
    // }]
  },
  book_status: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'START_BOOKING':
      return {
        ...state,
        book_status: false,
        fareData: action.payload
      }
    default:
      return state;
  }
};
