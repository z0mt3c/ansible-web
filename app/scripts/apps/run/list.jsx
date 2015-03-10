var React = require('react/addons'),
    Router = require('react-router'),
    { Button, Table, PageHeader } = require('react-bootstrap'),
    _ = require('lodash'),
    $ = require('jquery');

var Reflux = require('reflux');
var Actions = require('../../actions/runActions');
var Stores = require('../../stores/runStores');

var RunList = React.createClass({
    mixins: [Router.Navigation],
    propTypes: {
        items: React.PropTypes.array
    },
    detail: function(obj, e) {
        e.preventDefault();
        this.transitionTo('run_detail', {id: obj.id});
    },
    render: function() {
        var items = _.map(this.props.items, function(item) {
            return (<tr onClick={this.detail.bind(null, item)} key={item.id}>
                <td>{item.id}</td>
                <td>{item.type}</td>
                <td>{item.createdAt}</td>
            </tr>)
        }.bind(this));

        return (
            <Table hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Creation</th>
                </tr>
                </thead>
                <tbody>
                    {items}
                </tbody>
            </Table>
        );
    }
});

module.exports = React.createClass({
    mixins: [Router.Navigation, Reflux.connect(Stores.List, 'list')],
    componentDidMount: function() {
        Actions.list();
    },
    render: function() {
        return (
            <div className="page-main">
                <PageHeader>Runs
                    <small> Shows all runs of any tasks</small>
                </PageHeader>

                <RunList items={this.state.list}/>
            </div>
        );
    }
});