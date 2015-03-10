var React = require('react/addons'),
    Router = require('react-router'),
    { Alert, Input, PageHeader } = require('react-bootstrap'),
    _ = require('lodash'),
    $ = require('jquery');

var Reflux = require('reflux');
var Actions = require('../../actions/runActions');
var Stores = require('../../stores/runStores');

var SetIntervalMixin = {
    setInterval: function() {
        this.clearInterval();
        this.interval = (setInterval.apply(null, arguments));
    },
    clearInterval: function() {
        if (this.interval) {
            clearInterval(this.interval)
            this.interval = null;
        }
    },
    componentWillUnmount: function() {
        this.clearInterval();
    }
};

module.exports = React.createClass({
    mixins: [Router.Navigation, Router.State, Reflux.connect(Stores.Get), Reflux.ListenerMixin, SetIntervalMixin],
    componentDidMount: function() {
        this.load();
    },
    startRefreshing: function() {
        if (!this.interval) {
            this.setInterval(this.load, 1000);
        }
    },
    load: function() {
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

        var processExited = this.state.exitCode !== undefined;
        var exit = processExited ? <p className="exit" data-code={this.state.exitCode}><a/><span>Done. Process exited with exit code {this.state.exitCode}.</span></p> : null;

        if (!processExited) {
            this.startRefreshing();
        } else {
            this.clearInterval();
        }

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