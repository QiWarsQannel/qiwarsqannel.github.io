import React from 'react';
import './App.css';
import { Container, Row, Col } from "react-grid-system";
import AllGaugeChart from './AllGaugeChart';
import TotalVotesChart from './TotalVotesChart';
import TotalDystVotesChart from './TotalDystVotesChart';
import SingleGaugeChart from './SingleGaugeChart';
import DystAllGaugeChart from './DystAllGaugeChart';
import DystSingleGaugeChart from './DystSingleGaugeChart';
import { HashRouter, Routes, Route, NavLink, Link } from 'react-router-dom';
import { setup } from 'axios-cache-adapter';
import QwQ, { VAULTS } from './QwQ';
import QiBuyBacks from './QiBuyBacks';
import Liquidations from './Liquidations';
import LiquidationsList from './LiquidationsList';

function count_gauges(input) {
  return input["data"]["proposals"].length;
}

const api = setup(QwQ.api_setup);
const query = {
  query: QwQ.graphql.ALL_GAUGE_VOTES,
  variables: {}
};
const dquery = {
  query: QwQ.graphql.DYST_ALL_GAUGE_VOTES,
  variables: {}
};

function App() {

  const [numGauges, setNumGauges] = React.useState();
  const [numDystGauges, setNumDystGauges] = React.useState();

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
    if (!numDystGauges) {
      api
        .post("/", dquery, QwQ.headers)
        .then(function (response) {
          setNumDystGauges(count_gauges(response.data));
        })
        .catch((err) => {
          console.error("ops! ocorreu um erro" + err);
        });
    }
  }, [numGauges, numDystGauges]);

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
                <nav>
                  <div className="dropdown">
                    <NavLink to="/gauge">Vaults</NavLink>
                    <ul>
                      <li key="0">
                        <NavLink to="/gauge/eqi">eQI</NavLink>
                      </li>
                      {[...Array(numGauges)].map((x, i) =>
                        <li key={i}>
                          <NavLink to={"/gauge/" + (i + 1)}>Gauge {i + 1}</NavLink>
                        </li>
                      )}
                    </ul>
                  </div>
                  <div className="dropdown">
                    <NavLink to="/dyst">veDYST</NavLink>
                    <ul>
                      <li key="0">
                        <NavLink to="/dyst/eqi">eQI</NavLink>
                      </li>
                      {[...Array(numDystGauges)].map((x, i) =>
                        <li key={i}>
                          <NavLink to={"/dyst/" + (i + 1)}>Round {i + 1}</NavLink>
                        </li>
                      )}
                    </ul>
                  </div>
                  <div className="dropdown">
                    <u>Tools</u>
                    <ul>
                      <li key="0">
                        <NavLink to="/buybacks">Buybacks</NavLink>
                      </li>
                      <li key="1">
                        <NavLink to="/liq">Liquidations</NavLink>
                      </li>
                    </ul>
                  </div>
                </nav>
              </Col>
            </Row>
          </header>
          <Row>
            <Col>
              <Routes>
                <Route path="/" element={
                  <>
                    <Container>
                      <Row>
                        <Col xs={12} lg={6}>
                          <h4 className="center">Vault Incentive Gauge</h4>
                          <AllGaugeChart api={api} />
                        </Col>
                        <Col xs={12} lg={6}>
                          <h4 className="center">Dystopia veDYST Rounds</h4>
                          <DystAllGaugeChart api={api} />
                        </Col>
                      </Row>
                    </Container>
                  </>
                } />
                <Route path="/gauge" element={<AllGaugeChart legends api={api} />} />
                <Route path="/gauge/eqi" element={<TotalVotesChart legends api={api} />} />
                <Route path="/gauge/:id" element={<SingleGaugeChart legends api={api} />} />
                <Route path="/dyst" element={<DystAllGaugeChart legends api={api} />} />
                <Route path="/dyst/eqi" element={<TotalDystVotesChart legends api={api} />} />
                <Route path="/dyst/:id" element={<DystSingleGaugeChart legends api={api} />} />

                <Route path="/buybacks" element={<QiBuyBacks />} />

                <Route path="/liq/" element={<LiquidationsList />} />
                {VAULTS.POLYGON_ALL().map((x, i) =>
                  <>
                    <Route key={i} path={"/liq/polygon/" + x} element={<Liquidations chain="Polygon" collateral={x} />} />
                    <Route key={i} path={"/liq/polygon/" + x + "/:page"} element={<Liquidations chain="Polygon" collateral={x} />} />
                  </>
                )}

                {VAULTS.BINANCE_ALL().map((x, i) =>
                  <>
                    <Route key={i} path={"/liq/binance/" + x} element={<Liquidations chain="Binance" collateral={x} />} />
                    <Route key={i} path={"/liq/binance/" + x + "/:page"} element={<Liquidations chain="Binance" collateral={x} />} />
                  </>
                )}

                {VAULTS.FANTOM_ALL().map((x, i) =>
                  <>
                    <Route key={i} path={"/liq/fantom/" + x} element={<Liquidations chain="Fantom" collateral={x} />} />
                    <Route key={i} path={"/liq/fantom/" + x + "/:page"} element={<Liquidations chain="Fantom" collateral={x} />} />
                  </>
                )}

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
