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
                created_gte: 1641442262,
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
                title_contains: "Dystopia veDYST",
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

export class VAULTS {
    static POLYGON = {
        "0x305f113ff78255d4f8524c8f50c7300b91b10f6a": "WMATIC",
        "0x3fd939b017b31eaadf9ae50c7ff7fa5c0661d47c": "WETH",
        "0xf086dedf6a89e7b16145b03a6cb0c0a9979f1433": "GHST",
        "0x1f0aa72b980d65518e88841ba1da075bd43fa933": "vGHST",
        "0x37131aedd3da288467b6ebe9a77c523a700e6ca1": "WBTC",
        "0x61167073e31b1dad85a3e531211c7b8f1e5cae72": "LINK",
        "0x87ee36f780ae843a78d5735867bc1c13792b7b11": "AAVE",
        "0x98b5f32dd9670191568b661a3e847ed764943875": "CRV",
        "0x701a1824e5574b0b6b1c8da808b184a7ab7a2867": "BAL",
        "0x649aa6e6b6194250c077df4fb37c23ee6c098513": "dQUICK",
        "0x88d84a85a87ed12b8f098e8953b322ff789fcd1a": "camWMATIC",
        "0x11a33631a5b5349af3f165d2b7901a4d67e561ad": "camWETH",
        "0x578375c3af7d61586c2c3a7ba87d2eed640efa40": "camAAVE",
        "0x7dda5e1a389e0c1892caf55940f5fce6588a9ae0": "camWBTC",
        "0xd2fe44055b5c874fee029119f70336447c8e8827": "camDAI",
        "0x1dcc1f864a4bd0b8f4ad33594b758b68e9fa872c": "SAND",
        "0x57cbf36788113237d64e46f25a88855c3dff1691": "SDAM3CRV",
        "0xff2c44fb819757225a176e825255a01b3b8bb051": "FXS",
        "0x7cbf49e4214c7200af986bc4aacf7bc79dd9c19a": "cxDOGE",
        "0x506533b9c16ee2472a6bf37cc320ae45a0a24f11": "cxADA",
        "0x7d36999a69f2b99bf3fb98866cbbe47af43696c8": "cxWETH",
        "0x178f1c95c85fe7221c7a6a3d6f12b7da3253eeae": "CEL"
    }
    static POLYGON_ALL = function () {
        let all = [];
        Object.entries(this.POLYGON).forEach(function (x, i) {
            all.push(x[1]);
        })
        return all;
    }
    static BINANCE = {
        "0x7333fd58d8d73a8e5fc1a16c8037ada4f580fa2b": "DODO",
        "0xa56f9a54880afbc30cf29bb66d2d9adcdcaeadd6": "WBNB",
        "0x014a177e9642d1b4e970418f894985dc1b85657f": "CAKE"
    }
    static BINANCE_ALL = function () {
        let all = [];
        Object.entries(this.BINANCE).forEach(function (x, i) {
            all.push(x[1]);
        })
        return all;
    }
    static FANTOM = {
        "0x1066b8fc999c1ee94241344818486d5f944331a0": "WFTM",
        "0xd939c268c49c442f037e968f045ba02f499562d4": "WETH",
        "0x7efb260662a6fa95c1ce1092c53ca23733202798": "yvWFTM",
        "0x682e473fca490b0adfa7efe94083c1e63f28f034": "yvDAI",
        "0x7ae52477783c4e3e5c1476bbb29a8d029c920676": "yvETH",
        "0x571f42886c31f9b769ad243e81d06d0d144be7b4": "yvBTC",
        "0x6d6029557a06961acc5f81e1fff5a474c54e32fd": "yvYFI",
        "0xe5996a2cb60ea57f03bf332b5adc517035d8d094": "WBTC",
        "0xd6488d586e8fcd53220e4804d767f19f5c846086": "LINK",
        "0x267bdd1c19c932ce03c7a62bbe5b95375f9160a6": "SUSHI",
        "0xdb09908b82499cadb9e6108444d5042f81569bd9": "AAVE",
        "0x3609a304c6a41d87e895b9c1fd18c02ba989ba90": "mooScreamFTM",
        "0xc1c7ef18abc94013f6c58c6cdf9e829a48075b4e": "mooScreamETH",
        "0x5563cc1ee23c4b17c861418cff16641d46e12436": "mooScreamBTC",
        "0x8e5e4d08485673770ab372c05f95081be0636fa2": "mooScreamLINK",
        "0xbf0ff8ac03f3e0dd7d8faa9b571eba999a854146": "mooScreamDAI",
        "0xf34e271312e41bbd7c451b76af2af8339d6f16ed": "mooBooBTCFTM",
        "0x9ba01b1279b1f7152b42aca69faf756029a9abde": "mooBooETHFTM",
        "0x75d4ab6843593c111eeb02ff07055009c836a1ef": "mooBIFI",
        "0x3f6cf10e85e9c0630856599fab8d8bfcd9c0e7d4": "xBOO"
    }
    static FANTOM_ALL = function () {
        let all = [];
        Object.entries(this.FANTOM).forEach(function (x, i) {
            all.push(x[1]);
        })
        return all;
    }
    static AVALANCHE = {
        "0xfA19c1d104F4AEfb8d5564f02B3AdCa1b515da58": "mooAaveAVAX",
        "0x13a7fe3ab741ea6301db8b164290be711f546a73": "SDAM3CRV",
        "0xa9122dacf3fccf1aae6b8ddd1f75b6267e5cbbb8": "WETH",
        "0x1f8f7a1d38e41eaf0ed916def29bdd13f2a3f11a": "WBTC",
        "0x73a755378788a4542a780002a75a7bae7f558730": "WAVAX",
    }
    static AVALANCHE_ALL = function () {
        let all = [];
        Object.entries(this.AVALANCHE).forEach(function (x, i) {
            all.push(x[1]);
        })
        return all;
    }
    static SCAN_TX_URI = {
        "Polygon": "https://polygonscan.com/tx/",
        "Binance": "https://bscscan.com/tx/",
        "Fantom": "https://ftmscan.com/tx/",
        "Avalanche": "https://snowtrace.io/tx/",
    }
    static CHAIN = {
        "Polygon": this.POLYGON,
        "Binance": this.BINANCE,
        "Fantom": this.FANTOM,
        "Avalanche": this.AVALANCHE,
    }
}