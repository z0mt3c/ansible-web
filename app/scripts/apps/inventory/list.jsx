var React = require('react/addons'),
    Router = require('react-router'),
    { Button, PageHeader } = require('react-bootstrap'),
    ListMixin = require('../../mixins/list');

var Reflux = require('reflux');
var Actions = require('../../actions/inventoryActions');
var Stores = require('../../stores/inventoryStores');

var InventoryList = React.createClass({
    mixins: [Router.Navigation, Reflux.connect(Stores.List, 'list'), ListMixin],
    getListAction() { return Actions.list; },
    columns: [
        {field: 'name', title: 'Name', filter: true, sort: true},
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
            <td className="actions">
                {this._renderEdit(item)}
                {' '}
                {this._renderDelete(item)}
            </td>
        </tr>);
    },
    edit(obj, e) {
        e.preventDefault();
        this.transitionTo('inventory_edit', {id: obj.id});
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
    mixins: [Router.Navigation],
    componentDidMount() {
    },
    createInventory() {
        this.transitionTo('inventory_create');
    },
    render() {
        return (
            <div className="page-main">
                <PageHeader>Inventories
                    <small> Manage your host inventories</small>
                    <Button bsStyle="primary" onClick={this.createInventory} className="pull-right">Create new inventory</Button>
                </PageHeader>

                <InventoryList sort="+name" />
            </div>
        );
    }
});