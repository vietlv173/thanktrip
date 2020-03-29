import React, {Component} from 'react'
import {imagesUrl} from '../constants/path'
import { connect } from 'react-redux';
import Dropdown from './Dropdown';
import Slider from './Slider';
import AirportDropDown from './AirportDropDown';
import {
  formatHourMitues,
  formatHMDFlight,
  intToTime,
  getAirportCity
} from '../helpers/formatFlighAPI';
import DatePicker from 'react-datepicker';
import {
  submitSearchAction
} from '../actions/search.action'
import { bookingAction } from '../actions/booking.action';

class SearchResult extends Component {
  constructor(props) {
    super(props);

    this.state = {
      adt: this.props.adt,
      chd: this.props.chd,
      inf: this.props.inf,
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      startAirport: this.props.startAirport,
      endAirport: this.props.endAirport,
      is_return: this.props.is_return,
      isShowBoardCalendar: false
    }
  }

  handleToggle = (e) => {
    const parentToggle = e.target.closest('.js-toggle');
    if (parentToggle.classList.contains('show')) return parentToggle.classList.remove('show')
    parentToggle.classList.add('show')
  }

  onChangeStartPoint(value, airport) {
    if (value === "startPoint") {
      this.setState({
        startAirport: airport
      })
    } else {
      this.setState({
        endAirport: airport
      })
    }
  };

  onChangeCustomer(age, value) {
    switch (age) {
      case 'Adt':
        this.setState({
          adt: value
        });
        break;
      case 'Chd':
        this.setState({
          chd: value
        }); break;
      case 'Inf':
        this.setState({
          inf: value
        }); break;
      default:
        return true;
    }
  };

