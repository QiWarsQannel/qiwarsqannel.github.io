import { useMoralisQuery } from "react-moralis";
import { BsBoxArrowUpRight } from 'react-icons/bs';
import Address from './Address.js';
import Token from "./Token.js";
import Vault from "./Vault.js";
import { NavLink } from "react-router-dom";
import { VAULTS } from "./QwQ.js";
import { useParams } from 'react-router-dom';

export default function Liquidations(props) {
    const col = props.collateral;
    let params = useParams();
    const chain = props.chain;
    const limit = 50;
    var page = 0;
    if (params.page) {
        page = params.page;
    }
    const { data } = useMoralisQuery(
        "Vault" + chain + col,
        (query) => query.withCount().skip(page * limit).limit(limit).descending("block_number"),
        [col, params.page]
    );
    const getData = data => data["results"];

    return (
        <>
            <small><NavLink to="/liq/">{"<"} All Liquidations</NavLink></small>
            <h4 className="center">Vault Liquidations for {col} on {chain} chain</h4>
            <nav className="pagination">
                <div>
                    {page > 0 &&
                        <NavLink to={"/liq/" + chain.toLowerCase() + "/" + col + "/"}>{"<<"}</NavLink>
                    }
                    {page > 0 &&
                        <NavLink to={"/liq/" + chain.toLowerCase() + "/" + col + "/" + ((page * 1) - 1)}>{"<"}</NavLink>
                    }
                </div>
                <div className="label">{page*1+1} {data["count"] && "(" + (Math.floor(data["count"] / limit)*1+1) + ")"}</div>
                <div>
                    {page < Math.floor(data["count"] / limit) &&
                        <NavLink to={"/liq/" + chain.toLowerCase() + "/" + col + "/" + ((page * 1) + 1)}>{">"}</NavLink>
                    }
                    {page < Math.floor(data["count"] / limit) &&
                        <NavLink to={"/liq/" + chain.toLowerCase() + "/" + col + "/" + (Math.floor(data["count"] / limit))}>{">>"}</NavLink>
                    }
                </div>
            </nav>
            <small style={{ fontSize: "12px", float: "right" }}>{limit*page}-{page < Math.floor(data["count"] / limit) && (limit*page)+(limit-1)}{page >= Math.floor(data["count"] / limit) && (limit*page)+(data["count"] % limit)} ({data["count"]})</small>
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

                    {(data.length > 0 || data.count > 0) && getData(data).map((x, i) =>
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