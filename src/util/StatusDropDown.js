import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';

function BasicMenu(props) {

  const getStatusColor = (status) => {
    return (
      status === 'all' ? 'warning' : status === 'pending' ? 'info' : status === 'accepted' ? 'success' : 'error'
    )
  }

  const getStyles = (status) => {
    if (status){
      return {paddingLeft: '10px', paddingRight: '6px', width: '120px'}
    } else {
      return {paddingLeft: '10px', paddingRight: '6px', width: '110px', background:'#f5821f'}
    }
  }

  const getStatus = (status) => {
    return (
      status === 'all' ? <span className='filter-text'>ALL</span> : status === 'pending' ? <span className='filter-text'>Pending</span> : status === 'accepted' ? <span className='filter-text'>Accepted</span> : <span className='filter-text'>Rejected</span>
    )
  }

  const getButtonName = (name) => {
    return name;
  }


  return (
    <div>
      <Button
        id="basic-button"
        title='Filter'
        style={getStyles(props?.status)}
        aria-controls={props.openMenu ? 'basic-menu' : undefined}
        aria-haspopup="true"
        variant='contained'
        color={props.status ? getStatusColor(props.status) : "primary"}
        aria-expanded={props.openMenu ? 'true' : undefined}
        onClick={props.handleClick}
      >
        {props.status ? getStatus(props?.status) : getButtonName(props?.buttonName)}<FilterAltOutlinedIcon />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={props.anchorEl}
        open={props.openMenu}
        onClose={props.handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {props.dropDownItem.map(item => {
          return (
            <MenuItem style={{justifyContent: 'center', alignItems: 'center'}} value={item} key={item} onClick={(event) => props.handleMenuClose(event, item)}>{item}</MenuItem>
          )
        })}
      </Menu>
    </div>
  );
}

export default React.memo(BasicMenu)
