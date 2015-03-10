var React = require('react/addons'),
    Router = require('react-router'),
    { TabbedArea, TabPane, Table, Alert, Input, PageHeader, Panel } = require('react-bootstrap'),
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


var PlaybookTask = React.createClass({
    render: function() {
        var item = this.props.item;
        var title = (<h3>Task: {item.name}</h3>);
        var results = _.map(item.results, function(result, i) {
            return (<div key={i}>{result.host} {'->'} {result.task}</div>);
        });

        return (<Panel header={title}>{results}</Panel>);
    }
});

var PlaybookGathering = React.createClass({
    render: function() {
        var item = this.props.item;
        var title = (<h3>Gathering facts</h3>);
        var results = _.map(item.results, function(result, i) {
            return (<div key={i}>{result.host} {'->'} {result.task}</div>);
        });

        return (<Panel header={title}>{results}</Panel>);
    }
});
var PlaybookStats = React.createClass({
    render: function() {
        var item = this.props.item;
        var title = (<h3>Play recap</h3>);
        var results = _.map(item.stats, function(result, i) {
            return (<tr key={i}>
                <td>{result.host}</td>
                <td>{result.ok}</td>
                <td>{result.failures}</td>
                <td>{result.unreachable}</td>
                <td>{result.changed}</td>
            </tr>);
        });

        return (<Panel header={title}>
            <Table responsive condensed striped>
                <thead>
                <tr>
                    <th>Host</th>
                    <th>OK</th>
                    <th>Failed</th>
                    <th>Unreachable</th>
                    <th>Changed</th>
                </tr>
                </thead>
                <tbody>
                {results}
                </tbody>
            </Table>
        </Panel>);
    }
});

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

            memo = memo.concat(_.map(lines, function(lineData, n) {
                if (lineData === '' && n === lines.length - 1) {
                    return null;
                }

                var lineClass = '';

                if (lineData.indexOf('PLAY ') === 0) {
                    lineClass = 'play';
                } else if (lineData.indexOf('GATHERING FACTS') === 0) {
                    lineClass = 'gathering';
                } else if (lineData.indexOf('TASK: ') === 0) {
                    lineClass = 'task';
                } else if (lineData.indexOf('ok:') === 0) {
                    lineClass = 'host-ok';
                } else if (lineData.indexOf('changed:') === 0) {
                    lineClass = 'host-changed';
                } else if (lineData.indexOf('skipping:') === 0) {
                    lineClass = 'host-skipping';
                } else if (lineData.indexOf('fatal:') === 0) {
                    lineClass = 'host-fatal';
                }

                return (<p className={output.channel + ' ' + lineClass} key={++lineNo}>
                    <a></a>
                    <span>{lineData}</span>
                </p>);
            }));
            return memo;
        }, []);

        var processExited = this.state.exitCode !== undefined;
        var exit = processExited ? <p className="exit" data-code={this.state.exitCode}><a/><span>Done. Process exited with exit code {this.state.exitCode}.</span>
        </p> : null;

        if (!processExited) {
            this.startRefreshing();
        } else {
            this.clearInterval();
        }

        return (
            <div className="page-main run-detail">
                <PageHeader> Run
                    <small> Details of your { this.state.type === 'sync' ? 'repository sync' : 'task run'}</small>
                </PageHeader>

                <TabbedArea defaultActiveKey={1}>
                    <TabPane eventKey={1} tab="Results">
                        {this.renderResult()}
                    </TabPane>
                    <TabPane eventKey={2} tab="Console">
                        <pre className="ansi">
                            {log}
                            {exit}
                        </pre>
                    </TabPane>
                </TabbedArea>
            </div>
        );
    },
    renderResult: function() {
        var result = _.reduce(this.state.messages, function(memo, message) {
            var previous = _.last(memo);

            if (previous && _.contains(['runner_on_ok', 'runner_on_skipped'], message.task)) {
                var results = previous.results = previous.results || [];
                results.push(message);
            } else {
                memo.push(message);
            }

            return memo;
        }, []);

        var list = _.map(result, function(item, i) {
            if (item.task === 'playbook_on_task_start') {
                return <PlaybookTask key={i} item={item}/>
            } else if (item.task === 'playbook_on_setup') {
                return <PlaybookGathering key={i} item={item}/>
            } else if (item.task === 'playbook_on_stats') {
                return <PlaybookStats key={i} item={item}/>
            } else {
                return null;
                //return <div>? {item.task}</div>;
            }
        });

        return (<div>{list}</div>)
    }
});