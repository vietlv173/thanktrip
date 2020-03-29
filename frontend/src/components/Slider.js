import React, { Component } from 'react';

class Slider extends Component {
  constructor(props) {
    super(props);

    const windowWidth = window.innerWidth;

    if (this.props.display.default && windowWidth >= 1200) {
      this.display = this.props.display.default
    }
    if (this.props.display.desktop && windowWidth < 1200) {
      this.display = this.props.display.desktop
    }
    if (this.props.display.tablet && windowWidth < 992) {
      this.display = this.props.display.tablet
    }
    if (this.props.display.phone && windowWidth < 768) {
      this.display = this.props.display.phone
    }

    this.numberSlide = Math.ceil(this.props.list.list.length / this.display);
    let currentSlide;
    for (let i = 1; i <= this.numberSlide; i++) {
      for (let j = (i - 1) * this.display; j < i * this.display; j ++) {
        if (j === this.props.list.active) {
          currentSlide = i - 1
        }
      }
    }
    this.state = {
      currentSlide: currentSlide
    }
  }

  componentDidMount = () => {
    const sliderDate = document.querySelectorAll(".result-board__day");
    const sliderListWrapWidth = document.querySelector(".slider__list-wrap").offsetWidth;
    this.setState({
      itemWidth: sliderListWrapWidth
    });
    document.querySelector(".slider__item").style.width = sliderListWrapWidth + 'px';
    document.querySelector(".slider__list").style.width = (sliderListWrapWidth * this.numberSlide) + 'px';
    sliderDate.forEach(item => item.style.width = sliderListWrapWidth / this.display + 'px');
  }

  handleSelectDay = (index) => {
    const sliderDate = document.querySelectorAll(".result-board__day");
    if (0 <= index && index <= this.props.list.list.length - 1) {
      sliderDate.forEach(item => item.classList.remove("active"));
      sliderDate[index].classList.add("active");
    }
  }

  renderSlider = () => {
    const list = this.props.list.list;
    let html = [];
    for (let i = 1; i <= this.numberSlide; i++) {
      let slideItem = [];
      for (let j = (i - 1) * this.display; j < i * this.display; j ++) {
        if (j === this.props.list.active) {
          slideItem.push(
            <div className="result-board__day active" onClick={() => this.handleSelectDay(j)}>
              <p className="date">{list[j].date}</p>
              <p className="price">{list[j].price}</p>
            </div>
          )
        }  else {
          slideItem.push(
            <div className="result-board__day" onClick={() => this.handleSelectDay(j)}>
              <p className="date">{list[j] ? list[j].date : null}</p>
              <p className="price">{list[j] ? list[j].price: null}</p>
            </div>
          )
        }
      }
      html.push(<div className="slider__item">{slideItem}</div>)
    }
    return html
  }

  handleOnClickNextSlide = () => {
    if (this.state.currentSlide < this.numberSlide - 1) {
      this.setState({
        currentSlide: this.state.currentSlide + 1
      })
    }
  }

  handleOnClickPrevSlide = () => {
    if (this.state.currentSlide > 0) {
      this.setState({
        currentSlide: this.state.currentSlide - 1
      })
    }
  }

  render() {
    return (
      <div className="w-100">
        <div className="slider__list-wrap">
          <div className="slider__list" style={{ transform: 'translateX(-' + this.state.currentSlide * this.state.itemWidth + 'px)'}}>
            {this.renderSlider()}
          </div>
        </div>
        <div className="slider__control-btn slider__btn-prev" onClick={this.handleOnClickPrevSlide}>
          <svg xmlns="http://www.w3.org/2000/svg" width={8} height={13} viewBox="0 0 8 13">
            <g>
              <g>
                <g>
                  <path d="M.775 7.045l5.152 5.152a.839.839 0 1 0 1.187-1.186L2.555 6.45l4.559-4.558A.84.84 0 0 0 5.927.707L.775 5.859a.836.836 0 0 0 0 1.186z" />
                </g>
              </g>
            </g>
          </svg>
        </div>
        <div className="slider__control-btn slider__btn-next" onClick={this.handleOnClickNextSlide}>
          <svg xmlns="http://www.w3.org/2000/svg" width={8} height={13} viewBox="0 0 8 13">
            <g>
              <g>
                <path fill="#fff" d="M7.042 7.045l-5.153 5.152a.839.839 0 1 1-1.186-1.186l4.559-4.56-4.56-4.558A.84.84 0 0 1 1.89.707l5.152 5.152a.836.836 0 0 1 0 1.186z" />
              </g>
            </g>
          </svg>
        </div>
      </div>
    );
  }
}

export default Slider;
