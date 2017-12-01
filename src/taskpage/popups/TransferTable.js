import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow, TablePagination, TableFooter } from 'material-ui/Table';
import Paper from 'material-ui/Paper';

class TransferTable extends Component {
  componentWillMount() {
    if(this.props.userLevel === 2) {
      this.getGroupUserList();
    } else if(this.props.userLevel === 3) {
      this.getUserList();
    }
  }
  render() {
    return (
      <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        </TableBody>
      </Table>
    </Paper>
    )
  }
}

export default TransferTable;
