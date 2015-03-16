var _ = require('lodash');
var { Button, Table, PageHeader, Input } = require('react-bootstrap');
var Paging = require('../components/paging');
var Sortable = require('../components/sortable');

module.exports = {
    load(params) {
        this.listAction(params || this.state.params);

        if (params) {
            this.setState({params: params});
        }
    },

    changeSort(sort) {
        var params = _.extend(this.state.params, {sort: sort});
        this.load(params);
    },
    changePage(skip) {
        var params = _.extend(this.state.params, {skip: skip});
        this.load(params);
    },
    changeFilter(filter) {
        var params = _.extend(this.state.params, {filter: filter});
        this.load(params);
    },

    getItems() {
        return this.state.list.items;
    },

    _renderRow(item) {
        return (<tr onClick={this.clickItem.bind(null, item)} key={item.id}>
            <td>{item.id}</td>
        </tr>)
    },
    renderRows() {
        return _.map(this.getItems(), this.renderRow || this._renderRow);
    },

    _renderHeader(column, i) {
        if (column.sort !== false) {
            var sort = this.state.params.sort;
            return <th key={i} className={column.className}>
                <Sortable field={column.field} sort={sort} onSort={this.changeSort}>{column.title}</Sortable>
            </th>;
        } if (column.hide === true) {
            return <th key={i} className={column.className}></th>
        } else {
            return <th key={i} className={column.className}>{column.title}</th>
        }
    },

    renderHeaders(item, i) {
        return _.map(this.columns, this.renderHeader || this._renderHeader);
    },

    renderInfo() {
        if (this.state.list.paging.total) {
            return <p>
                Showing {this.state.list.paging.skip} {' to '} {this.state.list.paging.skip + this.state.list.paging.count}
                {' of '} {this.state.list.paging.total} total
                records.</p>
        } else {
            return null;
        }
    },

    renderTable() {
        var items = this.renderRows();
        var headers = this.renderHeaders();

        return <Table hover>
            <thead>
            <tr>
                {headers}
            </tr>
            </thead>
            <tbody>
            {items}
            </tbody>
        </Table>;
    },

    renderPaging() {
        return <Paging page={this.state.list.paging} limit={this.props.limit} onChange={this.changePage}/>;
    },

    _render() {
        //<RunFilter onChange={this.changeFilter} />
        return (
            <div>
                {this.renderInfo()}
                {this.renderTable()}
                {this.renderPaging()}
            </div>
        );
    },

    getInitialState() {
        return {
            params: this.props
        };
    },

    getDefaultProps() {
        return {
            limit: 10,
            skip: 0,
            sort: '-id'
        };
    }
};