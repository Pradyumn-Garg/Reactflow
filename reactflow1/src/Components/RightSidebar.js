import React, { useState, useRef, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Handle
} from 'react-flow-renderer';
import ArrayObjectOfNodes from './Nodes.json'
import CardMedia from '@mui/material/CardMedia';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';


const LeftSidebar = () => {

  const onDragStart = (event, nodeType, srcType) => {
    let nodeInfo = { type: nodeType, nodeType: srcType }
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeInfo));
    event.dataTransfer.effectAllowed = 'move';
  }

  return (
    <aside>
      <div className='groupsMagenta' style={{ fontSize: "1.5vw", textAlign: "center", marginTop: "56px", marginBottom: "8px", textDecoration: "underline" }} >
        <strong> Target Table</strong>
      </div>
      {
        ArrayObjectOfNodes.map(
          nodeInfo => <div key={nodeInfo.id} onDragStart={(event) => onDragStart(event, 'destination', nodeInfo.type)} style={{ display: "flex", justifyContent: "center" }} draggable>
            {
              SourceNodes(nodeInfo.type)
            }
          </div>
        )
      }
    </aside>
  );
}

const SourceNodes = (type) => {
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
          <Typography style={{color:"white"}}>Drag to drop Target Table
          </Typography>
        </CardContent>

      </React.Fragment>

    </Box>
  )
}

export default LeftSidebar