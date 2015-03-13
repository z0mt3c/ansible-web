var React = require('react/addons'),
    Router = require('react-router'),
    { Button, Table, PageHeader, Input } = require('react-bootstrap'),
    Paging = require('../../components/paging'),
    ListMixin = require('../../mixins/list'),
    { IntlMixin, FormattedRelative, FormattedDate, FormattedTime } = require('react-intl'),
    _ = require('lodash'),
    $ = require('jquery');

var Reflux = require('reflux');
var Actions = require('../../actions/runActions');
var Stores = require('../../stores/runStores');

var RunFilter = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    keyUp(e) {
        if (e.which === 13) {
            this.changed();
        }
    },
    blur() {
        this.changed();
    },
    changed() {
        if (this.props.onChange) {
            this.props.onChange(this.state);
        }
    },
    render() {
        var fields = _.map(columns, function(column, i) {
            if (column.filter !== false) {
                return <th key={i}>
                    <Input type={column.field||'text'} placeholder={column.title}
                           valueLink={this.linkState(column.field)} onKeyUp={this.keyUp} onBlur={this.blur}/>
                </th>;
            } else {
                return <th key={i}></th>
            }
        }.bind(this));

        return (<tr className="filter">
            {fields}
        </tr>);
    },
    getInitialState() {
        return {};
    }
});

var RunList = React.createClass({
    mixins: [Router.Navigation, Reflux.connect(Stores.List, 'list'), ListMixin],
    listAction: Actions.list,
    columns: [
        {field: 'id', title: 'ID', filter: false, sort: true},
        {field: 'type', title: 'Type', filter: true, sort: true},
        {field: 'createdAt', title: 'Created at', filter: false, sort: true}
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
        return (<tr onClick={this.clickItem.bind(null, item)} key={item.id}>
            <td>{item.id}</td>
            <td>{item.type}</td>
            <td><FormattedDate value={item.createdAt}/></td>
        </tr>);
    },
    clickItem(obj, e) {
        e.preventDefault();
        this.transitionTo('run_detail', {id: obj.id});
    },
    render() {
        return this._render();
    }
});

module.exports = React.createClass({
    mixins: [Router.Navigation],
    componentDidMount() {
    },
    render() {
        return (<div className="page-main">
            <PageHeader>Runs
                <small> Shows all runs of any tasks</small>
            </PageHeader>

            <RunList />
        </div>);
    }
});