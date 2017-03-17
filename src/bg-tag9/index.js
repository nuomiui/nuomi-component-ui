/**
 * @file 带背景色的9号字tag标签
 * @author   wangjincai@baidu.com
 * @dateTime 2016-9-27 16:35:54
 * @param    {Number} len 标签默认展现个数
 * @param    {String} color 颜色
 * @param    {String} bgColor 背景色
 * @param    {Array} tags 标签数组
 * @return   {ReactElement}
 */
import React, {Component} from 'react';
import './index.less';
export default class BgTag9 extends Component {
    render() {
        let {len = 2, bgColor = '#333', color = '#fff'} = this.props;
        let childNodes;
        if (Array.isArray(this.props.tags) && this.props.tags.length) {
            childNodes = this.props.tags.slice(0, len).map((item, index) => {
                return  (item ? <p key={index} className="tags" style={{'color': color, backgroundColor: bgColor}}><span>{item}</span></p> : null);
            });
        }
        else {
            return null;
        }
        return (
            <div className="bg-tags-list">
                {childNodes}
            </div>
        );
    }
};
