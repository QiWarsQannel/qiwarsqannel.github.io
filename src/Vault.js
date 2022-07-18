import { VAULTS, stringToColour } from './QwQ';
import Address from './Address';

export default function Vault(props) {
    const children = props.children;
    const color = props.color;
    const chain = props.chain;
    var truncate_size = 767;
    if (props.truncateMaxWidth) {
        truncate_size = props.truncateMaxWidth;
    }
    var style = {};
    if (color) {
        style = { color: stringToColour(children) };
    }
    return (
        <>
            <span style={style}>
                {VAULTS.CHAIN[chain].hasOwnProperty(children) && VAULTS.CHAIN[chain][children]}
                {!VAULTS.CHAIN[chain].hasOwnProperty(children) && <Address>{children}</Address>}
            </span>
        </>
    );
}