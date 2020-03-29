import React, { Component } from 'react'

const luggage = [
  {value: "0", price: "0"},
  {value: "15kg", price: "200000"},
  {value: "20kg", price: "300000"}
]

class LuggageDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      value: "Không, cảm ơn",
      price: "0"
    }

    this.onToggleShow = this.onToggleShow.bind(this);
  }

  onToggleShow() {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  onSelectValue(value) {
    this.setState({
      value: value.value,
      price: value.price
    });

    this.onToggleShow();
    this.props.onSelectLuggage(value);
  }

  render() {
    let show = this.state.isOpen ? "show" : "";
    return (
      <div className="regis-luggage">
        <p className="regis-luggage__title">{this.props.title}</p>
        <div className={show + " dropdown"}>
          <div className="js-control-show-dropdown regis-luggage__display">
            <div className="form-control" onClick={this.onToggleShow}>
              <span className="title">{this.state.value}</span><span className="price">{this.state.price.toLocaleString()}đ</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width={13} height={7} viewBox="0 0 13 7">
              <g>
                <g>
                  <g>
                    <path fill="#919191" d="M12.133.23a.742.742 0 0 0-.544-.23H.773c-.21 0-.39.077-.544.23A.743.743 0 0 0 0 .772c0 .21.076.39.23.543l5.408 5.408c.153.153.334.23.543.23.21 0 .39-.077.543-.23l5.409-5.408a.743.743 0 0 0 .229-.543c0-.21-.077-.39-.23-.544z" />
                  </g>
                </g>
              </g>
            </svg>
          </div>
          {this.state.isOpen && <ul className="dropdown__list form-group-radio">
            <li className="dropdown__intro">
              <p>
                Mua thêm hành lý kí gửi
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
            {luggage.map((item) => (
              <li className="dropdown__item" key={item.value} onClick={(e) => this.onSelectValue(item)}>
                <input type="radio" id={item.value} name="radio-luggage" value="0" defaultChecked={item.price === this.state.price}/>
                <label htmlFor={item.value}><span>{item.value}</span><span className="text-blue-sky">{item.price.toLocaleString()}đ</span></label>
              </li>
            ))}
          </ul>}
        </div>
      </div>
    )
  }
}

export default LuggageDropdown;
