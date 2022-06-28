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
import { Container, Row, Col } from "react-grid-system";


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
      first: 200,
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
  variables: {  }
};
/*const query = {
  query: `query {
    proposals (
      where: {
        id_in: ${get_gauge_addr()},
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
};*/
console.log(query);
const headers = {
  headers: {
    'Content-Type': 'application/json'
  }
};

export const options = get_chart_options();
function App() {
  const [fdata, setFData] = React.useState({ datasets: [] });
  React.useEffect(() => {
    api
      .post("/", query, headers)
      .then(function (response) {
        console.log(format_gauge_data(response.data));
        setFData(format_gauge_data(response.data));
        console.log("Is it cached? "+response.request.fromCache);
      })
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
      });
  }, [fdata]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>&#x253B;&#x2501;&#x253B; &#xFE35; &#x10DA;(QwQ&#x10DA;)</p>
        <Container>
          <Row>
            <Col>
              <Line data={fdata} options={options} className="responsive-chart" />
            </Col>
          </Row>
        </Container>

      </header>
    </div>
  );
}

export default App;
