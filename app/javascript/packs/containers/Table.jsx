import React from 'react';
import { connect } from 'react-redux'
import Table from '../components/Table'
import { editFilter, changePage, changePageSize, pageLoaded } from '../redux/Actions'
import { GET_ITEMS } from '../graphql/queries';
import { Query } from 'react-apollo';

const mapStateToProps = (state) => {
  return {
    filters: state.filters,
    page: state.pageInfo.page,
    pageSize: state.pageInfo.pageSize,
    pageFilterName: state.pageInfo.filterName,
    pageStartCursor: state.pageInfo.startCursor,
    pageEndCursor: state.pageInfo.endCursor,
    totalCount: state.pageInfo.totalCount
  }
}

const mapDispatchToProps = dispatch => {
  return {
    handleSortChange: (newSorted, column) => {
      const sortField = newSorted[0].id;
      const sortDirection = newSorted[0].desc ? 'desc' : 'asc';
  
      dispatch(editFilter('order_by', `${sortField} ${sortDirection}`));
    },
    handlePageSizeChange: pageSize => {
      dispatch(changePageSize(pageSize));
    }
    ,
    handlePageChange: (startCursor, endCursor, page) => {
      dispatch(changePage(page, startCursor, endCursor));
    }
  }
}

const TableContainer = (props) => {
  const { 
    filters, 
    totalCount,
    page,
    pageSize, 
    pageFilterName,
    pageEndCursor,
    pageStartCursor,
    handleSortChange, 
    handlePageSizeChange, 
    handlePageChange
  } = props;

  const pageFilters = {}

  if (pageFilterName === 'before'){
    pageFilters['before'] = pageStartCursor;
    pageFilters['last'] = pageSize
  }else{
    pageFilters['after'] = pageEndCursor;
    pageFilters['first'] = pageSize;
  }

  return (
    <Query 
      query={GET_ITEMS}
      variables={Object.assign({}, filters, pageFilters)}>
      {
        ({loading, error, data, refetch}) => {
          return (
            <Table 
              data={data} 
              loading={loading} 
              error={error}
              page={page}
              pageSize={pageSize}
              totalCount={totalCount}
              handleSortChange = {handleSortChange}
              handlePageSizeChange = {handlePageSizeChange}
              handlePageChange = {handlePageChange}
            />
          )
        }
      }
    </Query>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TableContainer);