import truncateEthAddress from 'truncate-eth-address';
import { stringToColour } from './QwQ';
import MediaQuery from 'react-responsive'

export default function Address(props) {
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
                <MediaQuery maxWidth={truncate_size}>
                    <abbr title={children}>{truncateEthAddress(children)}</abbr>
                </MediaQuery>
                <MediaQuery minWidth={truncate_size + 1}>
                    {children}
                </MediaQuery>
            </span>
        </>
    );
}