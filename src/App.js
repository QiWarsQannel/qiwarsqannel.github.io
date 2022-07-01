import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Container, Row, Col } from "react-grid-system";
import AllGaugeChart from './AllGaugeChart';
import TotalVotesChart from './TotalVotesChart';
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Container>
          <header className="App-header">
            <Row align="center" justify="end">

              <Col>

                <h1 className="logo">Qi Wars Qannel</h1>
                <small><span className="table">&#x253B;&#x2501;&#x253B;</span> &#xFE35; <span className="qimp">&#x10DA;(QwQ&#x10DA;)</span></small>

              </Col>
              <Col style={{ textAlign: "end" }}>
                <NavLink to="/">Gauges</NavLink>
                <NavLink to="/qipowah">Qipowah</NavLink>
              </Col>
            </Row>
          </header>
          <Row>
            <Col>
              <Routes>
                <Route path="/" element={<AllGaugeChart />} />
                <Route path="/qipowah" element={<TotalVotesChart />} />
              </Routes>

            </Col>
          </Row>
        </Container>

      </HashRouter>
    </div >
  );
}

export default App;
