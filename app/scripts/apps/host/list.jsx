var React = require('react/addons'),

    { Button, PageHeader } = require('react-bootstrap'),
    ListMixin = require('../../mixins/list');

var Reflux = require('reflux');
var Actions = require('../../actions/hostActions');
var Stores = require('../../stores/hostStores');

var HostList = React.createClass({
    contextTypes: {router: React.PropTypes.func}, mixins: [Reflux.connect(Stores.List, 'list'), ListMixin],
    getListAction() {
        return Actions.list;
    },
    columns: [
        {field: 'name', title: 'Name', filter: true, sort: true},
        {field: 'factsUpdated', title: 'Facts updated', filter: true, sort: true},
        {field: 'actions', title: 'Actions', filter: false, sort: false, hide: true, className: 'actions'}
    ],
    propTypes: {
        limit: React.PropTypes.number,
        skip: React.PropTypes.number,
        sort: React.PropTypes.string
    },
    componentDidMount() {
        this.load();
    },
    renderRow(item) {
        return (<tr onClick={this._click.bind(null, item)} key={item.id}>
            <td>{item.name}</td>
            <td>{item.factsUpdated}</td>
            <td className="actions">
                {this._renderEdit(item)}
                {' '}
                {this._renderDelete(item)}
            </td>
        </tr>);
    },
    edit(obj, e) {
        e.preventDefault();
        this.context.router.transitionTo('host_edit', {id: obj.id});
    },
    delete(obj, e) {
        e.preventDefault();
        Actions.delete.triggerPromise(obj.id).then(function() {
            this.load();
        }.bind(this));
    },
    render() {
        return this._render();
    }
});

module.exports = React.createClass({
    contextTypes: {router: React.PropTypes.func},
    componentDidMount() {
    },
    createHost() {
        this.context.router.transitionTo('host_create');
    },
    render() {
        return (
            <div className="page-main">
                <PageHeader>Hosts
                    <small> Manage your hosts</small>
                    <Button bsStyle="primary" onClick={this.createHost} className="pull-right">Create new host</Button>
                </PageHeader>

                <HostList sort="+name" />
            </div>
        );
    }
});
