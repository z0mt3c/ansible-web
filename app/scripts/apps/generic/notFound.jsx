var React = require('react');
var Link = require('react-router').Link;

var NotFound = React.createClass({
    render: function() {
        return (
            <div className="content full-width">
                <h1>{ 'That Page Doesn\'t Exist' }</h1>
                <p>
                    <Link to="default">Return to default</Link>
                </p>
            </div>
        );
    }
});

module.exports = NotFound;