var React = require('react/addons'),
    Router = require('react-router'),
    { Alert, Input, PageHeader } = require('react-bootstrap'),
    _ = require('lodash'),
    $ = require('jquery');

var Reflux = require('reflux');
var Actions = require('../../actions/runActions');
var Stores = require('../../stores/runStores');

module.exports = React.createClass({
    mixins: [Router.Navigation, Router.State, Reflux.connect(Stores.Get), Reflux.ListenerMixin],
    componentDidMount: function() {
        var params = this.getParams();
        Actions.get(params.id);
    },
    render: function() {
        var lineNo = 0;
        var log = _.reduce(this.state.output, function(memo, output) {
            var lines = output.data.split('\n');
            memo = memo.concat(_.map(lines, function(lineData) {
                return (<p className={output.channel} key={++lineNo}>
                    <a></a>
                    <span>{lineData}</span>
                </p>);
            }));
            return memo;
        }, []);

        var exit = this.state.exitCode ? <p className="exit" data-code={this.state.exitCode}><a/><span>Done. Process exited with {this.state.exitCode}.</span></p> : null;

        return (
            <div className="page-main">
                <PageHeader> Run
                    <small> Details of your { this.state.type === 'sync' ? 'repository sync' : 'task run'}</small>
                </PageHeader>

                <pre className="ansi">
                    {log}
                    {exit}
                </pre>
            </div>
        );
    }
});