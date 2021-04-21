import React, { Component } from 'react';

let style = {
    size: 'small',
    color: 'green',
    shape: 'rect',
    label: 'checkout',
    tagline: false
}
class Bkash extends Component {

    render() {
        return (
            <div>
                <b style={style}>Pay with Bkash</b>
                <h6>{this.props.total}</h6>
            </div>
        );
    }
}

export default Bkash;