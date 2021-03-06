import { VAULTS } from "./QwQ";
import { NavLink } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import LiquidationTotal from "./LiquidationsTotal.js"

export default function LiquidationsList() {
    return (
        <Container id="liq">
            <h1>Liquidations</h1>
            <Row>
                <Col>
                    <h2 className="qimp">Polygon</h2>
                    <ul>
                        {VAULTS.POLYGON_ALL().sort(Intl.Collator().compare).map((x, i) =>
                            <li key={i}>
                                <NavLink to={"/liq/polygon/" + x}>{x}</NavLink> (<LiquidationTotal collateral={x} chain="Polygon" />)
                            </li>
                        )}
                    </ul>
                </Col>
                <Col>
                    <h2 className="qimp">Fantom</h2>
                    <ul>
                        {VAULTS.FANTOM_ALL().sort(Intl.Collator().compare).map((x, i) =>
                            <li key={i}>
                                <NavLink to={"/liq/fantom/" + x}>{x}</NavLink> (<LiquidationTotal collateral={x} chain="Fantom" />)
                            </li>
                        )}
                    </ul>
                </Col>
                <Col>
                    <h2 className="qimp">Avalanche</h2>
                    <ul>
                        {VAULTS.AVALANCHE_ALL().sort(Intl.Collator().compare).map((x, i) =>
                            <li key={i}>
                                <NavLink to={"/liq/avalanche/" + x}>{x}</NavLink> (<LiquidationTotal collateral={x} chain="Avalanche" />)
                            </li>
                        )}
                    </ul>
                </Col>
                <Col>
                    <h2 className="qimp">Binance</h2>
                    <ul>
                        {VAULTS.BINANCE_ALL().sort(Intl.Collator().compare).map((x, i) =>
                            <li key={i}>
                                <NavLink to={"/liq/binance/" + x}>{x}</NavLink> (<LiquidationTotal collateral={x} chain="Binance" />)
                            </li>
                        )}
                    </ul>
                </Col>
            </Row>
        </Container>
    );
}