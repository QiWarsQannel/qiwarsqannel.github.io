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
        let total = a.scores_total;
        r[i] = total;
        labels.pushIfNotIncluded("Gauge " + (i + 1));

    }
    result["labels"] = labels;
    result["datasets"] = [{ data: Object.values(r), label: "Total", fill: false, borderColor: "#FFFFFF", hidden: false }];
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


export default function TotalVotesChart() {

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