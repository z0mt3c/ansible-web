/** In this file, we create a React component which incorporates components provided by material-ui */

var React = require('react'),
    Router = require('react-router'),
    Bootstrap = require('react-bootstrap'),
    _ = require('lodash');

var pageItems = [
    {text: 'Dashboard', to: 'dashboard'},
    {text: 'Users', to: 'user_list'},
    {text: 'Credentials', to: 'credential_list'},
    {text: 'Inventories', to: 'inventory_list'},
    {text: 'Repositories', to: 'repository_list'},
    {text: 'Tasks', to: 'task_list'},
    {text: 'Runs', to: 'run_list'}
];

var Layout = module.exports = React.createClass({
    mixins: [Router.Navigation, Router.State],

    render: function() {
        var self = this;

        var items = _.map(pageItems, function(obj, i) {
            var isActive = self.isActive(obj.to, obj.params, obj.query);
            return <Bootstrap.NavItem
                key={i}
                onSelect={() => self.transitionTo(obj.to, obj.params, obj.query)}
                active={isActive}>{obj.text}</Bootstrap.NavItem>;
        });

        return (
            <div className="page">
                <Bootstrap.Navbar brand="Ansible Master">
                    <Bootstrap.Nav>
                        {items}
                    </Bootstrap.Nav>
                </Bootstrap.Navbar>

                <div className="container">
                    <Router.RouteHandler />
                </div>
            </div>
        );
    }
});
