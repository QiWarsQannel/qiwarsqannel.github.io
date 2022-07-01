import React from 'react';
import './App.css';
import { Container, Row, Col } from "react-grid-system";
import AllGaugeChart from './AllGaugeChart';
import TotalVotesChart from './TotalVotesChart';
import SingleGaugeChart from './SingleGaugeChart';
import { HashRouter, Routes, Route, NavLink, Link } from 'react-router-dom';
import { setup } from 'axios-cache-adapter';
import QwQ from './QwQ';

function count_gauges(input) {
  return input["data"]["proposals"].length;
}

const api = setup(QwQ.api_setup);
const query = {
  query: QwQ.graphql.ALL_GAUGE_VOTES,
  variables: {}
};

function App() {

  const [numGauges, setNumGauges] = React.useState();

  React.useEffect(() => {
    if (!numGauges) {
        api
            .post("/", query, QwQ.headers)
            .then(function (response) {
              setNumGauges(count_gauges(response.data));
            })
            .catch((err) => {
                console.error("ops! ocorreu um erro" + err);
            });
    }
}, [numGauges]);

  return (
    <div className="App">
      <HashRouter>
        <Container style={{ width: "100vw" }}>
          <header className="App-header">
            <Row align="center" justify="end">
              <Col xs={12} lg={6}>
                <h1 className="logo"><Link to="/">Qi Wars Qannel</Link></h1>
              </Col>
              <Col xs={12} lg={6} style={{ textAlign: "end" }}>
                <div className="dropdown">
                  <NavLink to="/">Gauges</NavLink>
                  <ul>
                    {[...Array(numGauges)].map((x, i) =>
                      <li key={i}>
                        <NavLink to={"/gauge/"+(i+1)}>Gauge {i+1}</NavLink>
                      </li>
                    )}
                  </ul>
                </div>
                <NavLink to="/qipowah">Qipowah</NavLink>

              </Col>
            </Row>
          </header>
          <Row>
            <Col>
              <Routes>
                <Route path="/" element={<AllGaugeChart />} />
                <Route path="/qipowah" element={<TotalVotesChart />} />
                <Route path="/gauge/:id" element={<SingleGaugeChart />} />
              </Routes>
            </Col>
          </Row>
        </Container>
      </HashRouter>
      <footer style={{ padding: "1em", marginTop: "1em" }}>
        <center><small><span className="table">&#x253B;&#x2501;&#x253B;</span> &#xFE35; <span className="qimp">&#x10DA;(QwQ&#x10DA;)</span></small></center>
      </footer>
    </div >
  );
}

export default App;
