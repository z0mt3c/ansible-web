var React = require('react'),

    { PageHeader } = require('react-bootstrap');
//    Link = Router.Link;

module.exports = React.createClass({
    contextTypes: {router: React.PropTypes.func},
    render: function() {
        return (
            <div className="page-main">
                <PageHeader>Dashboard
                    <small>Insert fancy dashboard here</small>
                </PageHeader>
            </div>
        );
    }
});
