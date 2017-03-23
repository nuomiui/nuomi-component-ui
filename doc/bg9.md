####带背景色标签

标红色的为必须
 
| 参数KEY(类型)        | 说明         | 默认值  |
| ------------- |:-------------:| -----:|
| <font color=red>tags</font>(Array) | 标签数组| [] |
| len(Number)| 展现标签数量 |  2  |
| color(String) | 标签文字颜色|   #FFF |
| bgColor(String) | 标签背景色|   #333 |
 

  	使用：
  		let demoData = ['标签1', '标签2', '标签3']; 
  		
  		import {BgTag9} from 'nuomi-ui';
  		
  		// 省略react相关代码
		class App extends Component {
  		...
  		
  			render() {
  				return <BgTag9 tags={demoData} len={3} />
  			}
  		}
  		


  		
  效果：
  
  <img src="./img/bgtag9.png"/>