var React = require('react'),
    Icon = require('react-fa/dist/Icon');

module.exports = React.createClass({
    propTypes: {
        field: React.PropTypes.string.isRequired,
        sort: React.PropTypes.string,
        onSort: React.PropTypes.func
    },
    onClick: function(e) {
        e.preventDefault();
        var field = this.props.field;
        var isASC = this.props.sort === '+' + field;
        this.props.onSort((isASC ? '-' : '+') + field);
    },
    render: function() {
        var field = this.props.field;
        var sort = this.props.sort;
        var onClick = this.props.onSort ? this.onClick : undefined;
        var className = this.props.onSort ? 'sortable' : undefined;

        if (sort.length === field.length + 1 && sort.indexOf(field) === 1) {
            var indicator = sort.substr(0, 1) === '-' ? 'sort-down' : 'sort-up';
            return (<span onClick={onClick} className={className}>{this.props.children} <Icon name={indicator} /></span>);
        } else {
            return (<span onClick={onClick} className={className}>{this.props.children}</span>);
        }
    }
});
