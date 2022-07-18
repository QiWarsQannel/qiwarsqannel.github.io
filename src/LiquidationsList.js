import { VAULT_NAMES } from "./QwQ";
import { NavLink } from "react-router-dom";
export default function LiquidationsList() {
    return (
        <>
            <h1>Liquidations</h1>
            <h2>Polygon</h2>
            <ul>
                {VAULT_NAMES.POLYGON_ALL().sort().map((x, i) =>
                        <li key={i}>
                            <NavLink to={"/liq/" + x}>{x}</NavLink>
                        </li>
                )}
            </ul>
        </>
    );
}