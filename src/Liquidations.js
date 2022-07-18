import { useMoralisQuery } from "react-moralis";
import { BsBoxArrowUpRight } from 'react-icons/bs';
import Address from './Address.js';
import Token from "./Token.js";
import Vault from "./Vault.js";
import { NavLink } from "react-router-dom";
import { VAULTS } from "./QwQ.js";

export default function Liquidations(props) {
    const col = props.collateral;
    const chain = props.chain;
    const limit = 100;
    const { data } = useMoralisQuery("Vault"+chain+col, (query) => query.limit(limit));
    const getData = data => data;
    const sorted_data = [...getData(data)].sort((a, b) => b.attributes.block_number - a.attributes.block_number);

    return (
        <>
            <small><NavLink to="/liq/">{"<"} All Liquidations</NavLink></small>
            <h4 className="center">Vault Liquidations for {col} on {chain} chain</h4>
            <small style={{fontSize: "12px", float: "right"}}>Only showing the last {limit} liquidations.</small>
            <table>
                <thead>
                    <tr>
                        <th>Collateral Liquidated</th>
                        <th>Vault</th>
                        <th>ClosingFee</th>
                        <th>Debt Repaid</th>
                        <th>Buyer</th>
                        <th>Owner</th>
                        <th>Vault ID</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>

                    {sorted_data.map((x, i) =>
                        <tr key={i}>
                            <td><Token>{x.attributes.collateralLiquidated}</Token></td>
                            <td><Vault chain={chain}>{x.attributes.address}</Vault></td>
                            <td><Token>{x.attributes.closingFee}</Token></td>
                            <td><Token>{x.attributes.debtRepaid}</Token></td>
                            <td><Address color copy truncateMaxWidth={999999}>{x.attributes.buyer}</Address></td>
                            <td><Address color copy truncateMaxWidth={999999}>{x.attributes.owner}</Address></td>
                            <td>{x.attributes.vaultID}</td>
                            <td><a target="_blank" rel="noreferrer" href={VAULTS.SCAN_TX_URI[chain] + x.attributes.transaction_hash}>{x.attributes.block_timestamp.toISOString().replace("T", " ").replace(".000Z", "")}<BsBoxArrowUpRight /></a></td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    )
}