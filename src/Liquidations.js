import { useState } from "react";
import { useMoralisQuery } from "react-moralis";
import { BsBoxArrowUpRight, BsFillCaretDownFill, BsFillCaretUpFill, BsFillRecordFill } from 'react-icons/bs';
import Address from './Address.js';
import Token from "./Token.js";
import Vault from "./Vault.js";
import { NavLink } from "react-router-dom";
import { VAULTS } from "./QwQ.js";
import { useParams } from 'react-router-dom';

export default function Liquidations(props) {
    const [owner, setOwner] = useState();
    const handleOwner = (e) => setOwner(e.target.value.toLowerCase());
    const [buyer, setBuyer] = useState();
    const handleBuyer = (e) => setBuyer(e.target.value.toLowerCase());
    const [vaultID, setVaultID] = useState();
    const handleVaultID = (e) => setVaultID(e.target.value);
    const [dateSort, setDateSort] = useState("down");
    const handleDateSort = (e) => {
        setRepaidSort("none");
        setLiquidatedSort("none");
        setClosingSort("none");
        if (dateSort === "up") {
            setDateSort("none");
        }
        else if (dateSort === "down") {
            setDateSort("up");
        }
        else {
            setDateSort("down");
        }
        
    }
    const [repaidSort, setRepaidSort] = useState("none");
    const handleRepaidSort = (e) => {
        setDateSort("none");
        setLiquidatedSort("none");
        setClosingSort("none");
        if (repaidSort === "up") {
            setRepaidSort("none");
        }
        else if (repaidSort === "down") {
            setRepaidSort("up");
        }
        else {
            setRepaidSort("down");
        }
        
    }
    const [liquidatedSort, setLiquidatedSort] = useState("none");
    const handleLiquidatedSort = (e) => {
        setDateSort("none");
        setRepaidSort("none");
        setClosingSort("none");
        if (liquidatedSort === "up") {
            setLiquidatedSort("none");
        }
        else if (liquidatedSort === "down") {
            setLiquidatedSort("up");
        }
        else {
            setLiquidatedSort("down");
        }
        
    }
    const [closingSort, setClosingSort] = useState("none");
    const handleClosingSort = (e) => {
        setDateSort("none");
        setRepaidSort("none");
        setLiquidatedSort("none");
        if (closingSort === "up") {
            setClosingSort("none");
        }
        else if (closingSort === "down") {
            setClosingSort("up");
        }
        else {
            setClosingSort("down");
        }
        
    }
    const col = props.collateral;
    let params = useParams();
    const chain = props.chain;
    const limit = 50;
    var page = 0;
    if (params.page) {
        page = params.page;
    }
    const { data, isLoading } = useMoralisQuery(
        "Vault" + chain + col,
        (query) => {
            query.withCount().skip(page * limit).limit(limit);
            if (dateSort === "down") {
                query.descending("block_number");
            }
            else if (dateSort === "up") {
                query.ascending("block_number");
            }

            if (repaidSort === "down") {
                query.descending("debtRepaid_decimal");
            }
            else if (repaidSort === "up") {
                query.ascending("debtRepaid_decimal");
            }

            if (liquidatedSort === "down") {
                query.descending("collateralLiquidated_decimal");
            }
            else if (liquidatedSort === "up") {
                query.ascending("collateralLiquidated_decimal");
            }

            if (closingSort === "down") {
                query.descending("closingFee_decimal");
            }
            else if (closingSort === "up") {
                query.ascending("closingFee_decimal");
            }
            
            if (owner && owner.length > 0) {
                query.equalTo("owner", owner, "i")
            }
            if (buyer && buyer.length > 0) {
                query.equalTo("buyer", buyer, "i")
            }
            if (vaultID && vaultID.length > 0) {
                query.equalTo("vaultID", vaultID, "i")
            }

            return query;
        },
        [col, params.page, owner, buyer, vaultID, dateSort, repaidSort, liquidatedSort, closingSort]
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
                <div className="label">{(page * 1) + 1} {data["count"] && "(" + ((Math.floor(data["count"] / limit) * 1) + 1) + ")"}</div>
                <div>
                    {page < Math.floor(data["count"] / limit) &&
                        <NavLink to={"/liq/" + chain.toLowerCase() + "/" + col + "/" + ((page * 1) + 1)}>{">"}</NavLink>
                    }
                    {page < Math.floor(data["count"] / limit) &&
                        <NavLink to={"/liq/" + chain.toLowerCase() + "/" + col + "/" + (Math.floor(data["count"] / limit))}>{">>"}</NavLink>
                    }
                </div>
            </nav>
            <small style={{ fontSize: "12px", float: "right" }}>{limit * page}-{page < Math.floor(data["count"] / limit) && (limit * page) + (limit - 1)}{page >= Math.floor(data["count"] / limit) && (limit * page) + (data["count"] % limit)} ({data["count"]})</small>
            <table>
                <thead>
                    <tr>
                        <th><button onClick={handleLiquidatedSort}>{liquidatedSort === "down"? <BsFillCaretDownFill/> : (liquidatedSort === "up"? <BsFillCaretUpFill/> : <BsFillRecordFill/>)}</button></th>
                        <th></th>
                        <th><button onClick={handleClosingSort}>{closingSort === "down"? <BsFillCaretDownFill/> : (closingSort === "up"? <BsFillCaretUpFill/> : <BsFillRecordFill/>)}</button></th>
                        <th><button onClick={handleRepaidSort}>{repaidSort === "down"? <BsFillCaretDownFill/> : (repaidSort === "up"? <BsFillCaretUpFill/> : <BsFillRecordFill/>)}</button></th>
                        <th><input type="text" placeholder="Buyer address" value={buyer} onChange={handleBuyer} /></th>
                        <th><input type="text" placeholder="Owner address" value={owner} onChange={handleOwner} /></th>
                        <th><input type="text" placeholder="Vault ID" value={vaultID} onChange={handleVaultID} /></th>
                        <th><button onClick={handleDateSort}>{dateSort === "down"? <BsFillCaretDownFill/> : (dateSort === "up"? <BsFillCaretUpFill/> : <BsFillRecordFill/>)}</button></th>
                    </tr>
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
                    {(!isLoading && (data.length > 0 || data.count > 0)) && getData(data).map((x, i) =>
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