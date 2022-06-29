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
            labels: {
                font: {
                    family: font_family
                }
            },
            /*onClick: (evt, legendItem, legend) => {
              const index = legendItem.datasetIndex;
              const ci = legend.chart;
    
              legend.chart.data.datasets.forEach((d, i) => {
                ci.hide(i);
                d.hidden = true;
              })
    
              ci.show(index);
              legendItem.hidden = false;
    
              ci.update();
            }*/
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
        api
            .post("/", query, headers)
            .then(function (response) {
                if (fdata.datasets.length === 0) {
                    setFData(format_gauge_data(response.data));
                }
            })
            .catch((err) => {
                console.error("ops! ocorreu um erro" + err);
            });
    }, [fdata]);

    return (
        <>
            <Line data={fdata} options={options} className="responsive-chart" />
        </>
    );
}