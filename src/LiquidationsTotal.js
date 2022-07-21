import { useMoralisQuery } from "react-moralis";
import Placeholder from 'react-bootstrap/Placeholder';

export default function LiquidationTotal(props) {
    const col = props.collateral;
    const chain = props.chain;
    const { data } = useMoralisQuery(
        "Vault" + chain + col,
        (query) => {
            query.withCount().limit(1);
            return query;
        },
        []
    );
    return (
        <>
            {data["count"] >= 0? <span className="total">{data["count"]}</span> : <Placeholder animation="glow" as="span"><Placeholder xs={2} bg="primary" /></Placeholder>}
        </>
    )
}