  onChangeIsReturn(value) {
    if(value === "oneWay") {
      this.setState({
        is_return: false
      })
    } else {
      this.setState({
        is_return: true
      })
    }
  };

onSubmitSearch(e) {
  e.preventDefault();

  let newState = {
    adt: this.state.adt,
    chd: this.state.chd,
    inf: this.state.inf,
    startDate: this.state.startDate,
    endDate: this.state.endDate,
    startAirport: this.state.startAirport,
    endAirport: this.state.endAirport,
    is_return: this.state.is_return
  }

  this.props.submitSearchAction(newState);
};

onSubmitBookingAction = (fare, e) => {
  e.preventDefault();

  this.props.submitBookingAction(fare);
};

onChangeDate = (date, sinceTime) => {
  if (sinceTime === "startDate") {
    this.setState({
      startDate: date
    })
  } else {
    this.setState({
      endDate: date
    })
  }
};
renderListFareData = ((fare, index) =>
  <div className="result-list-item js-toggle" key={index}>
    <div className="airline">
      <div className="logo"><img src={imagesUrl + "logo-jetstar.png"} alt="logo airlines" /></div>
      <div className="number-bought">
        <div className="group-people">
          <div className="img-wrap group-people__item"><img className="img-full-height" src={imagesUrl + "avatar-demo.png"} alt="avatar" /></div>
          <div className="img-wrap group-people__item"><img className="img-full-height" src={imagesUrl + "avatar-demo.png"} alt="avatar" /></div>
          <div className="img-wrap group-people__item"><img className="img-full-height" src={imagesUrl + "avatar-demo.png"} alt="avatar" /></div>
          <span className="plus">
          +4</span><span>đã mua</span>
        </div>
      </div>
      <p className="detail js-toggle-control" onClick={(e) => this.handleToggle(e)} data-target=".toggle-content">
        <span>Chi tiết chuyến bay</span>
        <svg xmlns="http://www.w3.org/2000/svg" width={13} height={7} viewBox="0 0 13 7">
          <g>
            <g>
              <g>
                <path fill="#919191" d="M12.133.23a.742.742 0 0 0-.544-.23H.773c-.21 0-.39.077-.544.23A.743.743 0 0 0 0 .772c0 .21.076.39.23.543l5.408 5.408c.153.153.334.23.543.23.21 0 .39-.077.543-.23l5.409-5.408a.743.743 0 0 0 .229-.543c0-.21-.077-.39-.23-.544z" />
              </g>
            </g>
          </g>
        </svg>
      </p>
    </div>
    <div className="time">
      <div className="time__from">
        <p className="time__address">{this.state.startAirport["airport"]}</p>
        <p className="time__content">{formatHourMitues(fare.ListFlight[0].StartDate)}</p>
      </div>
      <div className="time__to">
        <p className="time__address">{this.state.endAirport["airport"]}</p>
        <p className="time__content">{formatHourMitues(fare.ListFlight[0].EndDate)}</p>
      </div>
    </div>
    <div className="price">
      <div className="price__per-people"><span className="price__number">{(parseInt(fare.TotalPrice)/(parseInt(this.state.adt) + parseInt(this.state.chd) + parseInt(this.state.inf))).toLocaleString()}</span><span className="price__unit">/khách</span></div>
      <a className="price__btn btn btn--bg-linear btn--medium" href="# " onClick={this.onSubmitBookingAction.bind(this, fare)}>
        Chọn mua
        <svg xmlns="http://www.w3.org/2000/svg" width={8} height={13} viewBox="0 0 8 13">
          <g>
            <g>
              <path fill="#fff" d="M7.042 7.045l-5.153 5.152a.839.839 0 1 1-1.186-1.186l4.559-4.56-4.56-4.558A.84.84 0 0 1 1.89.707l5.152 5.152a.836.836 0 0 1 0 1.186z" />
            </g>
          </g>
        </svg>
      </a>
    </div>
    <div className="js-toggle-content">
      <div className="flight-detail">
        <div className="flight-detail__top">
          <div className="flight-detail__location text-right pr-3">
            <p className="text-smaller font-weight-bold mbpx-5 text-black">{getAirportCity(fare.ListFlight[0].StartPoint)}</p>
            <p className="text-xs font-weight-light mbpx-3">Sân bay ..</p>
            <p className="text-xs font-weight-medium text-orange-medium">{formatHMDFlight(fare.ListFlight[0]["StartDate"])}</p>
          </div>
          <div className="flight-detail__serial">
            <div className="serial w-100"><span className="text-xs font-weight-light">Chuyến bay&nbsp;</span><span className="text-smaller font-weight-bold text-black">{fare.ListFlight[0]["FlightNumber"]}</span></div>
            <div className="d-flex justify-content-center w-100">
              <svg xmlns="http://www.w3.org/2000/svg" width={159} height={18} viewBox="0 0 159 18">
                <defs>
                  <clipPath id="tvrsa">
                    <path fill="#fff" d="M0 16V1h15v15zm7.5-4a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                  </clipPath>
                </defs>
                <g>
                  <g>
                    <g>
                      <path fill="#ff5111" d="M137.292 8.664c-.017-.248.244-.494.679-.644l-.656-3.052c.396 0 .72.071 1.09.357l2.438 1.869c.182.143.354.288.53.408.594-.12 2.23-.294 3.077-.41l2.249-.302-3.303-6.116c-.343-.637 1.673-.801 2-.236l6.044 6.37 3.117.012c2.436.011 4.645 1.09 4.648 1.831.001.744-2.197 1.803-4.634 1.795l-3.116-.012-5.995 6.319c-.321.564-2.337.382-1.997-.25l3.25-6.09-2.251-.32c-.846-.121-2.486-.309-3.082-.432-.177.117-.345.26-.527.4l-2.42 1.852c-.37.282-.693.35-1.088.347l.633-3.049c-.437-.152-.701-.4-.686-.647z" />
                    </g>
                    <g>
                      <path fill="none" stroke="#ff5111" strokeMiterlimit={50} strokeWidth={2} d="M10.273 8.718h138.809" />
                    </g>
                    <g>
                      <path fill="#fff" d="M4 8.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                      <path fill="none" stroke="#ff5111" strokeMiterlimit={50} strokeWidth={8} d="M4 8.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" clipPath="url(&quot;#tvrsa&quot;)" />
                    </g>
                  </g>
                </g>
              </svg>
            </div>
            <div className="text-center w-100 line-height-1"><span className="text-tiny font-weight-light">Bay thẳng&nbsp;</span><span className="text-xs font-weight-bold text-black">{intToTime(fare.ListFlight[0]["Duration"])}</span></div>
          </div>
          <div className="flight-detail__location text-left pl-3">
            <p className="text-smaller font-weight-bold mbpx-5 text-black">{getAirportCity(fare.ListFlight[0].EndPoint)}</p>
            <p className="text-xs font-weight-light mbpx-3">Sân bay ..</p>
            <p className="text-xs font-weight-medium text-orange-medium">{formatHMDFlight(fare.ListFlight[0]["EndDate"])}</p>
          </div>
        </div>
        <div className="flight-detail__note">
          <p className="text-xs font-weight-bold mbpx-3">Điều kiện vé &amp; hành lý</p>
          <p className="text-xs font-weight-bold mbpx-3">Điều kiện vé Hạng chỗ Promo - {fare.Airline}</p>
          <p className="text-xs"><span className="font-weight-bold">Vé Promo</span><span className="font-weight-light">&nbsp;:&nbsp;</span><span className="font-weight-light">Giá chưa bao gồm thuế phí</span></p>
        </div>
        <div className="flight-detail__passenger">
          <div className="flight-detail__passenger-wrap">
            <div className="w-25 text-left">
              <p className="mbpx-5 text-xs font-weight-bold">Hành khách</p>
              <p className="text-xs font-weight-light">Người lớn</p>
              <p className="text-xs font-weight-light">Trẻ em từ 2 đến 11 tuổi</p>
              <p className="text-xs font-weight-light">Trẻ em dưới 2 tuổi</p>
            </div>
            <div className="w-25 text-left">
              <p className="mbpx-5 text-xs font-weight-bold">Số lượng</p>
              <p className="text-xs font-weight-lighttext-xs">{fare.Adt}</p>
              <p className="text-xs font-weight-lighttext-xs">{fare.Chd}</p>
              <p className="text-xs font-weight-lighttext-xs">{fare.Inf}</p>
            </div>
            <div className="w-25 text-right">
              <p className="mb-2 text-xs font-weight-bold">Giá gồm thuế phí</p>
              <p className="text-xs font-weight-bold"><span className="text-red-orange">{(parseInt(fare.FareAdt) + parseInt(fare.TaxAdt) + parseInt(fare.FeeAdt)).toLocaleString()}</span><span>&nbsp;VND</span></p>
              <p className="text-xs font-weight-bold"><span className="text-red-orange">{(parseInt(fare.FareChd) + parseInt(fare.TaxChd) + parseInt(fare.FeeChd)).toLocaleString()}</span><span>&nbsp;VND</span></p>
              <p className="text-xs font-weight-bold"><span className="text-red-orange">{(parseInt(fare.FareInf) + parseInt(fare.TaxInf) + parseInt(fare.FeeInf)).toLocaleString()}</span><span>&nbsp;VND</span></p>
            </div>
            <div className="w-25 text-right">
              <p className="mb-2 text-xs font-weight-bold">Tổng giá</p>
              <p className="text-xs font-weight-bold"><span className="text-red-orange">{fare.TotalNetPrice.toLocaleString()}</span><span>&nbsp;VND</span></p>
            </div>
          </div>
        </div>
        <div className="flight-detail__total font-weight-bold">
          <p className="text-green text-uppercase text-xs">Tổng chi phí:&nbsp;</p>
          <p className="font-weight-bold"><span className="text-orange">{fare.TotalPrice.toLocaleString()}</span><span className="text-xs">&nbsp;VND</span></p>
        </div>
      </div>
      <div className="result-list-item__share">
        <p className="info">Chia sẻ link mời bạn bè và nhận&nbsp;<a className="preference link" href="# ">nhiều ưu đãi</a>&nbsp;tuyệt vời từ ThankTrip</p>
        <a className="btn-share js-toggle-modal" href="# " data-target="#modal-share-tour">
          <svg xmlns="http://www.w3.org/2000/svg" width={18} height={16} viewBox="0 0 18 16">
            <g>
              <g>
                <path fill="#ff6200" d="M17.824 5.274L12.75.2a.61.61 0 0 0-.446-.189.61.61 0 0 0-.445.189.61.61 0 0 0-.189.445v2.537H9.45c-4.71 0-7.6 1.331-8.67 3.993-.35.885-.525 1.985-.525 3.3 0 1.096.42 2.586 1.259 4.469a23.402 23.402 0 0 0 .237.535c.04.085.083.158.13.217.079.113.171.17.277.17a.29.29 0 0 0 .233-.1.37.37 0 0 0 .084-.247c0-.06-.008-.147-.025-.263a2.05 2.05 0 0 1-.025-.233c-.033-.449-.05-.856-.05-1.219 0-.667.059-1.265.174-1.793.116-.529.276-.986.48-1.372.206-.387.47-.72.793-1.001.324-.28.672-.51 1.046-.689a5.667 5.667 0 0 1 1.318-.42 12.565 12.565 0 0 1 1.526-.214c.512-.04 1.091-.06 1.739-.06h2.22v2.537c0 .172.062.32.187.446a.61.61 0 0 0 .446.188.61.61 0 0 0 .446-.188l5.073-5.073a.61.61 0 0 0 .189-.446.61.61 0 0 0-.188-.446z" />
              </g>
            </g>
          </svg>
          <span>Share link</span>
        </a>
      </div>
    </div>
  </div>
);

render() {
  const airPortFulName = (airport) => {
    return airport["airport"] + ", " + airport["country"] + "(" + airport["key"] + ")"
  };
  const customerValues = [
    {
      value: 0,
      label: '0 hành khách'
    }, {
      value: 1,
      label: '1 hành khách'
    }, {
      value: 2,
      label: '2 hành khách'
    }, {
      value: 3,
      label: '3 hành khách'
    }, {
      value: 4,
      label: '4 hành khách'
    }, {
      value: 5,
      label: '5 hành khách'
    }, {
      value: 6,
      label: '6 hành khách'
    }, {
      value: 7,
      label: '7 hành khách'
    }
  ];

  let isShowReturn = this.state.is_return ? "" : "hidden";

  var sliderItems = {
    active: 7,
    list: [
      {
        date: 'T2,01/9/2020',
        price: '1.000.000đ'
      },
      {
        date: 'T3,02/9/2020',
        price: '1.000.000đ'
      },
      {
        date: 'T4,03/9/2020',
        price: '1.000.000đ'
      },
      {
        date: 'T5,04/9/2020',
        price: '1.000.000đ'
      },
      {
        date: 'T6,05/9/2020',
        price: '1.000.000đ'
      },
      {
        date: 'T7,06/9/2020',
        price: '1.000.000đ'
      },
      {
        date: 'CN,07/9/2020',
        price: '1.000.000đ'
      },
      {
        date: 'T2,08/9/2020',
        price: '1.000.000đ'
      },
      {
        date: 'T3,09/9/2020',
        price: '1.000.000đ'
      },
      {
        date: 'T4,10/9/2020',
        price: '1.000.000đ'
      },
      {
        date: 'T5,11/9/2020',
        price: '1.000.000đ'
      },
      {
        date: 'T6,12/9/2020',
        price: '1.000.000đ'
      },
      {
        date: 'T7,13/9/2020',
        price: '1.000.000đ'
      },
      {
        date: 'T2,14/9/2020',
        price: '1.000.000đ'
      }
    ]
  };

  const boardCalendar = [];
  for (let i = 0; i < 35; i++) {
    if (i === 0 || (i >= 32)) {
      boardCalendar.push(
        <div className="board-calendar__item">
        </div>
      )
    } else if (i === 21 - 7) { //select day above day.active
      boardCalendar.push(
        <div className="board-calendar__item border-bottom-none">
          <p className="date">{i}</p>
          <p className="price">900.000đ</p>
        </div>
      )
    } else if (i === 21) {
      boardCalendar.push(
        <div className="board-calendar__item active">
          <p className="date">{i}</p>
          <p className="price">900.000đ</p>
        </div>
      )
    } else {
      boardCalendar.push(
        <div className="board-calendar__item">
          <p className="date">{i}</p>
          <p className="price">900.000đ</p>
        </div>
      )
    }
  }

  return (
    <main className="main main--phone-756">
      <div className="banner bg-img-base"
        data-src={imagesUrl + "bg-banner.png" }
        data-type="background-image"
        style={{
          backgroundImage: `url(${imagesUrl + "bg-banner.png"})`
        }}
      >
        <div className="d-flex align-items-center h-100">
          <div className="container">
            <div className="banner__content">
              <h1 className="title">Thank Flight</h1>
              <p className="slogan">Bay muôn nơi - thảnh thơi không lo giá vé…!</p>
            </div>
          </div>
        </div>
      </div>
      <div className="search">
        <div className="container container-custom">
          <div className="row-custom">
            <div className="col-lg-8 col-12 col-custom">
              <div className="result-board">
                <div className="result-board__title">
                  <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 13 13">
                    <g>
                      <g>
                        <path fill="#818181" d="M1.811 11.19c-.13-.116-.123-.368.017-.658L0 9.34c.195-.197.39-.322.713-.364l2.124-.283c.16-.02.317-.033.463-.061.233-.355.955-1.254 1.315-1.733l.96-1.268L.932 4.232c-.484-.146.43-1.23.87-1.111l6.121.161L9.465 1.74c1.208-1.205 2.83-1.767 3.196-1.4.367.369-.195 1.988-1.4 3.196L9.718 5.078l.16 6.121c.12.44-.964 1.352-1.108.869l-1.4-4.643-1.27.96c-.476.36-1.377 1.082-1.732 1.317-.03.146-.041.3-.062.46l-.28 2.125A1.132 1.132 0 0 1 3.66 13L2.47 11.17c-.29.14-.543.15-.658.02z" />
                      </g>
                    </g>
                  </svg>
                  <p>
                    <span className="text-start">Khởi hành từ</span>
                    <span className="from">{airPortFulName(this.state.startAirport)}</span>
                    <span className="text-to">đến</span>
                    <span className="to">{airPortFulName(this.state.endAirport)}</span>
                  </p>
                </div>
                <div className="result-board__border"></div>
                <div className="result-board__calendar">
                  <div className="result-board__calendar-bg-white"></div>
                  <div className="result-board__calendar-wrap">
                    <Slider
                      list={sliderItems}
                      display={{
                        default: 5,
                        desktop: 3,
                        phone: 1
                      }}
                    />
                  </div>
                  <div className="result-board__calendar-bg-white"></div>
                </div>
              </div>
              <div className={"board-calendar__control mt-2" + (this.state.isShowBoardCalendar ? " hide" : "")}>
                <img src="/assests/images/icon-slide.png" onClick={() => this.setState({isShowBoardCalendar: true})} />
              </div>
              <div className={"board-calendar" + (this.state.isShowBoardCalendar ? " show" : "")}>
                <div className="board-calendar__wrap">
                  <div className="board-calendar__wrap-content">
                    <div className="board-calendar__day-of-the-week">
                      <p>CN</p><p>T.2</p><p>T.3</p><p>T.4</p><p>T.5</p><p>T.6</p><p>T.7</p>
                    </div>
                    <div className="board-calendar__content">
                      { boardCalendar.map(item => item) }
                    </div>
                  </div>
                </div>
                <div className="board-calendar__control">
                  <img src="/assests/images/icon-slide.png" onClick={() => this.setState({isShowBoardCalendar: false})} />
                </div>
              </div>
              <h2 className="change-info-search js-change-info-search">
                <span>Thay đổi thông tin tìm kiếm</span>
                <svg xmlns="http://www.w3.org/2000/svg" width={8} height={13} viewBox="0 0 8 13">
                  <g>
                    <g>
                      <path fill="#fff" d="M7.042 7.045l-5.153 5.152a.839.839 0 1 1-1.186-1.186l4.559-4.56-4.56-4.558A.84.84 0 0 1 1.89.707l5.152 5.152a.836.836 0 0 1 0 1.186z" />
                    </g>
                  </g>
                </svg>
              </h2>
              <div className="result-list">
                <div className="result-list__filter">
                    <div className="d-flex">
                      <div className="airline js-dropdown dropdown">
                        <p className="dropdown__title js-control-show-dropdown">
                          Hãng hàng không
                          <svg xmlns="http://www.w3.org/2000/svg" width={13} height={7} viewBox="0 0 13 7">
                            <g>
                              <g>
                                <g>
                                  <path fill="#919191" d="M12.133.23a.742.742 0 0 0-.544-.23H.773c-.21 0-.39.077-.544.23A.743.743 0 0 0 0 .772c0 .21.076.39.23.543l5.408 5.408c.153.153.334.23.543.23.21 0 .39-.077.543-.23l5.409-5.408a.743.743 0 0 0 .229-.543c0-.21-.077-.39-.23-.544z" />
                                </g>
                              </g>
                            </g>
                          </svg>
                        </p>
                        <ul className="dropdown__list">
                          <li className="dropdown__intro">
                            <p>
                              Vui lòng chọn
                              <span className="js-control-show-dropdown">
                                <svg xmlns="http://www.w3.org/2000/svg" width={12} height={8} viewBox="0 0 12 8">
                                  <g>
                                    <g>
                                      <g>
                                        <path fill="#a4afb7" d="M6.027.301l-5.5 5.56L1.953 7.3l4.074-4.117L10.1 7.3l1.426-1.44z" />
                                      </g>
                                    </g>
                                  </g>
                                </svg>
                              </span>
                            </p>
                          </li>
                          <li className="dropdown__item">
                            <div className="checkbox">
                              <input id="vnal" name="airline" type="checkbox" />
                              <label className="title" htmlFor="vnal">Vietnam Airlines</label>
                            </div>
                          </li>
                          <li className="dropdown__item">
                            <div className="checkbox">
                              <input id="jetstar" name="airline" type="checkbox" />
                              <label className="title" htmlFor="jetstar">JetStar</label>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="filter js-dropdown dropdown">
                        <p className="dropdown__title js-control-show-dropdown">
                          Sắp xếp
                          <svg xmlns="http://www.w3.org/2000/svg" width={13} height={7} viewBox="0 0 13 7">
                            <g>
                              <g>
                                <g>
                                  <path fill="#919191" d="M12.133.23a.742.742 0 0 0-.544-.23H.773c-.21 0-.39.077-.544.23A.743.743 0 0 0 0 .772c0 .21.076.39.23.543l5.408 5.408c.153.153.334.23.543.23.21 0 .39-.077.543-.23l5.409-5.408a.743.743 0 0 0 .229-.543c0-.21-.077-.39-.23-.544z" />
                                </g>
                              </g>
                            </g>
                          </svg>
                        </p>
                        <ul className="dropdown__list">
                          <li className="dropdown__intro">
                            <p>
                              Vui lòng chọn
                              <span className="js-control-show-dropdown">
                                <svg xmlns="http://www.w3.org/2000/svg" width={12} height={8} viewBox="0 0 12 8">
                                  <g>
                                    <g>
                                      <g>
                                        <path fill="#a4afb7" d="M6.027.301l-5.5 5.56L1.953 7.3l4.074-4.117L10.1 7.3l1.426-1.44z" />
                                      </g>
                                    </g>
                                  </g>
                                </svg>
                              </span>
                            </p>
                          </li>
                          <li className="dropdown__item"><a className="active" href="#">Thời gian</a></li>
                          <li className="dropdown__item"><a href="#">Giá từ cao đến thấp</a></li>
                          <li className="dropdown__item"><a href="#">Giá từ thấp đến cao</a></li>
                        </ul>
                      </div>
                    </div>
                    <div className="price js-dropdown dropdown">
                      <p className="dropdown__title js-control-show-dropdown">
                        Giá hiển thị
                        <svg xmlns="http://www.w3.org/2000/svg" width={13} height={7} viewBox="0 0 13 7">
                          <g>
                            <g>
                              <g>
                                <path fill="#919191" d="M12.133.23a.742.742 0 0 0-.544-.23H.773c-.21 0-.39.077-.544.23A.743.743 0 0 0 0 .772c0 .21.076.39.23.543l5.408 5.408c.153.153.334.23.543.23.21 0 .39-.077.543-.23l5.409-5.408a.743.743 0 0 0 .229-.543c0-.21-.077-.39-.23-.544z" />
                              </g>
                            </g>
                          </g>
                        </svg>
                      </p>
                      <ul className="dropdown__list right-0">
                        <li className="dropdown__intro">
                          <p>
                            Vui lòng chọn
                            <span className="js-control-show-dropdown">
                              <svg xmlns="http://www.w3.org/2000/svg" width={12} height={8} viewBox="0 0 12 8">
                                <g>
                                  <g>
                                    <g>
                                      <path fill="#a4afb7" d="M6.027.301l-5.5 5.56L1.953 7.3l4.074-4.117L10.1 7.3l1.426-1.44z" />
                                    </g>
                                  </g>
                                </g>
                              </svg>
                            </span>
                          </p>
                        </li>
                        <li className="dropdown__item"><a className="active" href="#">Giá bao gồm thuế phí</a></li>
                        <li className="dropdown__item"><a href="#">Giá chưa bao gồm thuế phí</a></li>
                      </ul>
                    </div>
                  </div>
                <div className="result-list__content">
                  {
                    this.props.listFareData.map(this.renderListFareData)
                  }
                </div>
              </div>
              </div>
            <div className="col-lg-4 col-12 col-custom">

            <div className="form-search">
              <form>
                <h2 className="form-search__title"><span>Thay đổi tìm kiếm</span></h2>
                <div className="form-search__content">
                  <div className="form-search__radio form-group-radio">
                    <p>
                      <input type="radio" id="motChieu" name="radio-group" defaultChecked />
                      <label htmlFor="motChieu" onClick={this.onChangeIsReturn.bind(this, "oneWay")}>Một chiều</label>
                    </p>
                    <p>
                      <input type="radio" id="khuHoi" name="radio-group" />
                      <label htmlFor="khuHoi" onClick={this.onChangeIsReturn.bind(this, "return")}>Khứ hồi</label>
                    </p>
                  </div>

                  <div className="forms-group">
                    <div className="form-group">
                      <label className="form-title">Ngày khởi hành</label>
                      <DatePicker
                        selected={this.state.startDate}
                        onChange={(value) => this.onChangeDate(value, "startDate")}
                        className = "form-control form-control-datepicker"
                        dateFormat = "dd/MM/yyyy"
                      />
                    </div>
                    <div className={isShowReturn + " form-group"}>
                      <label className="form-title">Ngày về</label>
                      <DatePicker
                        selected={this.state.endDate}
                        onChange={(value) => this.onChangeDate(value, "endDate")}
                        className = "form-control form-control-datepicker"
                        dateFormat = "dd/MM/yyyy"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-title">Điểm khởi hành</label>
                      <AirportDropDown
                        onChangeStartPoint={this.onChangeStartPoint.bind(this, "startPoint")}
                        airport={this.state.startAirport}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-title">Điểm đến</label>
                      <AirportDropDown
                        onChangeStartPoint={this.onChangeStartPoint.bind(this, "endPoint")}
                        airport={this.state.endAirport}
                      />
                    </div>
                    <Dropdown formTitle='Người lớn' list={customerValues}
                      onChangeCustomer={this.onChangeCustomer.bind(this, "Adt")}
                      value={this.state.adt}
                    />
                    <Dropdown formTitle='Người lớnTrẻ em 2 - 11 tuổi' list={customerValues}
                      onChangeCustomer={this.onChangeCustomer.bind(this, "Chd")}
                      value={this.state.chd}
                    />
                    <Dropdown formTitle='Trẻ em <2 tuổi' list={customerValues}
                      onChangeCustomer={this.onChangeCustomer.bind(this, "Inf")}
                      value={this.state.inf}
                    />
                  </div>
                    <input className="btn form-search__btn-submit"
                      type="submit"
                      value="Tìm kiếm"
                      onClick={this.onSubmitSearch.bind(this)}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )}
}

const mapStateToProps = (state) => ({
  adt: state.search.adt,
  chd: state.search.chd,
  inf: state.search.inf,
  startAirport: state.search.startAirport,
  endAirport: state.search.endAirport,
  startDate: state.search.startDate,
  endDate: state.search.endDate,
  is_return: state.search.is_return,
  error_message: state.search.error_message,
  listFareData: state.search.listFareData
});

const mapDispatchToProps = (dispatch) => {
  return {
    submitSearchAction: (searchParams) => submitSearchAction(dispatch, searchParams),
    submitBookingAction: (fare) => bookingAction(dispatch, fare)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResult);
