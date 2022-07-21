import { useEffect } from "react";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";


export default function LiquidationCheck() {


    const { native } = useMoralisWeb3Api();

    const ABI = [
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "vaultID",
                    "type": "uint256"
                }
            ],
            "name": "checkLiquidation",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ];

    var options = {
        "chain": "polygon",
        "address": "0x7cbf49e4214c7200af986bc4aacf7bc79dd9c19a",
        "function_name": "checkLiquidation",
        "abi": ABI,
        "params": { "vaultID": "217" },
    };

    const { data, error } = useMoralisWeb3ApiCall(
        native.runContractFunction,
        { ...options }
    );
    useEffect(() => {
        fetchBalance();
    }, []);

    const fetchBalance = () => {
        fetch(options);

        if (data) {
            console.log(data);
        }

        console.log(error);

    };


    return (
        <div style={{ height: "100vh", overflow: "auto" }}>
            <div>
                {data && <pre>a{JSON.stringify(data)}</pre>}
            </div>
        </div>
    );
}