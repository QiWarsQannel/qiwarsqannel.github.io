import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { setup } from 'axios-cache-adapter';
import { useParams } from 'react-router-dom';
import QwQ, { stringToColour, htmlLegendPlugin } from "./QwQ";

// eslint-disable-next-line
Array.prototype.pushIfNotIncluded = function (element) {
    if (!this.includes(element)) {
        this.push(element);
    }
}

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function format_gauge_data(input, p) {
    let ar = input["data"]["proposals"];
    var result = {};
    var labels = [];
    var r = new Map();
    var i = p.id - 1;
    let a = ar[i];
    let choices = a["choices"];
    let total = a.scores_total;
    for (let j = 0; j < a["choices"].length; j++) {
        if (!(choices[j] in r)) {
            let cor = stringToColour(choices[j]);
            r[choices[j]] = { data: [], label: choices[j], fill: true, backgroundColor: cor, hidden: false };
        }
        r[choices[j]]["data"][0] = (a["scores"][j] * 100) / total;
        labels.pushIfNotIncluded("Gauge " + (i + 1));
    }

    result["labels"] = labels;
    result["datasets"] = Object.values(r);
    return result
}

const font_color = QwQ.color.chart;
const font_family = QwQ.font.chart;

const query = {
    query: QwQ.graphql.ALL_GAUGE_VOTES,
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
            text: "All Gauge Votes"
        },
        htmlLegend: {
            containerID: 'legend-container',
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
                        fontColor: color,
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

const api = setup(QwQ.api_setup);


export default function SingleGaugeChart() {

    let params = useParams();

    const [fdata, setFData] = React.useState({ datasets: [] });
    const [gaugeId, setGaugeId] = React.useState();

    React.useEffect(() => {
        if ((fdata.datasets.length === 0) || (params.id !== gaugeId)) {
            api
                .post("/", query, QwQ.headers)
                .then(function (response) {
                    setFData(format_gauge_data(response.data, params));
                    setGaugeId(params.id);
                })
                .catch((err) => {
                    console.error("ops! ocorreu um erro" + err);
                });
        }
    }, [fdata, gaugeId, params]);

    return (
        <>
            <div>
                <Bar data={fdata} options={options} plugins={[htmlLegendPlugin]} className="responsive-chart" />
            </div>
            <div id="legend-container" style={{ flexWrap: "wrap" }}></div>
        </>
    );
}