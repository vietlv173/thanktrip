import React from 'react'
import {imagesUrl} from '../constants/path'
import NavMobile from './NavMobile';

const Footer = () => {
    return (
        <React.Fragment>
          <footer className="footer footer-search-page js-lazy-load mb-phone-70" data-type="background-image" data-src={imagesUrl + "bg-footer-white.png"}>
            <div className="footer__content-wrap">
              <div className="footer__content">
                <div className="footer__content-top">
                  <div className="intro">
                  <img className="footer__logo" src={imagesUrl + "logo.png"} alt="logo" />
                  </div>
                  <div className="links"><span>LINKS</span></div>
                  <div className="contact-us"><span>CONTACT US</span></div>
                </div>
                <div className="footer__content-body">
                  <div className="footer__intro">
                    <p className="footer__intro-content">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,sed do eiusmod tempor incididunt ut labore magna aliqua.
                      Ut aliquip ex ea commodo consequat.
                    </p>
                    <div className="footer__social">
                      <a className="footer__social-item" href="# " src={imagesUrl + "icon_fb.png"}>
                        <img src={imagesUrl + "icon_fb.png"} alt="icon facebook" /></a><a className="footer__social-item" href="# ">
                        <img src={imagesUrl + "icon_twitter.png"} alt="icon twitter" /></a><a className="footer__social-item" href="# ">
                        <img src={imagesUrl + "icon_gmail.png"} alt="icon gmail" /></a><a className="footer__social-item" href="# ">
                        <img src={imagesUrl + "icon_pinterest.png"} alt="icon pinterest" /></a><a className="footer__social-item" href="# ">
                        <img src={imagesUrl + "icon_insta.png"} alt="icon instagram" />
                      </a>
                    </div>
                  </div>
                  <div className="footer__links">
                    <div className="title-mobile">LINKS</div>
                    <a href="# ">Homepage</a><a href="# ">News Feed</a><a href="# ">Messages</a><a href="# ">My Profile</a><a href="# ">About us</a>
                  </div>
                  <div className="footer__contact-us">
                    <div className="title-mobile">CONTACT US</div>
                    <p>Hotline: 012345678</p>
                    <p>Email: email@gmail.com</p>
                    <p>Address: 01 Nguyen Thi Minh Khai<br />phuong 19, quan Binh Thanh</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer__bottom">
              <p>© 2015 All rights reserved. THANKTRIPS</p>
            </div>
          </footer>
          <NavMobile />
        </React.Fragment>
    )
}

export default Footer;
