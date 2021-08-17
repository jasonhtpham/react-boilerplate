import React, { useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, TablePagination, Checkbox, IconButton, Toolbar, Button, Grid, Switch, TableSortLabel } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { TextHelper } from 'helpers/index';
import { makeStyles } from '@material-ui/styles';

const Selector = (props) => {
  const [initData, setInitData] = useState(false);
  return (
    <div>
      <Checkbox
        checked={Boolean(initData)}
        color="secondary"
        onChange={() => {
          props.toggle(props.selectedObject, initData);
          setInitData(!initData);
        }
        }
      />
    </div>
  );
};
Selector.propTypes = {
  selectedObject: PropTypes.any,
  toggle: PropTypes.func,
};

const ActionButtonSwitch = (props) => {
  const [check, setCheck] = useState(false);
  useEffect(() => {
    setCheck((props.defaultValue));
  }, [props.defaultValue]);
  return (
    < Switch
      checked={check}
      onChange={(e) => {
        setCheck(!check);
        props.function(e);
      }}
      value={check}
      inputProps={{ 'aria-label': 'secondary checkbox' }
      }
    />
  );
};
ActionButtonSwitch.propTypes = {
  defaultValue: PropTypes.any.isRequired,
  function: PropTypes.func.isRequired
};
const ActionButton = (props) => {
  return (
    < Button
      variant={"outlined"}
      onClick={(e) => props.function(e)
      }
    >
      {props.label !== undefined ? props.label : 'Click Me!'}
    </ Button>
  );
};
ActionButton.propTypes = {
  label: PropTypes.string.isRequired,
  function: PropTypes.func.isRequired
};

const arrayDiff = (arrayA, arrayB) => {
  var result = [];
  for (var i = 0; i < arrayA.length; i++) {
    if (arrayB.indexOf(arrayA[i]) <= -1) {
      result.push(arrayA[i]);
    }
  }
  return result;
};

const breakObject = (obj) => {
  if (obj === null || obj === undefined) return 'No Data';
  if (!Array.isArray(obj)) return null;
  if (obj[0] === undefined) return 'No Data';
  if (obj[0] === null) return 'No Data';
  if (obj[0] instanceof Object) {
    let _keys = Object.keys(obj[0]);
    return (
      <Table>
        <TableHead>
          <TableRow>
            {_keys.map((value) => {
              return (
                <TableCell key={Math.random()}>
                  {value}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {
            obj.map(value => {
              return (<TableRow key={Math.random()}>{
                _keys.map((valueA) => {
                  return (<TableCell key={Math.random()}>
                    <Typography varient="body1">
                      {Array.isArray(value[valueA]) ? breakObject(value[valueA]) : String(value[valueA])}
                    </Typography>
                  </TableCell>);
                })
              }
              </TableRow>);
            })}
        </TableBody>
      </Table>
    );
  }
  else
    return (obj.map((value, i) => {
      return (<>
        <Typography>
          {value}
        </Typography>
        {i < obj.length - 1 ? <br /> : null}
      </>);
    }));
};

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(0),
    overflowX: 'auto'
  },
  tableWrapper: {
    overflow: 'auto',
    maxHeight: 407
  },
  table: {
    minWidth: 650,
  },
  spacer: {
    flex: '1 1 100%',
  },
  title: {
    flex: '0 0 auto',
  },
  actions: {
    float: 'right'
  }
}));

const useStyles1 = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5),
  },
}));

const TablePaperWrapper = (props) => {
  const classes = useStyles();
  if (props.disableContainer)
    return <div className={classes.root}  >
      {props.children}
    </div>;
  return <Paper className={classes.root} >
    {props.children}
  </Paper>;
};

TablePaperWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  disableContainer: PropTypes.bool.isRequired
};

const Heading = (props) => {
  return (<TableCell
    sortDirection={!props.sortAssending ? 'desc' : 'asc'}
    align={(props.align !== undefined ? props.align : "left")}
  >
    {
      props.sort ?
        <TableSortLabel
          active={props.value === props.selectedSortVariable}
          direction={!props.sortAssending ? 'desc' : 'asc'}
          onClick={(e) => props.onSortChange instanceof Function && props.onSortChange(e, props.value)}
        >
          {props.titleCase ? TextHelper.titleCase(props.value) : props.value}
        </TableSortLabel>
        : <strong>{props.titleCase ? TextHelper.titleCase(props.value) : props.value}</strong>
    }

  </TableCell>);
};
Heading.propTypes = {
  styles: PropTypes.object,
  align: PropTypes.string,
  sort: PropTypes.bool,
  titleCase: PropTypes.bool,
  selectedSortVariable: PropTypes.string,
  onSortChange: PropTypes.func,
  value: PropTypes.string.isRequired,
  sortAssending: PropTypes.bool,
};

