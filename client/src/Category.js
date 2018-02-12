import React, { Component } from "react";
import { Carousel } from 'react-responsive-carousel';
//require ('react-responsive-carousel/lib/styles/carousel.css');
import burger from './images/burger.jpg';
import nachos from './images/nachos.jpg';
import chinese from './images/chinese.jpg';
class Category extends Component {
  render() {
    return (
      <div>
        <h2>1. Choose a category! -- add as many as you want!</h2>
        <div className="foodChoice">
          <div className="foodCarousel">
            <Carousel showArrows={true} useKeyboardArrows={true} showThumbs={false} infiniteLoop={true} showIndicators={false} dynamicHeight={true}>
                <div>
                    <img src={burger} alt="burger"/>
                    <p className="legend">American</p>
                </div>
                <div>
                    <img src={chinese} alt="chinese"/>
                    <p className="legend">Chinese</p>
                </div>
                <div>
                    <img src={nachos} alt="nachos"/>
                    <p className="legend">Mexican</p>
                </div>
            </Carousel>
            <input type="text" className="searchBar" placeholder="Search..."/>

          </div>
        </div>
      </div>
    );
  }
}

export default Category;