var React = require('react'),
    {Button} = require('react-bootstrap'),
    _ = require('lodash');

module.exports = React.createClass({
    getInitialState: function() {
        return this.props.paging || {};
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState(nextProps.paging);
    },
    previousPage(e) {
        e.preventDefault();
        this.props.onPage({skip: Math.max(this.state.skip - 10, 0), limit: 10});
    },
    nextPage(e) {
        e.preventDefault();
        this.props.onPage({skip: Math.min(this.state.skip + 10, this.state.total - 1), limit: 10});
    },
    render: function() {
        var prev = this.state.skip > 0 ? <Button ref={prev} onClick={this.previousPage}>PREVIOUS</Button> : null;
        var next = this.state.total > this.state.skip + this.state.count ? <Button ref={next} className="pull-right" onClick={this.nextPage}>NEXT</Button> : null;

        return (
            <div>
                {prev}
                {next}
            </div>
        );
    }
});
