var React = require('react'),
    Router = require('react-router'),
    Link = Router.Link;

var Main = module.exports = React.createClass({
    mixins: [Router.Navigation],
    render: function() {
        return (
            <div className="page-main">
                Call me demo app
                <Link to="default">go to default</Link>
            </div>
        );
    }
});
