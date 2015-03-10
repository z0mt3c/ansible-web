var React = require('react'),
    Router = require('react-router'),
    Link = Router.Link;

module.exports = React.createClass({
    mixins: [Router.Navigation],
    render: function() {
        return (
            <div className="page-main">
                <h2>Users</h2>
                <p>Manage the users for this tool</p>
            </div>
        );
    }
});
