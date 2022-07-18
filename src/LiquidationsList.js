import { VAULTS } from "./QwQ";
import { NavLink } from "react-router-dom";
export default function LiquidationsList() {
    return (
        <>
            <h1>Liquidations</h1>
            <h2>Polygon</h2>
            <ul>
                {VAULTS.POLYGON_ALL().sort().map((x, i) =>
                        <li key={i}>
                            <NavLink to={"/liq/polygon/" + x}>{x}</NavLink>
                        </li>
                )}
            </ul>
            <h2>Binance</h2>
            <ul>
                {VAULTS.BINANCE_ALL().sort().map((x, i) =>
                        <li key={i}>
                            <NavLink to={"/liq/binance/" + x}>{x}</NavLink>
                        </li>
                )}
            </ul>
        </>
    );
}