/**
 * @file 多针轮播
 * @author   wangjincai@baidu.com
 * @dateTime 2016-8-9 14:35:26
 * @param {Array} itemlist 数据项目
 * @param {Boolean} pointer 是否需要下方的点
 * @param {String}  height 轮播区域高度
 * @param {Object} event 事件相关 {click}
 */
import React, {Component} from 'react';
import swipe from 'swipe';
import './index.less';

export default class CarouselBanner extends Component {
    constructor(props) {
        super(props);
        this.handlerClick = this.handlerClick.bind(this);
    }
    componentDidMount() {
        document.querySelectorAll('#detailHeader li').forEach((item) => {
            item.style.width = document.body.clientWidth + 'px';
        })
        swipe(document.getElementById('detailHeader'), {
            startSlide: 0,
            continuous: true,
            auto: 3000,
            pointers: document.getElementById('pointers'),
            callback: function (i) {
            }
        });
    }
    handlerClick(e) {
        this.props.event && this.props.event.click && this.props.event.click(e.target.getAttribute('data-i'));
    }
    render() {
        let {itemlist = [], pointers=true, height="130px", pointer=true} = this.props;
        if (!itemlist.length) {
            return null;
        }
        let items = itemlist.map(function (item, index) {
            return (<li key={index} className="sliders">
                <img data-i={index} src={item.img} onClick={this.handlerClick}/>
            </li>);
        }.bind(this));
        return (<div className="detail-header">
            <ul style={{'height': height}} id="detailHeader">
                {items}
            </ul>
            {pointer
                ? <div id="pointers" className="pointers"></div>
                : null
            }
        </div>);
    }
};