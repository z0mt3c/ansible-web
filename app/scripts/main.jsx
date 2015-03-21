var React = require('react'),
    Router = require('react-router'),
    Routes = require('./routes.jsx'),
    injectTapEventPlugin = require('react-tap-event-plugin');

//Needed for React Developer Tools
window.React = React;

// TODO: Remove me with react 1.0
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

// Render the main app react component into the document body.
// https://facebook.github.io/react/docs/top-level-api.html#react.render
Router.run(Routes, function(Handler) {
    React.render(<Handler />, document.getElementById('universe'));
});
