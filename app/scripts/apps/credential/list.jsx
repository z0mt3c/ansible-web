var React = require('react'),
    Router = require('react-router'),
    Link = Router.Link;

module.exports = React.createClass({
    mixins: [Router.Navigation],
    render: function() {
        return (
            <div className="page-main">
                <h2>Dashboard</h2>
                <p>Insert dashboard here</p>
            </div>
        );
    }
});
