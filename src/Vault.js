import truncateEthAddress from 'truncate-eth-address';
import { VAULT_NAMES, stringToColour } from './QwQ';
import Address from './Address';

export default function Vault(props) {
    const children = props.children;
    const color = props.color;
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
                {VAULT_NAMES.POLYGON.hasOwnProperty(children) && VAULT_NAMES.POLYGON[children]}
                {!VAULT_NAMES.POLYGON.hasOwnProperty(children) && <Address>{children}</Address>}
            </span>
        </>
    );
}