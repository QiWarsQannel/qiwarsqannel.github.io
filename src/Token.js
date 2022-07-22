import {numberWithCommas} from './QwQ.js';

export default function Token(props) {
    var children = props.children;
    const comma = props.comma;
    const decimal = props.decimal;
    if (!decimal) {
        children = numberWithCommas(parseFloat((props.children)/Math.pow(10,18)).toFixed(18));
    }
    else {
        children = numberWithCommas(parseFloat((props.children)/Math.pow(10,decimal)).toFixed(decimal));
    }

    return (
        <span>{children}</span>
    );
}