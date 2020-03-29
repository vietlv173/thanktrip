import React, {
	Component
} from 'react'
import {imagesUrl} from '../constants/path'
import {
	connect
} from 'react-redux';
import {
	formatHourMitues,
	intToTime,
	getAirportCity,
	formatDDMY
} from '../helpers/formatFlighAPI';
import { airportConst } from '../constants/airport';
import LuggageDropdown from './LuggageDropdown';
class Booking extends Component {
	constructor(props) {
		super(props);

		this.state = {
			fare: this.props.fare,
			luggage: 0,
			luggage_money: 0,
			is_return: this.props.is_return
		}
	}

	onSelectLuggage(item) {
		this.setState({
			luggage: item.value,
			luggage_money: item.price
		})
	}

	render() {
		let fare = this.state.fare;
		let flight = fare.ListFlight;
		let totalPrice = parseInt(fare.TotalPrice) + parseInt(this.state.luggage_money);
		let totalCustomer = parseInt(fare.Adt) + parseInt(fare.Chd) + parseInt(fare.Inf);

    return (
			<main className="main main--phone-821">
				<div className="step">
				<div className="step__wrap">
				<div className="step__item active current">
					<div className="step__number">1</div>
					<span className="step__title">Đặt chỗ</span>
				</div>
				<div className="step__wire">
				<div className="step__wire-line" />
				</div>
				<div className="step__item">
					<div className="step__number">2</div>
					<span className="step__title">Thanh toán</span>
				</div>
				<div className="step__wire">
					<div className="step__wire-line" />
					</div>
					<div className="step__item">
						<div className="step__number">3</div>
						<span className="step__title">Chờ xử lý</span>
					</div>
					<div className="step__wire">
						<div className="step__wire-line" />
						</div>
						<div className="step__item">
							<div className="step__number">4</div>
							<span className="step__title">Phát hành vé điện tử</span>
						</div>
						<svg className="step__tree1 gray active" xmlns="http://www.w3.org/2000/svg" width={38} height={42} viewBox="0 0 38 42">
							<defs>
								<linearGradient id="h65ja" x1="19.13" x2="19.13" y1=".2" y2="41.86" gradientUnits="userSpaceOnUse">
									<stop offset={0} stopColor="#919191" />
									<stop offset={1} stopColor="#919191" />
								</linearGradient>
							</defs>
							<g>
								<g>
									<path fill="url(#h65ja)" d="M20.583 29.346c-1.437.399-.577-2.577-.165-4.3.298-.11.586-.24.86-.396a6.08 6.08 0 0 0 1.519 3.285c-.7.622-1.506 1.214-2.214 1.41zm-2.64-1.224c-.62.113-1.678-1.8-2.43-3.355.833.425 1.773.67 2.772.67.257 0 .509-.022.757-.053-.193 1.245-.533 2.635-1.098 2.738zm-4.488-1.553a6.141 6.141 0 0 0 1.216-1.621l1.2 2.514s-.654.289-2.416-.893zm22.818-14.032c0-3.16-2.399-5.76-5.475-6.08a6.11 6.11 0 0 0-5.728-3.991 6.074 6.074 0 0 0-3.143.877A6.109 6.109 0 0 0 16.59.204a6.11 6.11 0 0 0-6.03 5.14c-.248-.03-.499-.05-.755-.05a6.114 6.114 0 0 0-6.114 6.113c0 .165.012.327.025.49a6.103 6.103 0 0 0-.573 9.921c-.006.11-.017.22-.017.331a6.114 6.114 0 0 0 6.114 6.114c1.012 0 1.964-.25 2.804-.684 1.165.836 2.832 1.882 3.64 1.674 0 0 .3 4.653.235 5.834-.123 2.248-.798 4.75-1.272 6.776h7.35s-1.083-4.515-1.13-6.022c-.048-1.508.47-4.284.47-4.284l2.55-2.638a6.074 6.074 0 0 0 3.446 1.053 6.12 6.12 0 0 0 6.08-5.481 6.118 6.118 0 0 0 3.992-5.734 6.084 6.084 0 0 0-1.537-4.044 6.093 6.093 0 0 0 .406-2.176z" />
								</g>
							</g>
						</svg>
						<svg className="step__tree1 orange" xmlns="http://www.w3.org/2000/svg" width={38} height={42} viewBox="0 0 38 42">
							<defs>
								<linearGradient id="h66ja" x1="19.13" x2="19.13" y1=".2" y2="41.86" gradientUnits="userSpaceOnUse">
									<stop offset={0} stopColor="#ffa700" />
									<stop offset={1} stopColor="#ef5e03" />
								</linearGradient>
							</defs>
							<g>
								<g>
									<path fill="url(#h66ja)" d="M20.583 29.346c-1.437.399-.577-2.577-.165-4.3.298-.11.586-.24.86-.396a6.08 6.08 0 0 0 1.519 3.285c-.7.622-1.506 1.214-2.214 1.41zm-2.64-1.224c-.62.113-1.678-1.8-2.43-3.355.833.425 1.773.67 2.772.67.257 0 .509-.022.757-.053-.193 1.245-.533 2.635-1.098 2.738zm-4.488-1.553a6.141 6.141 0 0 0 1.216-1.621l1.2 2.514s-.654.289-2.416-.893zm22.818-14.032c0-3.16-2.399-5.76-5.475-6.08a6.11 6.11 0 0 0-5.728-3.991 6.074 6.074 0 0 0-3.143.877A6.109 6.109 0 0 0 16.59.204a6.11 6.11 0 0 0-6.03 5.14c-.248-.03-.499-.05-.755-.05a6.114 6.114 0 0 0-6.114 6.113c0 .165.012.327.025.49a6.103 6.103 0 0 0-.573 9.921c-.006.11-.017.22-.017.331a6.114 6.114 0 0 0 6.114 6.114c1.012 0 1.964-.25 2.804-.684 1.165.836 2.832 1.882 3.64 1.674 0 0 .3 4.653.235 5.834-.123 2.248-.798 4.75-1.272 6.776h7.35s-1.083-4.515-1.13-6.022c-.048-1.508.47-4.284.47-4.284l2.55-2.638a6.074 6.074 0 0 0 3.446 1.053 6.12 6.12 0 0 0 6.08-5.481 6.118 6.118 0 0 0 3.992-5.734 6.084 6.084 0 0 0-1.537-4.044 6.093 6.093 0 0 0 .406-2.176z" />
								</g>
							</g>
						</svg>
						<svg className="step__tree2 gray active" xmlns="http://www.w3.org/2000/svg" width={25} height={35} viewBox="0 0 25 35">
							<g>
								<g>
									<g>
										<path fill="#919191" d="M22.577 12.58a6.273 6.273 0 0 0 1.175-3.657 6.309 6.309 0 0 0-6.308-6.309c-.052 0-.102.007-.153.008a6.025 6.025 0 0 0-5.059-2.75A6.032 6.032 0 0 0 6.72 3.456C2.95 4.442.163 7.861.163 11.94c0 2.243.848 4.282 2.232 5.834a7.68 7.68 0 0 0 7.642 8.43c.463 0 2.304-.042 2.744-.12l.185-1.902a7.68 7.68 0 0 0 9.61-11.602z" />
									</g>
									<g>
										<path fill="#919191" d="M12.78 23.316c-.88.228-1.854.22-2.896-.272-1.41-.666-2.433-2.02-2.572-3.575a4.387 4.387 0 0 1 .192-1.738.543.543 0 0 0-.192-.58A6.014 6.014 0 0 1 5.1 12.489a6.028 6.028 0 0 1 3.536-5.487.552.552 0 0 0 .333-.553 5.392 5.392 0 0 1-.029-.544 6.032 6.032 0 0 1 4.657-5.87 6.017 6.017 0 0 0-1.365-.164A6.032 6.032 0 0 0 6.72 3.457C2.95 4.442.163 7.861.163 11.94c0 2.243.848 4.282 2.232 5.834a7.68 7.68 0 0 0 7.642 8.43c.463 0 2.304-.042 2.743-.12V23.316z" />
									</g>
									<g>
										<path fill="#919191" d="M11.683 23.46l-.052-.002-.496 10.425h3.291l-.485-10.2c-.018-.366-.384-.63-.726-.5-.477.178-.992.277-1.532.277z" />
									</g>
									<g>
										<path fill="#919191" d="M13.94 23.682c-.017-.365-.383-.629-.725-.5-.477.18-.992.278-1.532.278l-.052-.002-.496 10.426h1.646v-8.931c0-.236.15-.446.375-.52l.807-.27z" />
									</g>
									<g>
										<path fill="#919191" d="M15.524 34.432h-5.486a.548.548 0 1 1 0-1.097h5.486a.548.548 0 1 1 0 1.097z" />
									</g>
								</g>
							</g>
						</svg>
						<svg className="step__tree2 orange" xmlns="http://www.w3.org/2000/svg" width={25} height={35} viewBox="0 0 25 35">
							<defs>
								<linearGradient id="al19a" x1="12.24" x2="12.24" y1="-.13" y2="26.2" gradientUnits="userSpaceOnUse">
									<stop offset={0} stopColor="#ffe200" />
									<stop offset={1} stopColor="#ff6200" />
								</linearGradient>
								<linearGradient id="al19b" x1="6.89" x2="6.89" y1="-.13" y2="26.2" gradientUnits="userSpaceOnUse">
									<stop offset={0} stopColor="#ffe200" />
									<stop offset={1} stopColor="#ff6200" />
								</linearGradient>
								<linearGradient id="al19c" x1="12.79" x2="12.79" y1="23.15" y2="33.88" gradientUnits="userSpaceOnUse">
									<stop offset={0} stopColor="#ffe200" />
									<stop offset={1} stopColor="#ff6200" />
								</linearGradient>
								<linearGradient id="al19d" x1="12.56" x2="12.56" y1="23.15" y2="33.88" gradientUnits="userSpaceOnUse">
									<stop offset={0} stopColor="#ffe200" />
									<stop offset={1} stopColor="#ff6200" />
								</linearGradient>
								<linearGradient id="al19e" x1="12.79" x2="12.79" y1="33.33" y2="34.43" gradientUnits="userSpaceOnUse">
									<stop offset={0} stopColor="#ffe200" />
									<stop offset={1} stopColor="#ff6200" />
								</linearGradient>
							</defs>
							<g>
								<g>
									<g>
										<path fill="url(#al19a)" d="M22.577 12.58a6.273 6.273 0 0 0 1.175-3.657 6.309 6.309 0 0 0-6.308-6.309c-.052 0-.102.007-.153.008a6.025 6.025 0 0 0-5.059-2.75A6.032 6.032 0 0 0 6.72 3.456C2.95 4.442.163 7.861.163 11.94c0 2.243.848 4.282 2.232 5.834a7.68 7.68 0 0 0 7.642 8.43c.463 0 2.304-.042 2.744-.12l.185-1.902a7.68 7.68 0 0 0 9.61-11.602z" />
									</g>
									<g>
										<path fill="url(#al19b)" d="M12.78 23.316c-.88.228-1.854.22-2.896-.272-1.41-.666-2.433-2.02-2.572-3.575a4.387 4.387 0 0 1 .192-1.738.543.543 0 0 0-.192-.58A6.014 6.014 0 0 1 5.1 12.489a6.028 6.028 0 0 1 3.536-5.487.552.552 0 0 0 .333-.553 5.392 5.392 0 0 1-.029-.544 6.032 6.032 0 0 1 4.657-5.87 6.017 6.017 0 0 0-1.365-.164A6.032 6.032 0 0 0 6.72 3.457C2.95 4.442.163 7.861.163 11.94c0 2.243.848 4.282 2.232 5.834a7.68 7.68 0 0 0 7.642 8.43c.463 0 2.304-.042 2.743-.12V23.316z" />
									</g>
									<g>
										<path fill="url(#al19c)" d="M11.683 23.46l-.052-.002-.496 10.425h3.291l-.485-10.2c-.018-.366-.384-.63-.726-.5-.477.178-.992.277-1.532.277z" />
									</g>
									<g>
										<path fill="url(#al19d)" d="M13.94 23.682c-.017-.365-.383-.629-.725-.5-.477.18-.992.278-1.532.278l-.052-.002-.496 10.426h1.646v-8.931c0-.236.15-.446.375-.52l.807-.27z" />
									</g>
									<g>
										<path fill="url(#al19e)" d="M15.524 34.432h-5.486a.548.548 0 1 1 0-1.097h5.486a.548.548 0 1 1 0 1.097z" />
									</g>
								</g>
							</g>
						</svg>
					</div>
				</div>
				<div className="book-ticket">
				<div className="container container-small">
				<div className="row row-small">
					<div className="col-12 col-lg-8 col-small">
						<div className="recommend-regis">
							<img src={imagesUrl + "gift.png"} alt="flight"/>
							<p className="recommend-regis__content">Bạn chưa là thành viên.<br />Vui lòng&nbsp;<a href="# ">đăng nhập</a>&nbsp;hoặc&nbsp;<a href="# ">đăng kí</a>&nbsp;tài khoản để hưởng các ưu đãi đặc biệt cho thành viên từ ThankTrip</p>
						</div>
						<div className="card info-flight show-on-max-lg">
							<div className="card__title">
								<div className="info-flight__logo-airline"><img src={imagesUrl + "logo-vietnam-airlines.png"} alt="logo"/></div>
								<div className="type"><span>Ghế</span><strong>Phổ thông</strong></div>
							</div>
							<div className="info-flight__detail">
								<div className="serial"><span className="serial__title">Chuyến bay</span><span className="serial__content">{flight[0].FlightNumber}</span></div>
								<span className="detail js-toggle-modal" data-target="#detail-flight">Chi tiết</span>
							</div>
							<div className="info-flight__location">
								<div className="d-flex justify-content-between">
									<span className="location">{flight[0].StartPoint}</span>
									<div className="img"><img src={imagesUrl + "img-flight-between-2-location.svg"} alt="img"/></div>
									<span className="location">{flight[0].EndPoint}</span>
								</div>
								<div className="d-flex justify-content-between"><span className="location-full">{airportConst[flight[0].StartPoint]}</span><span className="location-full">{airportConst[flight[0].EndPoint]}</span></div>
							</div>
							<div className="info-flight__time">
								<div className="d-flex justify-content-between">
									<div className="start"><span className="time-title">KHỞI HÀNH</span><span className="time-content">{formatHourMitues(flight[0].StartDate)}</span></div>
									<div className="time">
										<img src={imagesUrl + "logo-vietnam-airlines-short.png"} alt="logo"/>
										<div className="time-spent">{intToTime(flight[0].Duration)}</div>
									</div>
									<div className="arrivals"><span className="time-title">ĐẾN NƠI</span><span className="time-content">{formatHourMitues(flight[0].EndDate)}</span></div>
								</div>
								<div className="d-flex justify-content-between date"><span className="text-blue-sky">T2, 21/9/2020</span><span className="text-smoke-dark">Bay thẳng</span><span className="text-blue-sky">T3, 22/9/2020</span></div>
							</div>
						</div>
						<div className="card info-contact">
							<h2 className="card__title mbpx-30">THÔNG TIN LIÊN HỆ</h2>
							<div className="card__content">
								<div className="row">
									<div className="col-12 col-md-6">
										<div className="form-group">
											<label className="form-title required">Danh xưng</label>
											<input className="form-control" type="text" placeholder="Quý Ông" />
										</div>
									</div>
									<div className="col-12 col-md-6">
										<div className="form-group">
											<label className="form-title required">Họ và Tên</label>
											<input className="form-control" type="text" placeholder="Vui lòng nhập họ và tên" />
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-12 col-md-6">
										<div className="form-group">
											<label className="form-title required">Số điện thoại</label>
											<input className="form-control" type="text" placeholder="Vui lòng nhập Số điện thoại" />
										</div>
									</div>
									<div className="col-12 col-md-6">
										<div className="form-group">
											<label className="form-title required">Địa chỉ email</label>
											<input className="form-control" type="email" placeholder="Vui lòng nhập email" />
										</div>
									</div>
								</div>
								<div className="form-group">
									<label className="form-title">Yêu cầu đặc biệt khác</label>
									<textarea className="form-control form-control--textarea" placeholder="Vui lòng nhập yêu cầu của bạn nếu có" defaultValue={""} />
								</div>
								<div className="regis-get-bill">
									<div className="checkbox">
										<input id="bill" type="checkbox" />
										<label htmlFor="bill">Tôi muốn xuất hoá đơn</label>
									</div>
									<div className="row">
										<div className="col-12 col-md-6">
											<div className="form-group">
												<label className="form-title required">Tên Công Ty</label>
												<input className="form-control" type="text" />
											</div>
										</div>
										<div className="col-12 col-md-6">
											<div className="form-group">
												<label className="form-title required">Mã Số Thuế</label>
												<input className="form-control" type="text" />
											</div>
										</div>
									</div>
									<div className="row">
										<div className="col-12 col-md-6">
											<div className="form-group">
												<label className="form-title required">Địa chỉ</label>
												<input className="form-control" type="text" />
											</div>
										</div>
										<div className="col-12 col-md-6">
											<div className="form-group">
												<label className="form-title required">Người Nhận Hoá Đơn</label>
												<input className="form-control" type="text" />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="card passenger">
							<h2 className="card__title text-uppercase">DANH SÁCH KHÁCH HÀNG</h2>
							<div className="card__content">
								{
									[...Array(totalCustomer)].map((e, i) => {
										return <React.Fragment>
											<div className="passenger__item">
												<p className="passenger__title">Khách hàng thứ {i + 1}</p>
												<div className="passenger__row">
													<div className="passenger__col-6">
														<div className="passenger__row-sm">
															<div className="form-group">
																<label className="form-title required">Danh xưng</label>
																<input className="form-control" type="text" placeholder="Quý Ông" />
															</div>
															<div className="form-group">
																<label className="form-title required">Họ</label>
																<input className="form-control text-uppercase" type="text" />
															</div>
														</div>
													</div>
													<div className="passenger__col-6">
														<div className="form-group">
															<label className="form-title required">Tên và tên đệm</label>
															<input className="text-uppercase form-control" type="text" />
														</div>
													</div>
												</div>
											</div>
											<div className="separator-round">
												<svg className="separator-round__left" xmlns="http://www.w3.org/2000/svg" width={25} height={49} viewBox="0 0 25 49">
													<g>
														<g>
															<path fill="#f5f5f5" d="M.5 49C.342 49 .173 49 0 48.997V.005a24.346 24.346 0 0 1 10.037 1.92c2.917 1.234 5.537 3 7.787 5.25A24.409 24.409 0 0 1 25 24.5a24.42 24.42 0 0 1-7.176 17.325A24.421 24.421 0 0 1 .5 49.002z" />
														</g>
													</g>
												</svg>
												<div className="separator-round__dashed" />
													<svg className="separator-round__right" xmlns="http://www.w3.org/2000/svg" width={24} height={49} viewBox="0 0 24 49">
														<g>
															<g>
																<path fill="#f5f5f5" d="M24 48.996H24v-.001A24.432 24.432 0 0 1 7.013 41.66 24.358 24.358 0 0 1 0 24.5 24.36 24.36 0 0 1 7.013 7.34 24.437 24.437 0 0 1 24 .007z" />
															</g>
														</g>
													</svg>
												</div>
											</React.Fragment>
										})
									}
									<LuggageDropdown
										onSelectLuggage={this.onSelectLuggage.bind(this)}
									/>
									</div>
								</div>
							</div>
							<div className="col-12 col-lg-4 col-small">
								<div className="card info-flight hide-on-max-lg">
									<div className="card__title">
										<div className="info-flight__logo-airline"><img src={imagesUrl + "logo-vietnam-airlines.png"} alt="logo"/></div>
										<div className="type"><span>Ghế</span><strong>Phổ thông</strong></div>
									</div>
									<div className="info-flight__detail">
										<div className="serial"><span className="serial__title">Chuyến bay</span><span className="serial__content">{flight[0].FlightNumber}</span></div>
										<span className="detail js-toggle-modal" data-target="#detail-flight">Chi tiết</span>
									</div>
									<div className="info-flight__location">
										<div className="d-flex justify-content-between">
											<span className="location">{flight[0].StartPoint}</span>
											<div className="img"><img src={imagesUrl + "img-flight-between-2-location.svg"} alt="flight"/></div>
											<span className="location">{flight[0].EndPoint}</span>
										</div>
										<div className="d-flex justify-content-between"><span className="location-full">{getAirportCity(flight[0].StartPoint)}</span><span className="location-full">{getAirportCity(flight[0].EndPoint)}</span></div>
									</div>
									<div className="info-flight__time">
										<div className="d-flex justify-content-between">
											<div className="start"><span className="time-title">KHỞI HÀNH</span><span className="time-content">{formatHourMitues(flight[0].StartDate)}</span></div>
											<div className="time">
												<img src={imagesUrl + "logo-vietnam-airlines-short.png"} alt="logo"/>
												<div className="time-spent">{intToTime(flight[0].Duration)}</div>
											</div>
											<div className="arrivals"><span className="time-title">ĐẾN NƠI</span><span className="time-content">{formatHourMitues(flight[0].EndDate)}</span></div>
										</div>
										<div className="d-flex justify-content-between date"><span className="text-blue-sky">{formatDDMY(flight[0].StartDate)}</span><span className="text-smoke-dark">Bay thẳng</span><span className="text-blue-sky">{formatDDMY(flight[0].EndDate)}</span></div>
									</div>
								</div>
								<div className="card compendious">
									<p className="card__title">Tóm tắt</p>
									<div className="compendious__wrap">
										<div className="form-control">
											<div className="d-flex justify-content-between align-items-center">
												<div className="number-passenger active"><span className="number-passenger__content">{fare.Adt}</span><span className="number-passenger__title">người lớn</span></div>
												<span className="price">{((parseInt(fare.FareAdt) + parseInt(fare.TaxAdt) + parseInt(fare.FeeAdt)) * fare.Adt).toLocaleString()}đ</span>
											</div>
										</div>
										<div className="form-control">
											<div className="d-flex justify-content-between align-items-center">
												<div className="number-passenger active"><span className="number-passenger__content">{fare.Chd}</span><span className="number-passenger__title">trẻ em 2 - 11 tuổi</span></div>
												<span className="price">{((parseInt(fare.FareChd) + parseInt(fare.TaxChd) + parseInt(fare.FeeChd)) * fare.Chd).toLocaleString()}đ</span>
											</div>
										</div>
										<div className="form-control">
											<div className="d-flex justify-content-between align-items-center">
												<div className="number-passenger active"><span className="number-passenger__content">{fare.Inf}</span><span className="number-passenger__title">trẻ em &lt; 2 tuổi</span>
												</div>
												<span className="price">{((parseInt(fare.FareInf) + parseInt(fare.TaxInf) + parseInt(fare.FeeInf)) * fare.Inf).toLocaleString()}đ</span>
											</div>
										</div>
										<div className="form-control">
											<div className="d-flex justify-content-between align-items-center">
												<div className="luggage active"><span className="luggage__number">{this.state.luggage}</span><span className="luggage__title">hành lý kí gửi</span></div>
												<span className="price">{this.state.luggage_money}đ</span>
											</div>
										</div>
										<div className="compendious__total">
											<span className="compendious__total-title">Tổng tiền</span>
											<div className="compendious__total-price"><span className="price">{totalPrice.toLocaleString()} đ</span><span className="note">(Đã bao gồm thuế và phí)</span></div>
										</div>
									</div>
								</div>
								<div className="card submit">
									<input className="form-control border introduce" type="text" placeholder="ID giới thiệu" />
									<a className="submit__btn btn btn--large btn--bg-linear" href="# ">
										<span>Tiếp theo</span>
										<svg xmlns="http://www.w3.org/2000/svg" width={8} height={13} viewBox="0 0 8 13">
											<g>
												<g>
													<path fill="#fff" d="M7.042 7.045l-5.153 5.152a.839.839 0 1 1-1.186-1.186l4.559-4.56-4.56-4.558A.84.84 0 0 1 1.89.707l5.152 5.152a.836.836 0 0 1 0 1.186z" />
												</g>
											</g>
										</svg>
									</a>
									<p className="introduce-note">Nhập ID người giới thiệu để tiết kiệm ngay&nbsp;<br /><span className="text-blue-sky font-weight-bold">30.000đ</span>&nbsp;cho chuyến đi này.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		)
	}
};

const mapStateToProps = (state) => ({
	fare: state.booking.fareData
});

const mapDispatchToProps = (dispatch) => {
	return {
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Booking);
