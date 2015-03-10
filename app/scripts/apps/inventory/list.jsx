var React = require('react'),
    Router = require('react-router'),
    Link = Router.Link;

module.exports = React.createClass({
    mixins: [Router.Navigation],
    render: function() {
        return (
            <div className="page-main">
                <h2>Inventories</h2>
                <p>Different host inventories should be managed on this page</p>
            </div>
        );
    }
});
