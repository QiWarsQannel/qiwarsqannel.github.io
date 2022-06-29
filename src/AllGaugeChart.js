import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { setup } from 'axios-cache-adapter'

// eslint-disable-next-line
Array.prototype.pushIfNotIncluded = function (element) {
    if (!this.includes(element)) {
        this.push(element);
    }
}

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function format_gauge_data(input) {
    var stringToColour = function (str) {
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

    let ar = input["data"]["proposals"];
    var result = {};
    var labels = [];
    var r = new Map();
    for (let i = 0; i < ar.length; i++) {
        let a = ar[i];
        let choices = a["choices"];
        let total = a.scores_total;
        for (let j = 0; j < a["choices"].length; j++) {
            if (!(choices[j] in r)) {
                let cor = stringToColour(choices[j]);
                r[choices[j]] = { data: [], label: choices[j], fill: false, borderColor: cor, hidden: false };
            }
            r[choices[j]]["data"][i] = (a["scores"][j] * 100) / total;
            labels.pushIfNotIncluded("Gauge " + (i + 1));
        }
    }
    result["labels"] = labels;
    result["datasets"] = Object.values(r);
    return result
}

const font_color = "#FFFFFF";
const font_family = 'monospace';

const query = {
    query: `query {
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
    variables: {}
};

const defaultLegendClickHandler = ChartJS.defaults.plugins.legend.onClick;

const options = {
    responsive: true,
    maintainAspectRatio: false,
    color: font_color,
    interaction: {
        mode: "nearest",
        intersect: false
    },
    stacked: false,
    plugins: {
        title: {
            display: true,
            color: font_color,
            text: "All Gauge Votes"
        },
        legend: {
            position: "bottom",
            onClick: (evt, legendItem, legend) => {
                let allLegendItemsState = [];

                if (legendItem.text === 'HIDE ALL' || legendItem.text === 'SHOW ALL') {
                    if (typeof legend.hideAll === 'undefined') {
                        legend.hideAll = false;
                    }

                    legend.chart.data.datasets.forEach((dataset, i) => {
                        legend.chart.setDatasetVisibility(i, legend.hideAll)
                    });

                    legend.hideAll = !legend.hideAll;
                    legend.chart.update();

                    return;
                }


                defaultLegendClickHandler(evt, legendItem, legend);


                allLegendItemsState = legend.chart.data.datasets.map((e, i) => (legend.chart.getDatasetMeta(i).hidden));

                if (allLegendItemsState.every(el => !el)) {
                    legend.hideAll = false;
                    legend.chart.update();
                } else if (allLegendItemsState.every(el => el)) {
                    legend.hideAll = true;
                    legend.chart.update();
                }
            },
            labels: {
                font: {
                    family: font_family
                },
                generateLabels: (chart) => {
                    const datasets = chart.data.datasets;
                    const {
                        labels: {
                            usePointStyle,
                            pointStyle,
                            textAlign,
                            color
                        }
                    } = chart.legend.options;

                    const legendItems = chart._getSortedDatasetMetas().map((meta) => {
                        const style = meta.controller.getStyle(usePointStyle ? 0 : undefined);

                        return {
                            text: datasets[meta.index].label,
                            fillStyle: style.backgroundColor,
                            fontColor: color,
                            hidden: !meta.visible,
                            lineCap: style.borderCapStyle,
                            lineDash: style.borderDash,
                            lineDashOffset: style.borderDashOffset,
                            lineJoin: style.borderJoinStyle,
                            strokeStyle: style.borderColor,
                            pointStyle: pointStyle || style.pointStyle,
                            rotation: style.rotation,
                            textAlign: textAlign || style.textAlign,
                            datasetIndex: meta.index
                        };
                    });

                    legendItems.push({
                        text: (!chart.legend.hideAll || typeof chart.legend.hideAll === 'undefined') ? 'HIDE ALL' : 'SHOW ALL',
                        fontColor: color,
                        fillStyle: 'white', // Box color
                        strokeStyle: 'white', // LineCollor around box
                    });

                    return legendItems;
                }
            }
        }
    },
    scales: {
        y: {
            type: "linear",
            display: true,
            position: "left",
            ticks: {
                color: font_color,
                font: {
                    family: font_family
                },
                callback: function (value, index, values) {
                    return value + " %";
                }
            }
        },
        x: {
            ticks: {
                font: {
                    family: font_family
                },
                color: font_color
            }
        }
    }
};

const headers = {
    headers: {
        'Content-Type': 'application/json'
    }
};
const api = setup({
    baseURL: "https://hub.snapshot.org/graphql",

    cache: {
        exclude: {
            methods: ['put', 'patch', 'delete']
        }
    }
});


export default function AllGaugeChart() {

    const [fdata, setFData] = React.useState({ datasets: [] });

    React.useEffect(() => {
        if (fdata.datasets.length === 0) {
            api
                .post("/", query, headers)
                .then(function (response) {
                    setFData(format_gauge_data(response.data));
                })
                .catch((err) => {
                    console.error("ops! ocorreu um erro" + err);
                });
        }
    }, [fdata]);

    return (
        <>
            <Line data={fdata} options={options} className="responsive-chart" />
        </>
    );
}