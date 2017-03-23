import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {CarouselBanner, BgTag9, Categroy} from '../src';
import Perf from 'react-addons-perf';
window.Perf = Perf;

let item = {
    img: 'http://b.hiphotos.baidu.com/nuomi/pic/item/1ad5ad6eddc451da18f70e7ebefd5266d0163225.jpg',
    title: '游乐园'
}
let itemList = [];
for (let i = 0; i < 7; i++) {
    itemList.push(item);
}
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tags:['标签1', '标签2', '标签3'],
            itemlist: [{img: 'https://gss0.baidu.com/-vo3dSag_xI4khGko9WTAnF6hhy/nuomi/pic/item/b21c8701a18b87d672a829f90e0828381e30fd6a.jpg'},
            {img: 'https://gss0.baidu.com/-vo3dSag_xI4khGko9WTAnF6hhy/nuomi/pic/item/b21c8701a18b87d672a829f90e0828381e30fd6a.jpg'},
            {img: 'https://gss0.baidu.com/-vo3dSag_xI4khGko9WTAnF6hhy/nuomi/pic/item/b21c8701a18b87d672a829f90e0828381e30fd6a.jpg'}]
        }
    }
    render() {
        let event = {click: function (item, index) {
            console.log(item, index);
        }}
        return <div>
            <BgTag9 tags={this.state.tags} len={3}/>
            <Categroy categroy={itemList} count={8} events={event} />
            <CarouselBanner itemlist={this.state.itemlist} height={100}/>
        </div>
    }
}
Perf.start();
ReactDOM.render(<App />, document.getElementById('uiComponent'));
Perf.stop();
Perf.printInclusive(Perf.getLastMeasurements())