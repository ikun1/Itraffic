//CommonJS模块化写法
// module.exports = function say() {
//     console.log('hello world');
// }
/*es6模块化写法
export default function say() {
    console.log('hello world ');
}
*/
import * as d3 from 'd3'

const colorScales = d3.scaleOrdinal().range(['#1b669a','#33a02c','#a1c97c','#e31a1c','#fb9a99']).domain(['驾车','步行','骑行','公交','地铁'])
    //d3.scaleOrdinal().range(['#a15599', '#d57599', '#b98c6f', '#e0da2f'])

export function pathColor (d) {
    return colorScales(d)
}