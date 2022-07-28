import { useEffect } from 'react';
import { useMoralisCloudFunction, useNewMoralisObject, useMoralisQuery } from "react-moralis";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Vault from './Vault';

const sumValues = obj => {
    if (Object.values(obj).length > 0) {
        return Object.values(obj).reduce((a, b) => a + b);
    }
    else {
        return 0;
    }
}

export default function BadDebt(props) {
    const address = props.address;
    const { save } = useNewMoralisObject("BadDebt");
    const date_limit = new Date();
    date_limit.setMinutes(date_limit.getMinutes() - 10);

    const { data } = useMoralisCloudFunction(
        "fetch_cached_bad_debt",
        { address: address },
    );

    return (
        <>
            {data? <Vault chain="Polygon">{address}</Vault> : <><AiOutlineLoading3Quarters className="spin" /> <span>Loading...</span></>}
            <p>Bad debt: {"$"}{data && data.attributes["data"] && sumValues(data.attributes["data"])}</p>
            <p>Vaults under: {data && data.attributes["data"] && Object.keys(data.attributes["data"]).length}</p>
            <p>Last update: {data && data.attributes["data"] && data.attributes["updatedAt"].toISOString()}</p>
            

        </>
    );
}