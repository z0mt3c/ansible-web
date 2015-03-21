var React = require('react'),
    { Pager, PageItem} = require('react-bootstrap');

module.exports = React.createClass({
    propTypes: {
        onChange: React.PropTypes.func.isRequired,
        limit: React.PropTypes.number,
        page: React.PropTypes.object
    },
    getInitialState: function() {
        return this.props.page;
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState(nextProps.page);
    },
    previousPage() {
        var skip = Math.max(this.state.skip - this.props.limit, 0);
        this.props.onChange(skip);
    },
    nextPage() {
        var skip = Math.min(this.state.skip + this.props.limit, this.state.total - 1);
        this.props.onChange(skip);
    },
    render: function() {
        var prev = this.state.skip > 0 ? <PageItem previous onSelect={this.previousPage}>&larr; Previous Page</PageItem> : null;
        var next = this.state.total > this.state.skip + this.state.count ? <PageItem next onSelect={this.nextPage}>Next Page &rarr;</PageItem> : null;

        return (
            <Pager>
                {prev}
                {next}
            </Pager>
        );
    },
    getDefaultProps: function() {
        return {
            limit: 10,
            page: {}
        };
    }
});
