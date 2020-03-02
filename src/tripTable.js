import * as d3 from 'd3';
var dataset = [
    {
        time: "0-8",
        步行: 3000,
        驾车: 1300,
        公交: 3700,
        total: 8000
    },
    {
        time: "8-16",
        步行: 2000,
        驾车: 4000,
        公交: 1800,
        total: 7800
    },
    {
        time: "16-24",
        步行: 1100,
        驾车: 1700,
        公交: 1600,
        total: 4400
    }
];
export function drawTable() {
    d3.select("#infoBox").transition().style("left", "80%");
    console.log(d3.select("#infoBox")["_groups"])
    d3.select("#infoBox")["_groups"][0][0].innerHTML = "";
    d3.select("#infoBox").style("background-color", "white")
    drawStackTable();
}
function drawStackTable() {
    const width = parseInt(d3.select("#infoBox").style("width"));
    const height = parseInt(d3.select("#infoBox").style("height")) * 2 / 3;
    const margin = ({ top: 10, right: 10, bottom: 20, left: 40 })

    const stackSvg = d3.select("#infoBox").append("svg")
        .attr("viewBox", [0, 0, width, height]);

    var series = d3.stack()
        .keys(['步行', '驾车', '公交'])
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone)
        (dataset)
    .map(d => (d.forEach(v => v.key = d.key), d))
    //var series = stack(dataset)

    var color = d3.scaleOrdinal()
        .domain(series.map(d => d.key))
        .range(d3.schemeSpectral[series.length])
        .unknown("#ccc")

    var x = d3.scaleBand()
        .domain(dataset.map(d => {console.log(d) 
            return d.time}))
        .range([margin.left, width - margin.right])
        .padding(0.1)

    var y = d3.scaleLinear()
        .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
        .rangeRound([height - margin.bottom, margin.top])

    var xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .call(g => g.selectAll(".domain").remove())

    var yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.selectAll(".domain").remove())

    console.log(series)
    stackSvg.append("g")
        .selectAll("g")
        .data(series)
        .join("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", (d, i) => x(d.data.time))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth())
        .append("title")
        .text(d => `${d.data.time} ${d.key}
${d.data[d.key]}`);





    //formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en")



    // svg.append("g")
    //     .call(xAxis);

    // svg.append("g")
    //     .call(yAxis);

    // stackSvg
    // var stack = d3.stack()
    //     .values(function (d) { return d.trip; })
    //     .x(function (d) { return d.time; })
    //     .y(function (d) { return d.num; });

    // var data = stack(dataset);
    // console.log(data);
    // var padding = { left: 50, right: 50, top: 30, bottom: 30 };

    // var xRangeWidth = width - padding.left - padding.right;

    // var xScale = d3.scaleOrdinal()
    //     .domain(data[0].sales.map(function (d) {
    //         return d.year;
    //     }))
    //     .rangeBands([0, xRangeWidth], 0.3);

    // //最大利润（定义域的最大值）
    // var maxProfit = d3.max(data[data.length - 1].sales, function (d) {
    //     return d.y0 + d.y;
    // });

    // //最大高度（值域的最大值）
    // var yRangeWidth = height - padding.top - padding.bottom;

    // var yScale = d3.scale.linear()
    //     .domain([0, maxProfit])		//定义域
    //     .range([0, yRangeWidth]);		//值域

    // //颜色比例尺
    // var color = d3.scale.category10();

    // //添加分组元素
    // var groups = svg.selectAll("g")
    //     .data(data)
    //     .enter()
    //     .append("g")
    //     .style("fill", function (d, i) { return color(i); });

    // //添加矩形
    // var rects = groups.selectAll("rect")
    //     .data(function (d) { return d.sales; })
    //     .enter()
    //     .append("rect")
    //     .attr("x", function (d) { return xScale(d.year); })
    //     .attr("y", function (d) {
    //         return yRangeWidth - yScale(d.y0 + d.y);
    //     })
    //     .attr("width", function (d) {
    //         return xScale.rangeBand();
    //     })
    //     .attr("height", function (d) { return yScale(d.y); })
    //     .attr("transform", "translate(" + padding.left + ","
    //         + padding.top + ")");
}
