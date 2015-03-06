var React = require('react');
var Router = require('react-router');
var App = require('./application.jsx');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;

// Apps
var DefaultApp = require('./apps/default/defaultApp.jsx');
var DemoApp = require('./apps/demo/demoApp.jsx');
var ProjectApp = require('./apps/project/projectApp.jsx');
var JobApp = require('./apps/job');
var NotFound = require('./apps/generic/notFound.jsx');

var routes = module.exports = (
    <Route name="root" handler={App} path="/" ignoreScrollBehavior>
        <DefaultRoute handler={DefaultApp} />
        <Route name="default" handler={DefaultApp} path="/" />
        <Route name="demo" handler={DemoApp} path="/demo" />
        <Route name="projects" handler={ProjectApp} path="/projects" />
        <Route name="job_list" path="/jobs">
            <DefaultRoute handler={JobApp.List} />
            <Route name="job_create" handler={JobApp.Edit} path="new" />
            <Route name="job_edit" handler={JobApp.Edit} path=":id" />
        </Route>
        <NotFoundRoute handler={NotFound}/>
    </Route>
);
