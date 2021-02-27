const width = 500;
const height = 500;
const padding = 20;
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const clrArr = [];
const colorScale = d3.scaleOrdinal()
                .domain(months)
                .range(d3.schemeCategory20);



//Creating the legend
months.forEach(month => d3.select(".legend")
                            .append("p")
                                .classed("legend__month",true)
                                .text(month)
                                .style("color", colorScale(month)));


//Setting the svg
d3.select("svg")
            .attr("height", height)
            .attr("width", width)
            .append("g")
                    .classed("chart",true)
                    .attr('transform', `translate(${width/2},${height/2})`);



//Setting the range
let minYear = d3.min(birthData, d => d.year);
let maxYear = d3.max(birthData, d => d.year);

d3.select("input")
    .property("min", minYear)
    .property("max", maxYear)
    .property("value", minYear)
    .on("change", () => {
        let event = d3.event;
        event.preventDefault();
        d3.select(".pick-year__selected")
            .text(event.target.value);
        createChart(+event.target.value,false);
        createChart(+event.target.value,true);
    })

//Creating the initial chart
createChart(minYear,false);
createChart(minYear,true);



function createChart(year,isInner) {
    let data = birthData.filter(d => d.year === year);

    if (isInner) {
        let quarterBirths = [
            {month:"January",births:0},
            {month: "April", births:0},
            {month:"July", births:0},
            {month:"October",births:0}]

        for (let k = 0; k <= 2; k++) {
            quarterBirths[0].births += data[k].births;
            quarterBirths[1].births += data[3 + k].births;
            quarterBirths[2].births += data[6 + k].births;
            quarterBirths[3].births += data[9 + k].births;
        }
        data = quarterBirths;
    }

    let pieGen = d3.pie()
                .value(d => d.births)
                .sort((a,b) => 0);
    let arcs = pieGen(data);

    let pathGen;
    if (!isInner) {
        pathGen = d3.arc()
                    .innerRadius((width - padding)/4)
                    .outerRadius((width - padding)/2);
    } else {
        pathGen = d3.arc()
                    .innerRadius(0)
                    .outerRadius((width - padding)/4);
    }


    let className = isInner ? ".innerArc" : "outerArc";


    let update = d3.select(".chart")
                .selectAll(className)
                .data(arcs);
    

    //This is not necessary here, since the number of arcs 
    //is always the same
    update
        .exit()
        .remove();
    update
        .enter()
        .append("path")
            .classed(`arc ${className}`, true)
            .attr("fill", d => colorScale(d.data.month))
        .merge(update)
            .attr("d", pathGen);




    

}

