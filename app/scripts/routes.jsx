var React = require('react');
var Router = require('react-router');
var App = require('./application.jsx');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;

// Apps
var CredentialApp = require('./apps/credential');
var DashboardApp = require('./apps/dashboard');
var Generic = require('./apps/generic');
var RepositoryApp = require('./apps/repository');
var UserApp = require('./apps/user');
var InventoryApp = require('./apps/inventory');
var TaskApp = require('./apps/task');

var routes = module.exports = (
    <Route name="root" handler={App} path="/" ignoreScrollBehavior>
        <DefaultRoute handler={DashboardApp} />
        <Route name="dashboard" handler={DashboardApp} path="/" />

        <Route name="task_list" path="/tasks">
            <DefaultRoute handler={TaskApp.List} />
            <Route name="task_create" handler={TaskApp.Edit} path="new" />
            <Route name="task_edit" handler={TaskApp.Edit} path=":id" />
        </Route>

        <Route name="repository_list" path="/repositorys">
            <DefaultRoute handler={RepositoryApp.List} />
            <Route name="repository_create" handler={RepositoryApp.Edit} path="new" />
            <Route name="repository_edit" handler={RepositoryApp.Edit} path=":id" />
        </Route>

        <Route name="inventory_list" path="/inventories">
            <DefaultRoute handler={InventoryApp.List} />
        </Route>

      <Route name="user_list" path="/users">
            <DefaultRoute handler={UserApp.List} />
        </Route>

        <Route name="credential_list" path="/credentials">
            <DefaultRoute handler={CredentialApp.List} />
        </Route>

        <NotFoundRoute handler={Generic.NotFound}/>
    </Route>
);
