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
import QwQ, { stringToColour, htmlLegendPlugin, multidata_sort } from "./QwQ";

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

function normalize_vote_name(str) {
    let a = str.split("/");
    if ((a[0] === "QI") || (a[0] === "MAI")) {
        return a[1]+"/"+a[0];
    }

    return str;
}

function format_gauge_data(input) {
    let ar = input["data"]["proposals"];
    var result = {};
    var labels = [];
    var r = new Map();
    for (let i = 0; i < ar.length; i++) {
        let a = ar[i];
        let choices = a["choices"];
        let total = a.scores_total;
        for (let j = 0; j < a["choices"].length; j++) {
            let nchoice = normalize_vote_name(choices[j]);
            if (!(nchoice in r)) {
                let cor = stringToColour(nchoice);
                r[nchoice] = { data: [], label: nchoice, fill: false, borderColor: cor, hidden: false };
            }
            r[nchoice]["data"][i] = (a["scores"][j] * 100) / total;
            labels.pushIfNotIncluded("Round " + (i + 1));
        }
    }
    result["labels"] = labels;
    result["datasets"] = Object.values(r);
    result.datasets.sort(multidata_sort);
    return result
}

const font_color = QwQ.color.chart;
const font_family = QwQ.font.chart;

const query = {
    query: QwQ.graphql.DYST_ALL_GAUGE_VOTES,
    variables: {}
};

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
            text: "All Rounds Votes"
        },
        htmlLegend: {
            containerID: 'legend-container-dyst',
        },
        legend: {
            display: false,
            position: "bottom",
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
                        fontColor: QwQ.color.primary,
                        fillStyle: QwQ.color.primary, // Box color
                        strokeStyle: QwQ.color.primary, // LineCollor around box
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
            },
            grid: {
                color: QwQ.color.grid
            }
        },
        x: {
            ticks: {
                font: {
                    family: font_family
                },
                color: font_color
            },
            grid: {
                color: QwQ.color.grid
            }
        }
    }
};

var api = null;


export default function DystAllGaugeChart(props) {

    const [fdata, setFData] = React.useState({ datasets: [] });
    const legends = props.legends;
    api=props.api;

    React.useEffect(() => {
        if (fdata.datasets.length === 0) {
            api
                .post("/", query, QwQ.headers)
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
            <div>
                <Line data={fdata} options={options} plugins={[htmlLegendPlugin]} className="responsive-chart" />
            </div>
            {legends ? <div id="legend-container-dyst" style={{ flexWrap: "wrap" }}></div>  :<div id="legend-container-dyst" style={{ display: "none" }}></div>}
        </>
    );
}