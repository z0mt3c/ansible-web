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
var RunApp = require('./apps/run');
var InventoryApp = require('./apps/inventory');
var HostApp = require('./apps/host');
var TaskApp = require('./apps/task');

var routes = module.exports = (
    <Route name="root" handler={App} path="/" ignoreScrollBehavior>
        <DefaultRoute handler={DashboardApp.List} />
        <Route name="dashboard" handler={DashboardApp.List} path="/" />

        <Route name="task_list" path="/tasks">
            <DefaultRoute handler={TaskApp.List} />
            <Route name="task_create" handler={TaskApp.Edit} path="new" />
            <Route name="task_edit" handler={TaskApp.Edit} path=":id" />
        </Route>

        <Route name="run_list" path="/runs">
            <DefaultRoute handler={RunApp.List} />
            <Route name="run_detail" handler={RunApp.Detail} path=":id" />
        </Route>

        <Route name="repository_list" path="/repositorys">
            <DefaultRoute handler={RepositoryApp.List} />
            <Route name="repository_create" handler={RepositoryApp.Edit} path="new" />
            <Route name="repository_edit" handler={RepositoryApp.Edit} path=":id" />
        </Route>

        <Route name="inventory_list" path="/inventorys">
            <DefaultRoute handler={InventoryApp.List} />
            <Route name="inventory_create" handler={InventoryApp.Edit} path="new" />
            <Route name="inventory_edit" handler={InventoryApp.Edit} path=":id" />
        </Route>

        <Route name="host_list" path="/hosts">
            <DefaultRoute handler={HostApp.List} />
            <Route name="host_create" handler={HostApp.Edit} path="new" />
            <Route name="host_edit" handler={HostApp.Edit} path=":id" />
        </Route>

        <Route name="user_list" path="/users">
            <DefaultRoute handler={UserApp.List} />
            <Route name="user_create" handler={UserApp.Edit} path="new" />
            <Route name="user_edit" handler={UserApp.Edit} path=":id" />
        </Route>

        <Route name="credential_list" path="/credentials">
            <DefaultRoute handler={CredentialApp.List} />
            <Route name="credential_create" handler={CredentialApp.Edit} path="new" />
            <Route name="credential_edit" handler={CredentialApp.Edit} path=":id" />
        </Route>

        <NotFoundRoute handler={Generic.NotFound}/>
    </Route>
);
