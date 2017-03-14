import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {TopBanner, BgTag9, Categroy} from '../src';
import Perf from 'react-addons-perf';
window.Perf = Perf;

let item = {
    img: 'http://b.hiphotos.baidu.com/nuomi/pic/item/1ad5ad6eddc451da18f70e7ebefd5266d0163225.jpg',
    title: '游乐园'
}
let itemList = [];
for (let i = 0; i < 16; i++) {
    itemList.push(item);
}
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: ['我是', '测试']
        }
    }
    render() {
        let event = {click: function (item, index) {
            console.log(item, index);
        }}
        return <div>
            <BgTag9 tags={this.state.tags}/>
            <Categroy categroy={itemList} count={10} events={event} />
            <TopBanner />
        </div>
    }
}
Perf.start();
ReactDOM.render(<App />, document.getElementById('uiComponent'));
Perf.stop();
Perf.printInclusive(Perf.getLastMeasurements())