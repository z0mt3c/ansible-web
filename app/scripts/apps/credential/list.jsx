var React = require('react'),
    Router = require('react-router'),
    Link = Router.Link;

module.exports = React.createClass({
    mixins: [Router.Navigation],
    render: function() {
        return (
            <div className="page-main">
                <h2>Credentials</h2>
                <p>Manage your host and repository credentials</p>
            </div>
        );
    }
});
