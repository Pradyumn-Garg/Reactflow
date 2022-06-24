import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Handle,
  useNodes,
  useEdges,
  Background,
  MiniMap
} from 'react-flow-renderer';


import CardMedia from '@mui/material/CardMedia';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import AppBar from '@mui/material/AppBar';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DynamicForm from './DynamicForm';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import generateSQLCode from './sqlcode_generator';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import CardActionArea from '@mui/material/CardActionArea';
import { CardHeader } from '@mui/material';
import image from './images/4.jpg';
import image1 from './images/2.jpg';
import image2 from './images/3.jpg';
import MoreVertIcon from '@mui/icons-material/MoreVert';



const sourceNode = ({ data }) => {
  // console.log(data)
  return (
    <>
      <Handle
        type="source"
        position="right"
        id="a"
        style={{
          background: "green",
          height: "230px",
          position: "absolute",
          width: "20px",
          right: "-10px",
          cursor: "crosshair",
          zIndex: "-1"
        }}
        isConnectable={true}
      />

      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea>
          <CardMedia
            style={{ height: "100px", paddingTop: '0%' }}
            component="img"
            height="40"
            src={image}
            alt="background image"
          />
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {data.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This is a source table.
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>

      {/* <Box
        sx={{
          width: 30,
          height: 30,
          backgroundColor: '#34568B',
          fontSize: "5px",
          '&:hover': {
            backgroundColor: '#92A8D1',
            opacity: [0.9, 0.8, 0.7],
          },
        }}
      >
        {data.name}
      </Box> */}
    </>
  )
}


const destinationNode = ({ data }) => {
  return (
    <>
      <Handle
        type="target"
        position="left"
        style={{
          background: "green",
          height: "230px",
          position: "absolute",
          width: "20px",
          right: "-10px",
          cursor: "crosshair",
          zIndex: "-1",
          marginLeft: "-6.5px"
        }}
        // onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={true}
      />

      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea>
          <CardMedia
            style={{ height: "100px", paddingTop: '0%' }}
            component="img"
            height="140"
            src={image1}
            alt="background image"
          />
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {data.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This is a target table.
            </Typography>
          </CardContent>
        </CardActionArea>

        {/* <CardHeader
          avatar={
            <Avatar id="avatar" src={image1} style={{ width: "35%", height: "35%" }} />
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={data.name}
          subheader="MIT"
        />
        <CardMedia
        />


        <CardContent>
          <Typography variant="body2" color="text.secondary">
            This is an output node.
          </Typography>
        </CardContent>*/}
      </Card>

    </>
  )
}

function useForceUpdate() {
  const [yalue, setValue] = useState(0);
  return () => setValue(value => value + 1);
}


let id = 0;
const getId = () => {
  return "id:" + id++
};

let fieldId = 0;
const getFeildId = () => {
  return fieldId++
}

const nodeTypes = { source: sourceNode, destination: destinationNode }


const getTextBox = (i) => {
  const txt = {
    "id": "name" + i,
    "label": "Column Name",
    "defaultValue": "",
    "type": "text"
  }
  return txt
}
const checkbox1 = (i) => {
  const txt = {
    "id": "path" + i,
    "label": "Data Type",
    "defaultValue": "",
    "type": "text"
  }
  return txt
}
const checkbox2 = (i) => {
  const txt = {
    "id": "header" + i,
    "label": "Key Type",
    "defaultValue": "",
    "type": "text"
  }
  return txt
}




function ReactFlowMainUI() {

  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [structuredData, setStructuredData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [formState, setFormState] = useState({})
  const [formValues, setFormValues] = useState({})
  const [isViewOnly, setIsViewOnly] = useState(false)
  const [selectedNodeId, setSelectedNodeId] = useState("")
  const [objDataStructure, SetObjDataStructure] = useState({})
  const [projectName, setProjectName] = useState("")
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [nodeFormMapping, SetNodeFormMapping] = useState({});
  const forceUpdate = useForceUpdate();
  const [tabname, setTabName] = useState("")


  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds))
  }, []);

  useEffect(() => {
    if (edges.length !== 0) {
      setDataStructure(edges, nodes)
    }
  }, [edges]);


  const setDataStructure = (edges, nodes) => {
    let objList = {}
    for (let node of nodes) {
      let struct = {
        id: node.id,
        name: node.data.name,
        type: node.data.label,
        sources: [],
        targets: [],
        config: objDataStructure[node.id]
      }
      objList[node.id] = struct
    }
    let struct = []
    for (let edge of edges) {
      objList[edge.source].targets.push(objList[edge.target].name)
      objList[edge.target].sources.push(objList[edge.source].name)
      struct[edge.source] = objList[edge.source]
      struct[edge.target] = objList[edge.target]
    }
    let arr = []
    for (let key in struct) {
      arr.push(struct[key])
    }
    console.log("our structure is:", arr)
    setStructuredData(arr)
  }

  const pages = ['Click here for info'];
  const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];


  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onConnectEnd = () => {
  }

  const onDoubleClickOfNode = (node) => {
    setSelectedNodeId(node.id)
    nodes.map((n) => {
      if (n.id == node.id) {
        setTabName(n.data.name)
      }
    })
    handleOpen()
  }

  const getFormValues = (currFormValues) => {
    let i = 0
    let currObjDataStructure = objDataStructure
    currObjDataStructure[selectedNodeId] = {}
    for (let formObj of formState[selectedNodeId]) {
      currObjDataStructure[selectedNodeId][formObj.id] = currFormValues[i]
      i++
    }
    // console.log(currObjDataStructure)
    SetObjDataStructure(currObjDataStructure)
    setDataStructure(edges, nodes)
  }

  const stateListInitiator = (info, id) => {
    let stateList = []
    let currObjDataStructure = objDataStructure
    currObjDataStructure[id] = {}
    for (let obj of info) {
      const reObj = {
        value: obj.defaultValue
      }
      currObjDataStructure[id][obj.id] = {}
      currObjDataStructure[id][obj.id].value = obj.defaultValue
      console.log(obj.defaultValue)

      stateList.push(reObj)
    }
    SetObjDataStructure(currObjDataStructure)
    return stateList
  }



  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const nodeObjStr = event.dataTransfer.getData('application/reactflow');
      console.log("here:", nodeObjStr)
      let nodeObj = JSON.parse(nodeObjStr)
      let nodeId = getId()
      let fieldId = getFeildId()
      let dynamicFormPrev = formValues
      let formFeilds = [getTextBox(fieldId), checkbox1(fieldId), checkbox2(fieldId)]
      const type = nodeObj.type
      console.log("pradyumn", nodeObj.type, " and ", nodeObj.nodeType)

      let inputStatePrev = formState
      inputStatePrev[nodeId] = formFeilds
      setFormState(inputStatePrev)
      dynamicFormPrev[nodeId] = stateListInitiator(formFeilds, nodeId)
      console.log(dynamicFormPrev)
      console.log(inputStatePrev)
      setFormValues(dynamicFormPrev)

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: nodeId,
        type,
        position,
        data: { label: `${type} node`, name: nodeObj.nodeType },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const generateProject = () => {
    console.log("this")
    console.log(structuredData)
    console.log("ends")
    let resultCode = generateSQLCode(structuredData, projectName)
    let zip = new JSZip();
    zip.file(projectName + ".sql", resultCode)
    downloadZip(projectName, zip)
  }

  const downloadZip = (name, zip) => {
    return zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, name + ".zip");
    });
  };


  const addcolumn = (nodeId) => {
    let fieldId = getFeildId()
    let dynamicFormPrev = formValues;
    console.log("formvalues")
    console.log(formValues)
    let inputStatePrev = formState;
    console.log("formstate")
    console.log(formState)
    inputStatePrev[selectedNodeId].push(getTextBox(fieldId));
    inputStatePrev[selectedNodeId].push(checkbox1(fieldId));
    inputStatePrev[selectedNodeId].push(checkbox2(fieldId));
    console.log(inputStatePrev)
    setFormState(inputStatePrev);
    console.log(inputStatePrev)
    dynamicFormPrev[selectedNodeId] = stateListInitiator(inputStatePrev[selectedNodeId], selectedNodeId)
    console.log(dynamicFormPrev)
    setFormValues(dynamicFormPrev)
    forceUpdate()
  }

  const onNameChange = (value) => {
    setTabName(value)
    nodes.map((n) => {
      if (n.id == selectedNodeId) {
        n.data.name = value;
      }
    })
  }


  return (

    <ReactFlowProvider>
      <AppBar position="static" style={{ background: '#4C3A51' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Welcome to My No-Code Tool
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >

            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Pradyumn" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <div className="dndflow">
        <Grid container spacing={2}>
          <Grid item xs={1.2}>
            <LeftSidebar />
          </Grid>
          <Grid item xs={9.6}>


            <div className="reactflow-wrapper" style={{ height: "90vh", width: "100%" }} ref={reactFlowWrapper}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeDoubleClick={(event, node) => onDoubleClickOfNode(node)}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                onConnectEnd={onConnectEnd}
                nodeTypes={nodeTypes}
                onDrop={onDrop}
                onDragOver={onDragOver}
                fitView
              >
                <Controls />
                <Background style={{ backgroundColor: "light green" }} />
                <MiniMap style={{ backgroundColor: "light blue" }} />
              </ReactFlow>
            </div>


          </Grid>
          <Grid item xs={1.2}>
            <RightSidebar />
          </Grid>
        </Grid>
        <Dialog PaperProps={{
          style: {
            minHeight: '60%',
            minWidth: '50%',
          }
        }} open={open} onClose={handleClose}>
          <div align="centre">
            <CloseIcon onClick={handleClose} />
          </div>
          <DialogTitle><div style={{ fontSize: "1.5vw", textAlign: "center", }} >
            Configuration
          </div></DialogTitle>
          <div>
            <TextField
              // key={i}
              sx={{ marginLeft: "33%" }}
              autofocus
              margin="auto"
              // disabled={Props.isViewOnlyMode}
              value={tabname}
              onChange={(e) => { onNameChange(e.target.value)}}
              // id={formobject.id}
              label="Table Name"
              // type={formobject.type}
              fullwidth />
          </div>
          <div>
            <DialogContent>
              <DynamicForm Form={formState[selectedNodeId]}
                inputStateList={formValues[selectedNodeId]}
                setInputStateList={getFormValues}
              />
            </DialogContent>
          </div>
          <div>
            <Button style={{ backgroundColor: "#4CAF50", marginTop: "5%", marginLeft: "73%" }} variant="contained" onClick={() => addcolumn(selectedNodeId)}>Add Column</Button>
          </div>
        </Dialog>
        <div>
          <p>
          </p>
          <TextField id="outlined-basic" label="Project Name" value={projectName} onChange={(e) => { setProjectName(e.target.value) }} variant="outlined" />
        </div>
        <div>

          <p></p>
          <Button style={{ backgroundColor: "#4C3A51" }} variant="contained" onClick={generateProject}>Generate Project</Button>
          <p>
          </p>
        </div>



      </div>
    </ReactFlowProvider>

  );

}

export default ReactFlowMainUI