const TableHeader = (props) => {
  const classes = useStyles();

  if (props.disable) return null;
  return <Toolbar>
    <div className={classes.title}>
      {props.selecteditems.length !== 0 ?
        <Typography color="black" variant="tableTitle">
          {props.selecteditems.length} selected
        </Typography>
        :
        <Typography variant="h6" id="tableTitle">
          {props.title !== undefined ? props.title : 'EnhancedTable'}
        </Typography>
      }
    </div>
    <div className={classes.spacer} />
    {
      props.options && <Grid container spacing={1} direction="row" justifyContent="flex-end" alignItems="flex-end">
        {props.options.toolbarActions !== undefined ?
          props.options.toolbarActions.map((value, i) => {
            if (value === undefined || value === false) return null;
            return (<Grid item key={'toolbarAction' + i}>
              <Button color="primary" size="small"
                onClick={(e) => value.function(e, props.selecteditems)} variant="contained"
              >{value.label}
              </Button>
            </Grid>);
          })
          : null
        }
      </Grid>
    }
  </Toolbar >;
};

TableHeader.propTypes = {
  title: PropTypes.string.isRequired,
  disable: PropTypes.bool.isRequired,
  selecteditems: PropTypes.arrayOf(PropTypes.object).isRequired,
  options: PropTypes.shape({
    toolbarActions: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        function: PropTypes.func
      })
    ),

  })
};


const TableHeading = (props) => {

  const renderHeader = useCallback(() => {
    return props.keys.map((key, i) => {
      return <Heading key={`heading_${i}`}
        align={props.data[key] instanceof Number ? 'right' : 'left'}
        titleCase={props?.options?.titleCaseHeadings}
        value={key}
        {...props.sort}
      />;
    });
  }, [props.keys, props.data, props?.options?.titleCaseHeadings, props?.sort]);

  const renderActionHeaders = () => {
    return props.options.actions.map((value, i) => {
      if (value === false) return null;
      return <Heading
        key={`actionHeading_${i}`}
        value={props?.options?.titleCaseHeadings ? TextHelper.titleCase(value.name) : value.name} />;
    });
  };

  return <TableHead >
    <TableRow >
      {(props?.options?.selector && (props.options.toolbarActions !== undefined ?
        <Heading key={Math.random()} value={'selection'} /> : null))}
      {(props?.options?.actionLocation === 'start' ? (props?.options?.actions !== undefined ?
        renderActionHeaders() : null) : null)}
      {renderHeader()}
      {(props?.options?.actionLocation !== 'start' ?
        (props?.options?.actions !== undefined ?
          renderActionHeaders() : null)
        : null)}
    </TableRow>
  </TableHead>;
};

TableHeading.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  options: PropTypes.shape({
    actionLocation: PropTypes.oneOf(['start', 'end']),
    selector: PropTypes.bool,
    toolbarActions: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        function: PropTypes.func
      })
    ),
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        label: PropTypes.string,
        type: PropTypes.oneOf(['switch', 'button']),
        defaultValueFrom: PropTypes.string,
        function: PropTypes.func
      })
    ),
    titleCaseHeadings: PropTypes.bool,
  }),
  keys: PropTypes.arrayOf(PropTypes.string),
  sort: PropTypes.shape({
    sort: PropTypes.bool,
    selectedSortVariable: PropTypes.string,
    onSortChange: PropTypes.func,
    sortAssending: PropTypes.bool,
  })
};

const TableErrorAndEmptyRows = (props) => {
  if (props.error)
    return (< TableRow style={{ height: 48 * 5 }} >
      <TableCell colSpan={5} style={{ color: 'red', fontWeight: '500' }}>
        <Grid container spacing={0}
          align="center"
          justify="center">
          <Grid item xs={12}>
            <Typography>{props.errorText}</Typography>
          </Grid>
        </Grid></TableCell>
    </TableRow >);
  if (props.emptyRows() > 0 && !(props.options && props.options.ui && props.options.ui.disableContainer))
    return (<TableRow style={{ height: 48 * props.emptyRows() }} >
      <TableCell
        colSpan={(props.options !== undefined ?
          props.options.selector ?
            props.options.actions !== undefined ?
              props.keys.length + 1 + props.options.actions.filter(value => value !== false).length
              : props.keys.length + 1 :
            props.options.actions !== undefined ?
              props.keys.length + props.options.actions.filter(value => value !== false).length
              : props.keys.length :
          props.keys.length)} />
    </TableRow >);
  else return null;
};

