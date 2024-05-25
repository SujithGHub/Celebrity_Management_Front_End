import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Grid, Paper, styled } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../util/Interceptor";
import TopicModal from "../util/TopicModal";
import AddCategory from "./AddCategory";
function AddTopics(category) {
  const [topic, setTopic] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [open, setOpen] = React.useState(false);
  const [selectedTopic, setSelectedTopic] = useState([]);
  const [postTopic, setPostTopic] = useState([]);
  const [add, setAdd] = useState(false);
  const handleClose = () => setOpen(false);

  const handleOpen = (row) => {
    setSelectedTopic(row?.row);
    setAdd(row?.row ? false : true);
    setOpen(true);
  };

  useEffect(() => {
    getAllTopics();
  }, []);

  //topics
  const getAllTopics = () => {
    axiosInstance.get(`/topics/get-all-topic`).then((res) => {
      setTopic(res);
      console.log(res, "topics");
    });
  };
  const setAllTopics = () => {
    selectedTopic?axiosInstance.post(`/topics/add`, selectedTopic).then((res) => {
      toast.success("Topic added Successfully");
      setPostTopic(res);
      setOpen(false);
      getAllTopics();
    }):toast.error("This Field is Empty")
  };
  const deletehandler = (e, id) => {
    console.log(id,"id");
    axiosInstance.delete(`/topics/remove/${id}`).then((res) => {
      toast.success("Deleted Successfully");
      getAllTopics();
    });
  };
  const changeHandler = (e) => {
    setSelectedTopic((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const combinedRows = topic.map((topicItem, index) => {
    const categoryItem = category[index] || {};
    return { ...topicItem, ...categoryItem };
  });
  // const checkDisabled =()=>{
  //   return selectedTopic?false:true
  // }
  const columns = [
    {
      field: "id",
      headerName: "S.No",
      headerClassName: "super-app-theme--header",
      type: "string",
      minWidth: 80,
      maxWidth: 90,
      flex: 1,
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
      headerName: "Topics Name",
      headerClassName: "super-app-theme--header",
      type: "string",
      minWidth: 100,
      maxWidth: 400,
      flex: 2,
      editable: false,
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
      align: "left",
      headerAlign: "center",
      renderCell: (row) => {
        return (
          <>
            <Button color="success" onClick={() => handleOpen(row)}>
              <EditIcon color="primary" />
            </Button>
            <Button onClick={(e) => deletehandler(e, row?.row?.id)}>
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
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <Item style={{ display: "flex",justifyContent:'space-between',alignItems:'center' }}>
            <h2 style={{fontWeight:'bolder'}}>Topics</h2>
            <Button
              style={{
                backgroundColor: "rgb(245, 130, 31)",
                color: "white",
                height:'2rem',
              }}
              onClick={() => handleOpen()}
            >
              ADD
            </Button>
          </Item>

          <DataGrid
            rows={combinedRows}
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
            <TopicModal
              open={open}
              handleClose={handleClose}
              topic={topic}
              selectedTopic={selectedTopic}
              changeHandler={changeHandler}
              title={add}
              setAllTopics={setAllTopics}
            />
          )}
        </Grid>
        <Grid item xs={6}>
          <AddCategory />
        </Grid>
      </Grid>
    </div>
  );
}

export default AddTopics;
