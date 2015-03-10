var React = require('react'),
    Router = require('react-router'),
    { PageHeader } = require('react-bootstrap'),
    Link = Router.Link;

module.exports = React.createClass({
    mixins: [Router.Navigation],
    render: function() {
        return (
            <div className="page-main">
                <PageHeader>Users <small>Manage the users for this tool</small></PageHeader>
            </div>
        );
    }
});