TableErrorAndEmptyRows.propTypes = {
  error: PropTypes.bool.isRequired,
  errorText: PropTypes.string,
  emptyRows: PropTypes.func.isRequired,
  keys: PropTypes.arrayOf(PropTypes.string),
  options: PropTypes.shape({
    ui: PropTypes.shape({
      disableContainer: PropTypes.bool,
    }),
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        label: PropTypes.string,
        type: PropTypes.oneOf(['switch', 'button']),
        defaultValueFrom: PropTypes.string,
        function: PropTypes.func
      })
    ),
  })
};

const RenderRow = (props) => {
  return props.keys.map((key) => {
    return (<TableCell style={props.styles !== undefined ? props.styles.tableCell !== undefined ? props.styles.tableCell : null : null} key={Math.random()}>
      <Typography varient="body1">
        {Array.isArray(props.data[key]) ?
          breakObject(props.data[key]) :
          String(props.data[key])}
      </Typography>
    </TableCell>);
  });
};

RenderRow.propTypes = {
  keys: PropTypes.array.isRequired,
  data: PropTypes.any,
};


const TableRows = (props) => {
  let prepareCurrentRowData = useCallback(() => {
    if (props.data === undefined) return [];
    let _data = props.data;
    if (props.sort?.sort) {
      _data.sort((a, b) => {
        if (a[props.sort.selectedSortVariable] === b[props.sort.selectedSortVariable]) return 0;
        if (props.sort.sortAssending !== true) {
          if (a[props.sort.selectedSortVariable] > b[props.sort.selectedSortVariable]) return -1;
          else return 1;
        }
        else {
          if (a[props.sort.selectedSortVariable] > b[props.sort.selectedSortVariable]) return 1;
          else return -1;
        }
      });
    }
    if (props?.options?.disablePagination) {
      return _data;
    }
    return _data.slice(props.page * props.rowsPerPage, props.page * props.rowsPerPage + props.rowsPerPage);
  }, [props.data, props?.options?.disablePagination, props.page, props.rowsPerPage, props.sort]);
  const [currentRowData, setCurrentRowData] = useState([]);
  useEffect(() => {
    let data = prepareCurrentRowData();
    setCurrentRowData(data);
  }, [prepareCurrentRowData]);


  const renderActions = useCallback((__obj) => {
    let defaultValue;
    if (props?.options?.actions !== undefined) {
      return props.options.actions.map(value => {
        if (value === false) return null;
        defaultValue = value.defaultValueFrom !== undefined ? __obj[value.defaultValueFrom] : false;
        return (<TableCell key={Math.random()}>
          {value.type === 'switch' ?
            < ActionButtonSwitch key={Math.random()} defaultValue={defaultValue} function={(e) => value.function(e, __obj)} /> :
            <ActionButton key={Math.random()} label={value.label} function={(e) => value.function(e, __obj)} />
          }
        </TableCell>
        );
      });
    }
  }, [props.options]);

  if (props.data === undefined || props.data === null) return null;
  return currentRowData.map((row, index) => {
    return <TableRow key={`TableRow_${index}`}>
      {(props?.options?.selector ?
        (props?.options?.toolbarActions !== undefined ?
          <TableCell key={index + "select"}>
            <Selector selectedObject={currentRowData[index]} />
          </TableCell> : null) : null)}
      {(props.options !== undefined ? props.options.actionLocation === "start" ?
        (props.options.actions !== undefined ? renderActions(currentRowData[index]) : null)
        : null : null)}
      <RenderRow key={`TableRowData_${index}`}
        page={props.page} data={row}
        keys={props.keys}
      />
      {(props.options !== undefined ?
        props.options.actionLocation !== "start" ? (props.options.actions !== undefined ?
          renderActions(currentRowData[index]) : null) : null : null)}
    </TableRow>;
  });
};
TableRows.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  keys: PropTypes.arrayOf(PropTypes.string),
  options: PropTypes.shape({
    disablePagination: PropTypes.bool,
    selector: PropTypes.bool,
    actionLocation: PropTypes.oneOf(['start', 'end']),
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        label: PropTypes.string,
        type: PropTypes.oneOf(['switch', 'button']),
        defaultValueFrom: PropTypes.string,
        function: PropTypes.func
      }),
    ),
    toolbarActions: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        function: PropTypes.func
      })
    ),
  }),
  sort: PropTypes.shape({
    sort: PropTypes.bool,
    selectedSortVariable: PropTypes.string,
    sortAssending: PropTypes.bool,
  })
};



