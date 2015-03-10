var React = require('react');
var Router = require('react-router');
var App = require('./application.jsx');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;

// Apps
var DefaultApp = require('./apps/default/defaultApp.jsx');
var DemoApp = require('./apps/demo/demoApp.jsx');
var RepositoryApp = require('./apps/repository');
var TaskApp = require('./apps/task');
var NotFound = require('./apps/generic/notFound.jsx');

var routes = module.exports = (
    <Route name="root" handler={App} path="/" ignoreScrollBehavior>
        <DefaultRoute handler={DefaultApp} />
        <Route name="default" handler={DefaultApp} path="/" />
        <Route name="demo" handler={DemoApp} path="/demo" />
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
        <NotFoundRoute handler={NotFound}/>
    </Route>
);
