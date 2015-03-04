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
var JobApp = require('./apps/job/jobApp.jsx');

var routes = module.exports = (
    <Route name="root" handler={App} path="/" ignoreScrollBehavior>
        <DefaultRoute handler={DefaultApp} />
        <Route name="default" handler={DefaultApp} path="/" />
        <Route name="demo" handler={DemoApp} path="/demo" />
        <Route name="project" handler={ProjectApp} path="/projects" />
        <Route name="job" handler={JobApp} path="/jobs" />
    </Route>
);
