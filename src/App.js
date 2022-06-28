import React from 'react';
import logo from './logo.svg';
import './App.css';
import api, { format_gauge_data, get_gauge_addr, get_chart_options } from './GraphQlFetch';
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


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const query = {
  query: `query {
    proposals (
      where: {
        id_in: [
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
        ],
      },
      orderBy: "created",
      orderDirection: asc
    ) {
      scores_total
      choices
      scores
    }
  }`,
  variables: {
    gauges: get_gauge_addr()
  }
};
console.log(query);
const headers = {
  headers: {
    'Content-Type': 'application/json'
  }
};

export const options = get_chart_options();
function App() {
  const [fdata, setFData] = React.useState({datasets:[]});
  React.useEffect(() => {
    api
      .post("/", query, headers)
      .then(function (response) {
        console.log(format_gauge_data(response.data));
        setFData(format_gauge_data(response.data));
      })
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
      });
  }, [fdata]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <div>
            <Line data={fdata} options={options} className="responsive-chart" />
          </div>
        </div>

      </header>
    </div>
  );
}

export default App;
