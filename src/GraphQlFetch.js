import axios from "axios";
import { setupCache } from 'axios-cache-adapter'

// Create `axios-cache-adapter` instance
const cache = setupCache({
  maxAge: 15 * 60 * 1000
})
Array.prototype.pushIfNotIncluded = function (element) {
  if (!this.includes(element)) {
    this.push(element);
  }
}

/*export function get_gauge_addr() {
  return `[
    "0xea84fb3f7df57e8d94e1caaee20541f5d0b3a59072c2c139dae69c55e5fc7781",
    "0x2970eee6aa5406d4bac0c0a1a3d8b18f34c736160606dd62e09234ebffbda5ad",
    "0x80776bc36dfe3f5ea1b4c28f3328c75863815edf7ec35dd1cc8e434d5e94306e",
    "0x3a36e1b02a2587d17a2de0ca5b871ff3174388890687557e60eecaabd19adcac",
    "0x8465d0e7f4095f1161bec04163a47f6a8949e4d84e3f5486548e92570b245c53",
    "0x7d8e1218a5e8c0d6913d43f0b4bf461fa880ff5cd8d917843593b63d4e281822",
    "0x95c732b279d15f97bffcfc8c1105774e3c46306c6eec4f6512af3a49f9b4b665",
    "0xc2b93c2101120ed5b1a71832d51b8833cac8e8ea17d59e98c1eebde94015b8ca",
    "0x15cc7892c5fe6972d1acdc91e863af817b3e2071fa3d070901480294183eb7e5",
    "0x64461eed3df8ec4339975c0ad4d80820ba454756e30f48e575baa0905c4f6de6",
    "0xae009d3fc6517df8d2761a891be63a8a459e68e54d0b8043de176070a23ac51c",
    "0xc7f724eb3473316aef7d0fa7c81d3a50614760cd82ada0c1a08eab6c16e53fda"
  ]`;
}*/

const font_color = "#FFFFFF";
const font_family = 'monospace';

export function get_chart_options() {
  return {
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
}

export function format_gauge_data(input) {
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
    //let scores = a["scores"];
    //result[i] =  {[i]: Object.assign.apply({}, choices.map( (v, i) => ( {[v]: scores[i]} ) ) ) };
  }
  result["labels"] = labels;
  result["datasets"] = Object.values(r);
  return result
}

const api = axios.create({
  baseURL: "https://hub.snapshot.org/graphql",
  adapter: cache.adapter
});

export default api;