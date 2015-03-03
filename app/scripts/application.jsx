/** In this file, we create a React component which incorporates components provided by material-ui */

var React = require('react'),
    Router = require('react-router'),
    mui = require('material-ui'),
    Toolbar = mui.Toolbar,
    AppBar = mui.AppBar,
    _ = require('lodash'),
    ToolbarGroup = mui.ToolbarGroup,
    DropDownMenu = mui.DropDownMenu,
    FlatButton = mui.FlatButton;

var pageItems = [
    {payload: '1', text: 'default', to: 'default'},
    {payload: '2', text: 'demo', to: 'demo'}
];

var Layout = module.exports = React.createClass({
    mixins: [Router.Navigation, Router.State],

    onChangePage: function(e, position, obj) {
        this.transitionTo(obj.to, obj.params, obj.query);
    },

    render: function() {
        var self = this;

        var index = _.findIndex(pageItems, function(obj) {
            return self.isActive(obj.to, obj.params, obj.query)
        });

        return (
            <div className="page">
                <Toolbar className="mui-dark-theme">
                    <ToolbarGroup key={0} float="left">
                        <DropDownMenu menuItems={pageItems} onChange={this.onChangePage} selectedIndex={index}/>
                    </ToolbarGroup>
                </Toolbar>

                <Router.RouteHandler />
            </div>
        );
    }
});
