import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,

} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { setup } from 'axios-cache-adapter'
import QwQ from "./QwQ";

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

);

function format_gauge_data(input) {


    let ar = input["data"]["proposals"];
    var result = {};
    var labels = [];
    var r = new Map();
    for (let i = 0; i < ar.length; i++) {
        let a = ar[i];
        let total = a.scores_total;
        r[i] = total;
        labels.pushIfNotIncluded("Gauge " + (i + 1));

    }
    result["labels"] = labels;
    result["datasets"] = [{ data: Object.values(r), label: "Total", fill: false, borderColor: QwQ.color.primary, hidden: false }];
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
            text: "Total Qipowah Per Gauge"
        },
        legend: {
            display: false
        },
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


export default function TotalVotesChart() {

    const [fdata, setFData] = React.useState({ datasets: [] });

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
            <Line data={fdata} options={options} className="responsive-chart" />
        </>
    );
}