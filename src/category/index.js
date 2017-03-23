/**
 * @file     金刚位 多屏可滑动(数据尽量扁平，这里多层数据不是很好)
 * @author   memoryza(jincai.wang@foxmail.com)
 * @dateTime 2016-8-24 17:56:54
 * @param    {Number} count 单屏幕最大最大容纳金岗位个数(8/10)
 * @param    {Array}  category 金刚数据 {
 *                                         icon: icon地址[must]
 *                                         hot: 金刚位右上角标签[not must]
 *                                         title: 金岗位Title[must]
 *                                     }
 * @param    {Object} events 需要时间列表
 *                           click 单个元素点击时间
 *
 * @return   ReactElement
 */
import React, {Component} from 'react';
import classNames from 'classnames';
import './index.less';
import swipe from 'swipe';

let isMutilScreen = false;
export default class Categroy extends Component {
    componentDidMount() {
        if (isMutilScreen) {
            swipe(document.querySelector('.category-list-ul'), {
                startSlide: 0,
                auto: 0,
                continuous: false,
                pointers: document.getElementById('categoryPointers'),
                callback: function (i) {

                }
            });
            // $('.category-list-ul').css('height', ($('.category-list-ul .screen').height() + 18) + 'px')
        }
    }
    render() {
        let {count = 8, category, events = {}} = this.props;
        // 金刚位现阶段支持列表，如果支持其他的需要增加对应样式
        const allowList = [8, 10];
        (allowList.indexOf(count) === -1) && (count = 8);
        if (Array.isArray(category) && category.length) {
            isMutilScreen = category.length > count;
            let eleClass = classNames({
                'category-list-ul': true,
                'eight': count === 8,
                'ten': count === 10,
                'mutiplay': isMutilScreen
            });
            let categoryItem = [];
            let screenLen = Math.ceil(category.length / count);
            for (let i = 0; i < screenLen; i++) {
                let screenLi = category.slice(i * count, (i + 1) * count).map((item, index) => {
                    let tabIndex = i * count + index;
                    let itemstyle = {backgroundImage: "url(" + item.img + ")"};
                    let hoticon = {backgroundImage: "url(" + item.icon + ")"};
                    return  (<li key={index} className="cate-item">
                            <div className="item-icon">
                                <div className="icon" style={itemstyle}></div>
                                {item.icon
                                    ? <i className="hoticon"  style={hoticon}></i>
                                    : null
                                }
                            </div>
                            <div className="item-text">{item.title}</div>
                        </li>);
                });
                categoryItem.push(<div key={i} className="screen">{screenLi}</div>);
            }
            return (<div className="category-list">
                <ul className={eleClass}>
                    {categoryItem}
                </ul>
                {isMutilScreen
                    ? <div id="categoryPointers" className="pointers"></div>
                    : null
                }
            </div>);
        }
        else {
            return null;
        }
    }
}