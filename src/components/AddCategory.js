import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Grid, Paper, styled } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CategoryModal from "../util/CategoryModal";
import axiosInstance from "../util/Interceptor";

function AddCategory() {
  const [category, setCategory] = useState([]);
  const [, setAddCategory] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [add, setAdd] = useState(false);
  const [selectedCategory, setSelectedCategories] = useState([]);
  const [pageSize, setPageSize] = useState(5);

  const handleClose = () => setOpen(false);
  const handleOpen = (row,key) => {
    setSelectedCategories(row?.row);
    setAdd(row?.row ? false : true);
    setOpen(true);
  };
  
  useEffect(() => {
    getAllCategories();
  }, []);

  const getAllCategories = () => {
    axiosInstance.get(`/category/get-all-category`).then((res) => {
      setCategory(res);
    }).catch(()=>{});
  };

  const AddCategory = () => {
    selectedCategory ? axiosInstance.post(`/category/add`, selectedCategory).then((res) => {
      setAddCategory(res);
      getAllCategories();
      setOpen(false);
    }).catch((err)=>{}):toast.error("This Field is Empty!!!!")
  };

  const DeleteCategory = (e, id) => {
    axiosInstance.delete(`/category/remove/${id}`).then((res) => {
      toast.success("Category Deleted Successfully");
      getAllCategories();
    }).catch(() => {});
  };

  const changeHandler = (e) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  
  const columns = [
    {
      field: "id",
      headerName: "S.No",
      headerClassName: "super-app-theme--header",
      type: "string",
      minWidth: 80,
      maxWidth: 90,
      editable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const index = params.api.getRowIndex(params.id);
        return index + 1;
      },
    },
    {
      field: "name",
      headerName: "Name",
      headerClassName: "super-app-theme--header",
      type: "string",
      minWidth: 200,
      maxWidth: 400,
      editable: false,
      flex:2,
      headerAlign: "center",
      align: "left",
      valueGetter: (param) => param?.row.name,
    },
    {
      field: "action",
      headerName: "Action",
      headerClassName: "super-app-theme--header",
      flex: 1,
      minWidth: 100,
      maxWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (row) => {
        return (
          <>
            <Button color="success" onClick={() => handleOpen(row,'add')}>
              <EditIcon color="primary" />
            </Button>
            <Button onClick={(e) => DeleteCategory(e, row?.row?.id)}>
              <DeleteIcon color="error" />
            </Button>
          </>
        );
      },
    },
  ];
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));
  return (
    <div>
      <Grid>
        <Item style={{ display: "flex",justifyContent:'space-between',alignItems:'center'}}>
        <h2 style={{fontWeight:'bolder'}}>Categories</h2>
          <Button
            style={{
              backgroundColor: "rgb(245, 130, 31)",
              color: "white",
              height:'2rem'
            }}
            onClick={() => handleOpen()}
          >
            ADD
          </Button>
        </Item>
      </Grid>
      <DataGrid
        rows={category}
        columns={columns}
        pagination
        pageSize={pageSize}
        autoHeight
        rowSelection={false}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[5, 10, 15]}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
      {open && (
        <CategoryModal
          open={open}
          handleClose={handleClose}
          category={category}
          selectedCategory={selectedCategory}
          changeHandler={changeHandler}
          title={add}
          AddCategory={AddCategory}
        />
      )}
    </div>
  );
}

export default AddCategory;
