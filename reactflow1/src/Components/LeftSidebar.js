import React from 'react';
import Box from '@mui/material/Box';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Handle
} from 'react-flow-renderer';
import CardMedia from '@mui/material/CardMedia';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ArrayObjectOfNodes from './Nodes.json'

import { styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const LeftSidebar = () => {
  const onDragStart = (event, nodeType, srcType, formFeilds) => {
    let nodeInfo = { type: nodeType, nodeType: srcType, formFeilds: formFeilds }
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeInfo));
    event.dataTransfer.effectAllowed = 'move';
  };
  
  return (
    <aside>
      <div className='groupsMagenta' style={{ fontSize: "1.5vw", textAlign: "center", marginTop: "56px", marginBottom: "8px", textDecoration: "underline" }} >
        <strong> Source Table</strong>
      </div>
      {
        ArrayObjectOfNodes.map(
          nodeInfo => <div key={nodeInfo.id} onDragStart={(event) => onDragStart(event, 'source', nodeInfo.type, nodeInfo.formFeilds)} style={{ display: "flex", justifyContent: "center" }} draggable>
            {
              TargetNodes(nodeInfo.type)
            }
          </div>
        )
      }
    </aside>
  );
}

const TargetNodes = (type) => {
  return (
    <Box
      sx={{
        width: 200,
        height: 100,
        backgroundColor: '#4C3A51',
        '&:hover': {
          backgroundColor: 'grey',
          opacity: [0.9, 0.8, 0.7],
        },
      }}

    >
      <React.Fragment>
        <CardContent>
          <Typography style={{color:"white"}}>Drag to drop Source Table
          </Typography>
        </CardContent>

      </React.Fragment>

    </Box>
  )
}

export default LeftSidebar