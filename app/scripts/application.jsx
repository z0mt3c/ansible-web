var React = require('react'),
    Router = require('react-router'),
    { Navbar, Nav, NavItem } = require('react-bootstrap'),
    _ = require('lodash');

var pageItems = [
    {text: 'Dashboard', to: 'dashboard'},
    {text: 'Users', to: 'user_list'},
    {text: 'Credentials', to: 'credential_list'},
    {text: 'Inventories', to: 'inventory_list'},
    {text: 'Hosts', to: 'host_list'},
    {text: 'Repositories', to: 'repository_list'},
    {text: 'Tasks', to: 'task_list'},
    {text: 'Runs', to: 'run_list'}
];

module.exports = React.createClass({
    contextTypes: {router: React.PropTypes.func},

    render: function() {
        var self = this;

        var items = _.map(pageItems, function(obj, i) {
            var isActive = self.context.router.isActive(obj.to, obj.params, obj.query);
            return <NavItem
                key={i}
                onSelect={() => self.context.router.transitionTo(obj.to, obj.params, obj.query)}
                active={isActive}>{obj.text}</NavItem>;
        });

        return (
            <div className="page">
                <Navbar brand="Ansible Master" inverse staticTop fluid toggleNavKey={0}>
                    <Nav right eventKey={0}>
                        {/* This is the eventKey referenced */}
                        {items}
                        <NavItem href="/logout">Logout</NavItem>
                    </Nav>
                </Navbar>

                <div className="container-fluid">
                    <Router.RouteHandler />
                </div>
            </div>
        );
    }
});
