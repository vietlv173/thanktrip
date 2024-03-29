import React, { Component } from 'react'

class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      labelItem: null,
      typeDropdown: null,
      value: this.props.value
    }
  }

  componentWillMount() {
    const { label } = this.props.list[0];
    let firstItem = null;
    if (typeof label != 'undefined') {
      this.checkType(false);
      firstItem = label;
    } else {
      this.checkType(true);
      firstItem = this.props.list[0];
    }
    this.setState({
      labelItem: firstItem
    });
  }

  checkType = (value) => {
    this.setState({
      typeDropdown: value
    });
  };

  showDropdown = () => {
    this.setState({ isOpen: true });
    document.addEventListener("click", this.hideDropdown);
  };

  hideDropdown = () => {
    this.setState({ isOpen: false });
    document.removeEventListener("click", this.hideDropdown);
  };

  chooseItem = (label, value) => {
    if (this.state.labelItem !== label) {
      this.setState({
        labelItem: label,
        value: value
      })
    }

    this.props.onChangeCustomer(value);
  };


  renderDataDropDown = (item, index) => {
    const {value, label} = this.state.typeDropdown ? {value: index, label: item} : item;

    return (
      <li
        className="dropdown__item"
        key={index}
        value={value}
        onClick={() => this.chooseItem(label, value)}>
        <span>{label}</span>
      </li>
    )
  };

  render() {
    const { list } = this.props;
    return (
      <div className={'form-group dropdown form-group--number ' + (this.state.isOpen ? 'show' : '')}>
        <label className="form-title">{this.props.formTitle}</label>
        <input className="form-control" value={this.state.value} />
        <div className="icon-people"><svg xmlns="http://www.w3.org/2000/svg" width="27" height="26" viewBox="0 0 27 26"><g><g><path fill="#919191" d="M10.552 10.347c.731.992 1.678 1.668 2.594 1.668.916 0 1.866-.676 2.596-1.668.75-1.023 1.258-2.368 1.267-3.671l-.256-1.032c-.094-.372-.1-.716-.107-1.044-.006-.43-.015-.828-.252-1.154-.38-.524-.98-.353-1.68-.152-.478.134-.999.283-1.568.283-.563 0-1.084-.15-1.565-.283-.703-.201-1.3-.372-1.68.152-.234.326-.244.725-.253 1.154-.009.328-.015.672-.106 1.044l-.256 1.032c.006 1.303.515 2.648 1.266 3.67zM-.084 16.435c0-2.244 4.341-3.056 7.498-2.445-1.36.527-2.76 1.407-3.288 2.822-.14.378-.207.77-.207 1.172v2.907H.812a.896.896 0 0 1-.896-.895zm26.438 3.561a.896.896 0 0 1-.895.895h-3.108l.003-2.907c0-.401-.07-.794-.21-1.172-.527-1.418-1.927-2.295-3.284-2.822 3.156-.611 7.494.201 7.494 2.445v3.561zm-12.295-4.325l-.502.94a.406.406 0 0 0-.064.262l.444 5.306c1.328-2.794 2.098-4.606 2.932-7.972 2.666.584 4.709 1.844 4.709 3.777v5.54a1.67 1.67 0 0 1-1.665 1.666H6.358a1.667 1.667 0 0 1-1.662-1.666v-5.54c0-1.933 2.042-3.19 4.706-3.777.84 3.406 1.62 5.217 2.974 8.066l.453-5.4a.426.426 0 0 0-.064-.262l-.502-.94a.177.177 0 0 1-.006-.174.17.17 0 0 1 .152-.085h1.504c.067 0 .122.03.152.085a.177.177 0 0 1-.006.174zm-8.758-2.913c.594 0 1.206-.439 1.68-1.08.488-.662.813-1.532.82-2.375l-.165-.673c-.06-.237-.064-.46-.067-.673-.009-.28-.012-.535-.167-.746-.037-.374-4.085-.362-4.201 0-.152.21-.158.466-.164.746a2.772 2.772 0 0 1-.07.673l-.165.673c.006.843.335 1.713.82 2.374.471.642 1.089 1.08 1.68 1.08zm0 .41c-.73 0-1.464-.505-2.009-1.247-.538-.734-.9-1.705-.9-2.643v-.02l.002-.01-.003-.189c0-2.006-.307-3.668 1.958-4.009.27-.058.578-.091.925-.091.307 0 .585.027.828.07 2.43.29 2.11 1.982 2.11 4.03 0 .061 0 .125-.004.186l.004.012v.021c0 .938-.363 1.909-.902 2.64-.544.745-1.278 1.25-2.009 1.25zm14.015-1.49c.475.641 1.09 1.08 1.68 1.08.597 0 1.209-.439 1.68-1.08.485-.662.817-1.532.823-2.375l-.168-.673c-.06-.237-.064-.46-.07-.673-.006-.28-.012-.535-.161-.746-.04-.374-4.091-.362-4.204 0-.152.21-.158.466-.164.746-.006.213-.01.436-.067.673l-.168.673c.006.843.332 1.713.819 2.374zm-.329.243c-.539-.734-.9-1.705-.9-2.643v-.02l.002-.01c-.003-.064-.003-.128-.003-.189 0-2.027-.313-3.71 2.043-4.02.256-.05.545-.08.867-.08.332 0 .621.03.877.082 2.347.314 2.034 1.994 2.034 4.018 0 .061 0 .125-.004.186l.004.012v.021c0 .938-.363 1.909-.901 2.64-.545.745-1.279 1.25-2.01 1.25-.73 0-1.46-.505-2.009-1.247zm-5.841.727c-1.13 0-2.259-.782-3.102-1.93-.831-1.13-1.391-2.627-1.391-4.076V6.61l.006-.019c-.006-.094-.006-.191-.006-.289 0-3.473-.6-6.289 4.493-6.289s4.496 2.816 4.496 6.29c0 .097 0 .194-.006.288l.006.019v.033c0 1.45-.563 2.947-1.391 4.076-.843 1.148-1.976 1.93-3.105 1.93z"></path></g></g></svg></div>
        <div className="icon-select" onClick={this.showDropdown}>
        </div>
        <ul className="dropdown__list">
          <li className="dropdown__intro">
          <p>Vui lòng chọn
              <span className="js-control-show-dropdown" onClick={this.showDropdown}>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8"><g><g><g>
                  <path fill="#a4afb7" d="M6.027.301l-5.5 5.56L1.953 7.3l4.074-4.117L10.1 7.3l1.426-1.44z"></path></g></g></g>
                </svg>
              </span>
            </p>
          </li>
          {list.map(this.renderDataDropDown)}
        </ul>
      </div>
    )
  }
}

export default Dropdown;
