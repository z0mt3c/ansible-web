var React = require('react');
var { Modal, Button } = require('react-bootstrap');

module.exports = React.createClass({
    render: function() {
        return (
            <Modal {...this.props} bsStyle="primary" title="Delete item">
                <div className="modal-body">
                    <p>{'Are you sure?'}</p>
                </div>
                <div className="modal-footer">
                    <Button onClick={this.props.onRequestHide}>Cancel</Button>
                    <Button onClick={this.props.onConfirm}>Yes</Button>
                </div>
            </Modal>
        );
    }
});