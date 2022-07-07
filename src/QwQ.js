export const chain_color = {
    "Polygon": "#6a0dad",
    "Fantom": "#0000ff"
}

export function stringChainToColour(str) {
    str = str.split("(")[1].split(")")[0];
    let colour = "";

    if (chain_color[str] !== undefined) {
        colour = chain_color[str];
    }
    else {
        colour = "#FFFFFF";
    }

    return colour;
}
export function stringToColour(str) {
    var hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (let i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
}

export function mix_color(color_1, color_2, weight) {
    function d2h(d) { return d.toString(16); }  // convert a decimal value to hex
    function h2d(h) { return parseInt(h, 16); } // convert a hex value to decimal 

    weight = (typeof (weight) !== 'undefined') ? weight : 50; // set the weight to 50%, if that argument is omitted

    var color = "#";

    for (var i = 0; i <= 5; i += 2) { // loop through each of the 3 hex pairs—red, green, and blue
        var v1 = h2d(color_1.substr(i, 2)), // extract the current pairs
            v2 = h2d(color_2.substr(i, 2)),

            // combine the current pairs from each source color, according to the specified weight
            val = d2h(Math.floor(v2 + (v1 - v2) * (weight / 100.0)));

        while (val.length < 2) { val = '0' + val; } // prepend a '0' if val results in a single digit

        color += val; // concatenate val to our new color string
    }

    return color; // PROFIT!
};

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}
export function multidata_sort(a, b) {
    let sa = a.data.reduce((partialSum, a) => partialSum + a, 0);
    let da = a.data.filter(e => e !== null).length;

    let sb = b.data.reduce((partialSum, a) => partialSum + a, 0);
    let db = b.data.filter(e => e !== null).length;

    return (sb / db) - (sa / da);
}

const getOrCreateLegendList = (chart, id) => {
    const legendContainer = document.getElementById(id);
    let listContainer = legendContainer.querySelector('ul');

    if (!listContainer) {
        listContainer = document.createElement('ul');
        listContainer.style.display = 'flex';
        listContainer.style.flexDirection = 'row';
        listContainer.style.flexWrap = 'wrap';
        listContainer.style.rowGap = '3px';
        listContainer.style.justifyContent = 'center';
        listContainer.style.margin = 0;
        listContainer.style.padding = 0;

        legendContainer.appendChild(listContainer);
    }

    return listContainer;
};

export const htmlLegendPlugin = {
    id: 'htmlLegend',
    afterUpdate(chart, args, options) {
        const ul = getOrCreateLegendList(chart, options.containerID);

        // Remove old legend items
        while (ul.firstChild) {
            ul.firstChild.remove();
        }

        // Reuse the built-in legendItems generator
        const items = chart.options.plugins.legend.labels.generateLabels(chart);

        items.forEach(item => {
            const li = document.createElement('li');
            li.style.alignItems = 'center';
            li.style.cursor = 'pointer';
            li.style.display = 'flex';
            li.style.flexDirection = 'row';
            li.style.marginLeft = '10px';

            li.onclick = () => {
                const { type } = chart.config;
                let allLegendItemsState = [];


                if (item.text === 'HIDE ALL' || item.text === 'SHOW ALL') {
                    if (typeof chart.legend.hideAll === 'undefined') {
                        chart.legend.hideAll = false;
                    }

                    chart.data.datasets.forEach((dataset, i) => {
                        chart.setDatasetVisibility(i, chart.legend.hideAll)
                    });

                    chart.legend.hideAll = !chart.legend.hideAll;
                    chart.legend.chart.update();

                    return;
                }

                allLegendItemsState = chart.data.datasets.map((e, i) => (chart.getDatasetMeta(i).hidden));

                if (allLegendItemsState.every(el => !el)) {
                    chart.legend.hideAll = false;
                    chart.update();

                } else if (allLegendItemsState.every(el => el)) {
                    chart.legend.hideAll = true;
                    chart.update();
                }

                if (type === 'pie' || type === 'doughnut') {
                    // Pie and doughnut charts only have a single dataset and visibility is per item
                    chart.toggleDataVisibility(item.index);
                } else {
                    chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
                }
                chart.update();
            };

            // Color box
            const boxSpan = document.createElement('span');
            boxSpan.style.background = item.fillStyle;
            boxSpan.style.borderColor = item.strokeStyle;
            boxSpan.style.borderWidth = item.lineWidth + 'px';
            boxSpan.style.borderStyle = 'solid'
            boxSpan.style.display = 'inline-block';
            boxSpan.style.height = '12px';
            boxSpan.style.marginRight = '10px';
            boxSpan.style.width = '12px';

            // Text
            const textContainer = document.createElement('p');
            textContainer.style.color = item.fontColor;
            textContainer.style.margin = 0;
            textContainer.style.padding = 0;
            textContainer.style.fontSize = "12px";
            textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

            const text = document.createTextNode(item.text);
            textContainer.appendChild(text);

            li.appendChild(boxSpan);
            li.appendChild(textContainer);
            ul.appendChild(li);
        });
    }
};

export default class QwQ {
    static graphql = {
        ALL_GAUGE_VOTES: `query {
            proposals (
              first: 999,
              where: {
                space: "qidao.eth",
                title_contains: "Vault Incentives Gauge",
                created_gte: 1641442262
              },
              orderBy: "created",
              orderDirection: asc
            ) {
              scores_total
              choices
              scores
            }
          }`,
        DYST_ALL_GAUGE_VOTES: `query {
            proposals (
              first: 999,
              where: {
                space: "qidao.eth",
                title_contains: "Dystopia veDYST"
              },
              orderBy: "created",
              orderDirection: asc
            ) {
              scores_total
              choices
              scores
            }
          }`
    }
    static color = {
        primary: "#e24c54",
        chart: "#FFFFFF",
        grid: "#646464"
    }
    static font = {
        primary: "monospace",
        chart: "Tahoma"
    }
    static headers = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    static api_setup = {
        baseURL: "https://hub.snapshot.org/graphql",

        cache: {
            exclude: {
                methods: ['put', 'patch', 'delete']
            }
        }
    }
}