const TablePaginationComponent = (props) => {
  const TablePaginationActions = () => {
    const classes = useStyles1();
    const theme = useTheme();
    const handleFirstPageButtonClick = () => {
      if (props.options === undefined)
        return props.setPage(0);
      if (!props.options.disablePaginationDefaults)
        props.setPage(0);
      if (props?.options?.pagination?.onFirstButtonClick instanceof Function)
        props.options.pagination.onFirstButtonClick();

    };
    const handleBackButtonClick = () => {
      if (props.options === undefined)
        return props.setPage(page => page - 1);
      if (!props.options.disablePaginationDefaults)
        props.setPage(page => page - 1);
      if (props?.options?.pagination?.onBackButtonClick instanceof Function) {
        props.options.pagination.onBackButtonClick();
      }
    };
    const handleNextButtonClick = () => {
      if (props.options === undefined)
        return props.setPage(page => page + 1);
      if (!props.options.disablePaginationDefaults)
        props.setPage(page => page + 1);
      if (props?.options?.pagination?.onNextButtonClick instanceof Function) {
        props.options.pagination.onNextButtonClick();
      }
    };
    const handleLastPageButtonClick = () => {
      if (props.options === undefined)
        return props.setPage(Math.max(0, Math.ceil(props.data.length / props.rowsPerPage) - 1));
      if (!props.options.disablePaginationDefaults)
        props.setPage(Math.max(0, Math.ceil(props.data.length / props.rowsPerPage) - 1));
      if (props?.options?.pagination?.onLastButtonClick instanceof Function) {
        props.options.pagination.onLastButtonClick();
      }
    };
    return (
      <div className={classes.root}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={props.page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton onClick={handleBackButtonClick} disabled={props.page === 0} aria-label="previous page">
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={props.page >= Math.ceil((props.data !== undefined && props.data !== null ?
            props.data.length : 0) / props.rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={props.page >= Math.ceil((props.data !== undefined && props.data !== null ?
            props.data.length : 0) / props.rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  };

  const handleChangeRowsPerPage = useCallback((event) => {
    props.setRowsPerPage(parseInt(event.target.value, 10));
    props.setPage(0);
  }, [props]);

  if (props?.options?.disablePagination)
    return null;
  return <TablePagination
    component="div"
    rowsPerPageOptions={props.rowsPerPageOptions}
    rowsPerPage={props.rowsPerPage}
    page={props.page}
    onRowsPerPageChange={handleChangeRowsPerPage}
    onChangePage={() => { }}
    count={(props.data !== undefined && props.data !== null ? props.data.length : 0)}
    SelectProps={{
      inputProps: { 'aria-label': 'rows per page' },
      native: true
    }}
    ActionsComponent={TablePaginationActions}
  />;
};

TablePaginationComponent.propTypes = {
  options: PropTypes.shape({
    disablePagination: PropTypes.bool,
    disablePaginationDefaults: PropTypes.bool,
    pagination: PropTypes.shape({
      disable: PropTypes.bool,
      onFirstButtonClick: PropTypes.func,
      onBackButtonClick: PropTypes.func,
      onNextButtonClick: PropTypes.func,
      onLastButtonClick: PropTypes.func,
    }),
  }),
  rowsPerPageOptions: PropTypes.array,
  rowsPerPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  handleChangeRowsPerPage: PropTypes.func,
  data: PropTypes.arrayOf(PropTypes.object),
  setPage: PropTypes.func.isRequired,
  setRowsPerPage: PropTypes.func.isRequired
};


export const EnhancedTable = (props) => {
  const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing(0),
      overflowX: 'auto'
    },
    tableWrapper: {
      maxHeight: props?.options?.ui?.maxHeight || 407,
      overflowY: 'auto',
      '-webkit-overflow-scrolling': 'touch',
    },
    table: {
      minWidth: props?.options?.ui?.minWidth || 650,
    },
    spacer: {
      flex: '1 1 100%',
    },
    title: {
      flex: '0 0 auto',
    },
    actions: {
      float: 'right'
    },
  }));
  const classes = useStyles();
  var selecteditems = useMemo(() => [], []);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(props.rows !== undefined ? props.rows : 5);
  const [rowsPerPageOptions, setRowsPerPageOptions] = useState([]);
  const [keys, setKeys] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [sortAccending, setSortAccending] = useState(true);

  useEffect(() => {
    let rowsPP = 10;
    if (props?.options?.rowsPerPage) rowsPP = props?.options?.rowsPerPage;
    var _tempArray = [];
    var _counterLimit = Math.floor((props?.data?.length || 0) / rowsPP);
    for (var i = 0; i <= _counterLimit; i++) {
      _tempArray.push(rowsPP * (i + 1));
    }
    setRowsPerPageOptions(_tempArray);
  }, [props.options.rowsPerPage, props.data]);

  useEffect(() => {
    const ignoreKeys = () => {
      if (props.data === undefined) return [];
      let _keys = Object.keys(props.data[0]);
      if (props.options !== undefined)
        if (props.options.ignoreKeys === undefined) {
          setKeys(_keys);
        } else setKeys(arrayDiff(_keys, props.options.ignoreKeys));
      else setKeys(_keys);
    };
    if (props.data !== undefined && props.data !== null)
      if (props.data.length > 0) {
        ignoreKeys();
      }
  }, [props.data, props.options]);


  useEffect(() => {
    setSortBy(keys[0]);
  }, [keys]);

  const emptyRows = useCallback(() => {
    return rowsPerPage - Math.min(rowsPerPage, (props.data !== undefined && props.data !== null ? props.data.length : 0)
      - page * rowsPerPage);
  }, [rowsPerPage, props.data, page]);




  if (props.data === undefined || props.data === null)
    return <div>Irrevelant data.</div>;
  return <TablePaperWrapper
    disableContainer={props.options?.ui?.disableContainer} >
    <TableHeader {...props} keys={keys} disable={props.options?.ui?.disableTitle} selecteditems={selecteditems} />
    <div className={classes.tableWrapper}>
      <Table className={classes.table} stickyHeader={props.options !== undefined ? props.options.selector ? true : false : false} >
        <TableHeading {...props} keys={keys} sort={{
          onSortChange: (event, value) => {
            if (sortBy !== value) {
              setSortBy(value);
              setSortAccending(true);
            } else {
              setSortAccending(sortAssending => !sortAssending);
            }
          },
          sort: props.options?.enableSort,
          selectedSortVariable: sortBy || keys[0],
          sortAssending: sortAccending
        }} />
        <TableBody className={classes.tableBody}>
          <TableRows keys={keys} page={page} rowsPerPage={rowsPerPage} {...props} sort={{
            sort: props.options?.enableSort,
            selectedSortVariable: sortBy || keys[0],
            sortAssending: sortAccending
          }} />
          <TableErrorAndEmptyRows emptyRows={emptyRows} keys={keys} {...props} />
        </TableBody>
      </Table>
    </div>
    <TablePaginationComponent {...props}
      page={page} rowsPerPage={rowsPerPage} rowsPerPageOptions={rowsPerPageOptions}
      setPage={setPage} setRowsPerPage={setRowsPerPage} />
  </TablePaperWrapper>;

};


EnhancedTable.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  rows: PropTypes.number,
  error: PropTypes.bool,
  errorText: PropTypes.string,
  options: PropTypes.shape({
    rowsPerPage: PropTypes.number,
    enableSort: PropTypes.bool,
    ignoreKeys: PropTypes.arrayOf(PropTypes.string),
    selector: PropTypes.bool,
    actionLocation: PropTypes.oneOf(['start', 'end']),
    titleCaseHeadings: PropTypes.bool,
    ui: PropTypes.shape({
      disableContainer: PropTypes.bool,
      disableTitle: PropTypes.bool,
      maxHeight: PropTypes.any,
      minWidth: PropTypes.any,
    }),
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        label: PropTypes.string,
        type: PropTypes.oneOf(['switch', 'button']),
        defaultValueFrom: PropTypes.string,
        function: PropTypes.func
      })
    ),
    toolbarActions: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        function: PropTypes.func
      })
    ),
    disablePaginationDefaults: PropTypes.bool.isRequired,
    pagination: PropTypes.shape({
      disable: PropTypes.bool.isRequired,
      onFirstButtonClick: PropTypes.func,
      onBackButtonClick: PropTypes.func,
      onNextButtonClick: PropTypes.func,
      onLastButtonClick: PropTypes.func,
    }),
  })
};