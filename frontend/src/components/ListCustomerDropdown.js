import React, { Component } from 'react'

class ListCustomerDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      number: 0
    }

    this.onToggleShow = this.onToggleShow.bind(this);
  }

  onToggleShow() {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  onSelectValue(number) {
    this.setState({
      number: number
    });

    this.onToggleShow();
    this.props.onSelectCustomer(number);
  }

  render() {
    let show = this.state.isOpen ? "show" : "";
    return (
      <div className={show +" form-group dropdown js-dropdown form-group--dropdown-number"}>
        <label className="form-title">Số hành khách người lớn</label>
        <div className="group-input" onClick={this.onToggleShow}>
          <select className="form-control">
            <option>{this.state.number} hành khách</option>
          </select>
          <div className="icon-search js-control-show-dropdown">
            <svg xmlns="http://www.w3.org/2000/svg" width={10} height={6} viewBox="0 0 10 6">
              <g>
                <g>
                  <path fill="none" stroke="#989898" strokeMiterlimit={50} d="M9.28.375v0L4.67 5.559v0L.424.375v0" />
                </g>
              </g>
            </svg>
          </div>
        </div>
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
          {
            Array.apply(null, { length: 8 }).map((e, i) => (
              <li className="dropdown__item" value={i} key={i} onClick={this.onSelectValue.bind(this, i)}><span>{i}</span></li>
            ))
          }
        </ul>
      </div>
    )
  }
}

export default ListCustomerDropdown;
