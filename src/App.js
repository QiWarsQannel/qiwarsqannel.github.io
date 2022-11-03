import React from 'react';
import './App.css';
//import { Container, Row, Col } from "react-grid-system";
import AllGaugeChart from './AllGaugeChart';
import TotalVotesChart from './TotalVotesChart';
import TotalDystVotesChart from './TotalDystVotesChart';
import SingleGaugeChart from './SingleGaugeChart';
import DystAllGaugeChart from './DystAllGaugeChart';
import DystSingleGaugeChart from './DystSingleGaugeChart';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { setup } from 'axios-cache-adapter';
import QwQ, { VAULTS } from './QwQ';
import QiBuyBacks from './QiBuyBacks';
import { Navbar, NavDropdown, Container, Row, Col } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';
import './bootstrap.scss';

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
          <Navbar collapseOnSelect expand="md" variant="dark">
            <Navbar.Brand>
              <h1 className="logo"><Link to="/">Qi Wars Qannel</Link></h1>
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse className="justify-content-end" id="responsive-navbar-nav">
              <NavDropdown title="Vaults">
                <LinkContainer to="/gauge">
                  <NavDropdown.Item>
                    Overview
                  </NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/gauge/eqi">
                  <NavDropdown.Item>
                    Qi Powah
                  </NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                {[...Array(numGauges)].map((x, i) =>
                  <LinkContainer key={i} to={"/gauge/" + (i + 1)}>
                    <NavDropdown.Item>
                      Gauge {i + 1}
                    </NavDropdown.Item>
                  </LinkContainer>
                )}

              </NavDropdown >
              <NavDropdown title="veDYST">
                <LinkContainer to="/dyst">
                  <NavDropdown.Item>
                    Overview
                  </NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/dyst/eqi">
                  <NavDropdown.Item>
                    Qi Powah
                  </NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                {[...Array(numDystGauges)].map((x, i) =>
                  <LinkContainer key={i} to={"/dyst/" + (i + 1)}>
                    <NavDropdown.Item>
                      Round {i + 1}
                    </NavDropdown.Item>
                  </LinkContainer>
                )}

              </NavDropdown >
              <NavDropdown title="Tools">
                <LinkContainer to="/buybacks">
                  <NavDropdown.Item>
                    Buybacks
                  </NavDropdown.Item>
                </LinkContainer>
              </NavDropdown >
            </Navbar.Collapse>

          </Navbar>
          <Row>
            <Col>
              <Routes>
                <Route path="/" element={
                  <>
                    <Container>
                      <Row>
                        <Col xs={12} md={6}>
                          <h4 className="center">Vault Incentive Gauge</h4>
                          <AllGaugeChart api={api} />
                        </Col>
                        <Col xs={12} md={6}>
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

              </Routes>
            </Col>
          </Row>
        </Container>
      </HashRouter >
      <footer style={{ padding: "1em", marginTop: "1em" }}>
        <center><small><span className="table">&#x253B;&#x2501;&#x253B;</span> &#xFE35; <span className="qimp">&#x10DA;(QwQ&#x10DA;)</span></small></center>
      </footer>
    </div >
  );
}

export default App;
