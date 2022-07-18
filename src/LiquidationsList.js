import { VAULTS } from "./QwQ";
import { NavLink } from "react-router-dom";
import { Container, Row, Col } from "react-grid-system";

export default function LiquidationsList() {
    return (
        <Container>
            <h1>Liquidations</h1>
            <Row>
                <Col>
                    <h2>Polygon</h2>
                    <ul>
                        {VAULTS.POLYGON_ALL().sort().map((x, i) =>
                            <li key={i}>
                                <NavLink to={"/liq/polygon/" + x}>{x}</NavLink>
                            </li>
                        )}
                    </ul>
                </Col>
                <Col>
                    <h2>Fantom</h2>
                    <ul>
                        {VAULTS.FANTOM_ALL().sort().map((x, i) =>
                            <li key={i}>
                                <NavLink to={"/liq/fantom/" + x}>{x}</NavLink>
                            </li>
                        )}
                    </ul>
                </Col>
                <Col>
                    <h2>Binance</h2>
                    <ul>
                        {VAULTS.BINANCE_ALL().sort().map((x, i) =>
                            <li key={i}>
                                <NavLink to={"/liq/binance/" + x}>{x}</NavLink>
                            </li>
                        )}
                    </ul>
                </Col>
            </Row>
        </Container>
    );
}