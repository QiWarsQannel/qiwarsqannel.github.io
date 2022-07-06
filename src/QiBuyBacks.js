import { useMoralisQuery } from "react-moralis";
import { BsBoxArrowUpRight } from 'react-icons/bs';
import Address from './Address.js';



export default function QiBuyBacks(props) {

    const { data } = useMoralisQuery("PolygonTokenTransfers", (query) => query.equalTo("to_address", "0x1d8a6b7941ef1349c1b5e378783cd56b001ecfbc").equalTo("token_address", "0x580a84c73811e1839f75d86d75d88cca0c241ff4").limit(500));
    const getData = data => data;
    const sorted_data = [...getData(data)].sort((a, b) => b.attributes.block_number - a.attributes.block_number);
    
    return (
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
                    <tr key={i}>
                        <td>{parseFloat(x.attributes.decimal.value.$numberDecimal).toFixed(2)}</td>
                        <td><Address color>{x.attributes.from_address}</Address></td>
                        <td>{x.attributes.block_number}</td>
                        <td><a target="_blank" rel="noreferrer" href={"https://polygonscan.com/tx/" + x.attributes.transaction_hash}>{x.attributes.block_timestamp.toISOString().replace("T"," ").replace(".000Z","")}<BsBoxArrowUpRight/></a></td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}