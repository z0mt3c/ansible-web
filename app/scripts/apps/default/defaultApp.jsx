var React = require('react'),
    Router = require('react-router'),
    Link = Router.Link,
    mui = require('material-ui');

var Main = module.exports = React.createClass({
    mixins: [Router.Navigation],
    render: function() {
        return (
            <div className="page-main">
                <div>
                    Call me default app
                </div>

                <br/>

                <mui.RaisedButton label="Go to demo page" onClick={() => this.transitionTo('demo')} primary={true} />
            </div>
        );
    }
});
