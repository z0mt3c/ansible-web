var React = require('react/addons'),

    { PageHeader } = require('react-bootstrap'),
    ListMixin = require('../../mixins/list');
//{ IntlMixin, Formatte;Relative, FormattedDate, FormattedTime } = require('react-intl'),

var Reflux = require('reflux');
var Actions = require('../../actions/runActions');
var Stores = require('../../stores/runStores');
/*
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
 var fields = _.map(this.props.columns, function(column, i) {
 if (column.filter !== false) {
 return <th key={i}>
 <Input type={column.field||'text'} placeholder={column.title}
 valueLink={this.linkState(column.field)} onKeyUp={this.keyUp} onBlur={this.blur}/>
 </th>;
 } else {
 return <th key={i}></th>;
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
 */

var RunList = React.createClass({
    contextTypes: {router: React.PropTypes.func}, mixins: [Reflux.connect(Stores.List, 'list'), ListMixin],
    getListAction() {
        return Actions.list;
    },
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
            <td>{item.createdAt}</td>
        </tr>);
    },
    clickItem(obj, e) {
        e.preventDefault();
        this.context.router.transitionTo('run_detail', {id: obj.id});
    },
    render() {
        return this._render();
    }
});

module.exports = React.createClass({
    contextTypes: {router: React.PropTypes.func},
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
