var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    Table = Bootstrap.Table,
    _ = require('lodash'),
    $ = require('jquery');

var ListItem = React.createClass({
    getInitialState: function() {
        return {data: this.props.item};
    },
    _click: function() {
        console.log(this);
    },
    render: function() {
        var columns = _.map(this.props.columns, function(column, i) {
            return (<td key={i}>{this.state.data[column.key]}</td>);
        }.bind(this));

        return (
            <tr onClick={this._click}>
                {columns}
            </tr>
        )
    }
});

var List = React.createClass({
    propTypes: {
        items: React.PropTypes.array
    },
    load: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            success: function(data) {
                this.setState({items: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
                this.setState({
                    items: [{
                        id: 123,
                        name: 'Dummy entry',
                        type: 'Loading failed',
                        url: 'Loading failed',
                        description: 'Loading failed'
                    }]
                });
            }.bind(this)
        });
    },
    componentDidMount: function() {
    },
    render: function() {
        var columns = _.map(this.props.columns, function(column, i) {
            return (<td key={i}>{column.value}</td>);
        }.bind(this));

        var items = _.map(this.props.items, function(item) {
            return <ListItem key={item.id} item={item} columns={this.props.columns}/>
        }.bind(this));

        return (
            <Table hover>
                <thead>
                    <tr>
                        {columns}
                    </tr>
                </thead>
                <tbody>
                    {items}
                </tbody>
            </Table>
        );
    }
});

module.exports = {
    List: List,
    ListItem: ListItem
};