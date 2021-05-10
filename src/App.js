import './App.css';
import axios from "axios";
import Button from "@material-ui/core/Button";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import {useEffect, useState} from "react";
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import {makeStyles} from '@material-ui/core/styles';
import {CircularProgress, Grid, Typography} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from '@material-ui/core/IconButton';



const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:"column",
    margin: theme.spacing(5)
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    margin: theme.spacing(5)
  },
  dataGridContainer:{
    width:"100%",
  },
  paper: {
    width: '30%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  table:{
    backgroundColor: theme.palette.secondary.main,
  }
}));


function App() {
  const classes = useStyles();
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [isEditing,setIsEditing]=useState(false);
  const [catsData,setCatsData]=useState({});
  const [cat, setCat] = useState({
    name:'',
    breed:'',
    weight:'',
    age:''
  })
  const [count,setCount]=useState(0);

  useEffect(() => {
    axios.get('http://18.218.203.178:5000/cats')
        .then(response => {
          const {data}=response;
          setCatsData(data);
        })
        .catch((error) => {
          console.log('Error:',error);
        })
  },[count])

  const handleCat = () => {
    axios.post("http://18.218.203.178:5000/cats",cat)
        .then(res => {
          setCount(count+1);
        })
        .catch(err => console.log('Error',err))
  }

  const handleEdit = () => {

    axios.put(`http://18.218.203.178:5000/cats/${cat.name}`,cat)
        .then(() =>{
          setCount(count+1);

          handleModalClose();
        })
        .catch(error => {
          console.log('Error',error);
        })
  }

  const handleDeleteItem = (row) => {
    const item=(catsData.find(row2 => row2.name===row.name));
    axios.delete(`http://18.218.203.178:5000/cats/${item.name}`)
        .then(() => {
          console.log('Deleted item!');
          // setCount(count+1);

        })
        .catch((error) => {
          console.log('Error:',error);

        })
  }

  const handleModalOpen = () => {
    setIsModalOpened(true);

  };

  const handleModalClose = () => {
    setIsModalOpened(false);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    setCat({...cat, [e.target.name]:e.target.value});
  }


  const handleAddItem = () => {
    setCat({
      name:'',
      breed:'',
      weight:'',
      age:''
    })
    setIsEditing(false);
    handleModalOpen();
  }

  const handleEditItem = (row) => {
    const item=(catsData.find(row2 => row2.id===row.id));
    setCat({
      name:item.name,
      breed:item.breed,
      weight:item.weight,
      age:item.age
    });
    setIsEditing(true);
    handleModalOpen();
  }

  return (
      <div className={classes.container}>
        <Typography variant="h3" component="h2">
          Cats
        </Typography>
        <div className={classes.buttonContainer}>

          <Button
              variant="contained"
              color="secondary"
              className={'my-food-add-button'}
              startIcon={<AddCircleOutlineIcon/>}
              onClick={handleAddItem}
          >
            Add cat
          </Button>
        </div>

        <div className={classes.dataGridContainer}>
          <TableContainer component={Paper}>
            <Table >
              <TableHead className={classes.table} >
                <TableRow color="secondary">

                  <TableCell>Name</TableCell>
                  <TableCell align="right">Breed&nbsp;</TableCell>
                  <TableCell align="center">Description&nbsp;</TableCell>
                  <TableCell align="right">Weight&nbsp;</TableCell>
                  <TableCell align="right">Age&nbsp;</TableCell>
                  <TableCell align="right">Edit&nbsp;</TableCell>
                  <TableCell align="right">Delete&nbsp;</TableCell>


                </TableRow>
              </TableHead>
              <TableBody>
                {catsData ? Object.values(catsData).map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell component="th" scope="row">
                        {cat.name}
                      </TableCell>
                      <TableCell align="right">{cat.breed}</TableCell>
                      <TableCell align="center">{cat.description}</TableCell>
                      <TableCell align="right">{cat.weight}</TableCell>
                      <TableCell align="right">{cat.age}</TableCell>
                      <TableCell align={"right"}><Tooltip title={"Edit this item"}>
                        <IconButton aria-label={"edit cat"}>
                          <EditIcon onClick={() => handleEditItem(cat)}/>
                        </IconButton>
                      </Tooltip></TableCell>
                      <TableCell align={"right"}><Tooltip title={"Delete this item"}>
                        <IconButton aria-label={"delete product"}>
                          <DeleteIcon onClick={() => handleDeleteItem(cat)} />
                        </IconButton>
                      </Tooltip></TableCell>
                    </TableRow>
                )): <CircularProgress />}

              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={isModalOpened}
            onClose={handleModalClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
        >
          <Fade in={isModalOpened}>
            <div className={classes.paper}>
              <div className="modal-header">Add cat</div>
              <form className={classes.form} noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Name"
                        name="name"
                        value={cat.name}
                        onChange={handleInputChange}
                        autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="breed"
                        label="Breed"
                        name="breed"
                        value={cat.breed}
                        onChange={handleInputChange}
                        autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="weight"
                        label="Weight"
                        name="weight"
                        value={cat.weight}
                        onChange={handleInputChange}
                        autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="age"
                        label="Age"
                        name="age"
                        value={cat.age}
                        onChange={handleInputChange}
                        autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} direction={"row"} justify={"center"} alignItems={"center"}>
                    {isEditing ? <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        className={classes.submit}
                        onClick={handleEdit}
                    >
                      Edit cat
                    </Button> :
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            className={classes.submit}
                            onClick={handleCat}
                        >
                          Add cat
                        </Button>}

                  </Grid>


                </Grid>

              </form>
            </div>
          </Fade>
        </Modal>
      </div>
  );
}

export default App;
