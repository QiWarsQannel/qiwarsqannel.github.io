import { useMoralisQuery } from "react-moralis";
import { BsBoxArrowUpRight } from 'react-icons/bs';
import Address from './Address.js';
import { numberWithCommas, mix_color } from "./QwQ.js";



export default function QiBuyBacks(props) {
    const dao_wallets = [
        "0x1d8a6b7941ef1349c1b5e378783cd56b001ecfbc",
        "0xf0f5f7c21d181b7a1f9aa36ed46db3e620eda385"
    ];
    const fresh_threshold = 15;
    const fresh_color = "6ce24c";
    const { data } = useMoralisQuery(
        "PolygonTokenTransfers", 
        (query) => query
        .containedIn("to_address", dao_wallets)
        .equalTo("token_address", "0x580a84c73811e1839f75d86d75d88cca0c241ff4")
        .notEqualTo("from_address","0x574fe4e8120c4da1741b5fd45584de7a5b521f0f")
        .limit(500)
        );
    const getData = data => data;
    const sorted_data = [...getData(data)].sort((a, b) => b.attributes.block_number - a.attributes.block_number);
    const today = new Date();
    
    return (
        <>
        <h4 className="center">QI Buybacks</h4>
        <small className="fresh" style={{fontSize: "12px", float: "right"}}>* Highlighted rows are less than <u>{fresh_threshold} days old</u>.</small>
        <table>
            <thead>
                <tr>
                    <th>QI</th>
                    <th>From</th>
                    <th>Block Number</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                {sorted_data.map((x, i) =>
                    <tr key={i} style={((((today - x.attributes.block_timestamp)/60000)/60)/24) <= fresh_threshold? {borderColor: mix_color(fresh_color,"808080",100-((((((today - x.attributes.block_timestamp)/60000)/60)/24)*100)/fresh_threshold))} : {} } className={((((today - x.attributes.block_timestamp)/60000)/60)/24) <= fresh_threshold? "fresh" : "" }>
                        <td>{numberWithCommas(parseFloat(x.attributes.decimal.value.$numberDecimal).toFixed(2))}</td>
                        <td><Address color copy>{x.attributes.from_address}</Address></td>
                        <td>{x.attributes.block_number}</td>
                        <td><a target="_blank" rel="noreferrer" href={"https://polygonscan.com/tx/" + x.attributes.transaction_hash}>{x.attributes.block_timestamp.toISOString().replace("T"," ").replace(".000Z","")}<BsBoxArrowUpRight/></a></td>
                    </tr>
                )}
            </tbody>
        </table>
        </>
    )
}