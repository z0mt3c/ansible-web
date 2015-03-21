var React = require('react');
var { PageHeader } = require('react-bootstrap');

var NotFound = React.createClass({
    render: function() {
        return (
            <div className="content full-width">
                <PageHeader>404
                    <small>{ 'That Page Doesn\'t Exist' }</small>
                </PageHeader>
            </div>
        );
    }
});

module.exports = NotFound;