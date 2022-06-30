import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Container, Row, Col } from "react-grid-system";
import AllGaugeChart from './AllGaugeChart';
import TotalVotesChart from './TotalVotesChart';
import { HashRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Container>
          <Row>
            <Col>
              <img src={logo} className="App-logo" alt="logo" />
              <p><span className="table">&#x253B;&#x2501;&#x253B;</span> &#xFE35; <span className="qimp">&#x10DA;(QwQ&#x10DA;)</span></p>
            </Col>
          </Row>
          <Row>
            <Col>
              <HashRouter>
                <Routes>
                  <Route path="/" element={<AllGaugeChart />} />
                  <Route path="/qipowah" element={<TotalVotesChart />} />
                </Routes>
              </HashRouter>
            </Col>
          </Row>
        </Container>

      </header>
    </div>
  );
}

export default App;
