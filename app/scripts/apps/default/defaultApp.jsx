var React = require('react'),
    Router = require('react-router'),
    Link = Router.Link,
    Bootstrap = require('react-bootstrap'),
    Button = Bootstrap.Button;

var Main = module.exports = React.createClass({
    mixins: [Router.Navigation],
    render: function() {
        return (
            <div className="page-main">
                <div>
                    Call me default app
                </div>

                <br/>

                <Button bsStyle="primary" onClick={() => this.transitionTo('demo')} >Primary</Button>
            </div>
        );
    }
});
