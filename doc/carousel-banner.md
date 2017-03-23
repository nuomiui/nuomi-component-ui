####多针轮播

标红色的为必须

| 参数KEY(类型)        | 说明         | 默认值  |
| ------------- |:-------------:| -----:|
| <font color=red>itemlist</font>(Array) |  数据项| [] |
| height(String|Number)| 容器高度| 130px
| pointer(Boolean)| 是否需要点| true
| events(Object) | {click: 点击时间回调}      |   {} |



    使用：
        let demoData = [{img: 'https://gss0.baidu.com/-vo3dSag_xI4khGko9WTAnF6hhy/nuomi/pic/item/b21c8701a18b87d672a829f90e0828381e30fd6a.jpg'},
            {img: 'https://gss0.baidu.com/-vo3dSag_xI4khGko9WTAnF6hhy/nuomi/pic/item/b21c8701a18b87d672a829f90e0828381e30fd6a.jpg'},
            {img: 'https://gss0.baidu.com/-vo3dSag_xI4khGko9WTAnF6hhy/nuomi/pic/item/b21c8701a18b87d672a829f90e0828381e30fd6a.jpg'}]
            
        import { CarouselBanner} from 'nuomi-ui';

        // 省略react相关代码
        class App extends Component {
        ...

            render() {
                return <CarouselBanner itemlist={demoData} height={120}/>
            }
        }




  效果：

  <img src="./img/carousel.png" width="320"/>