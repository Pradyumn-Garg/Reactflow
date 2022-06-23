import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { FormControl, MenuItem, Select, InputLabel } from '@mui/material';


function useForceUpdate() {
    const [yalue, setValue] = useState(0);
    return () => setValue(value => value + 1);
}

export default function DynamicForm(Props) {
    const [entryStateArray, setEntryStateArray] = React.useState(Props.inputStateList)
    console.log(entryStateArray)
    const forceUpdate = useForceUpdate();
    const setInInputListOnChange = (value, idx) => {
        let currState = Props.inputStateList
        currState[idx].value = value
        setEntryStateArray(currState)
        forceUpdate()
        Props.setInputStateList(currState)
    }

    return (
        <div>
            {Props.Form.map((formobject, i) => (
                i %3== 0 ? (<TextField
                    key={i}
                    autofocus
                    margin="dense"
                    disabled={Props.isViewOnlyMode}
                    value={Props.inputStateList[i].value}
                    onChange={(e) => { setInInputListOnChange(e.target.value, i) }}
                    id={formobject.id}
                    label={formobject.label}
                    type={formobject.type}
                    fullwidth />)
                    : (i %3== 1 ? (
                        <FormControl style={{ minWidth: 120, marginLeft: "20px", marginTop: "8px" }}>
                            <InputLabel id="demo-simple-select-label">Data Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={Props.inputStateList[i].value}
                                label={formobject.label}
                                onChange={(e) => { setInInputListOnChange(e.target.value, i) }}
                            >
                                <MenuItem value={"CHAR"}>CHAR</MenuItem>
                                <MenuItem value={"NUMBER"}>NUMBER</MenuItem>
                                <MenuItem value={"INT"}>INT</MenuItem>
                            </Select>
                        </FormControl>
                    ) : (i %3== 2 ? (<FormControl style={{ minWidth: 120, marginLeft: "20px", marginTop: "8px" }}>
                        <InputLabel id="demo-simple-select-label">Key Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={Props.inputStateList[i].value}
                            label={formobject.label}
                            onChange={(e) => { setInInputListOnChange(e.target.value, i) }}
                        >
                            <MenuItem value={"PRIMARY KEY"}>PRIMARY KEY</MenuItem>
                            <MenuItem value={"SECONDARY KEY"}>SECONDARY KEY</MenuItem>
                            <MenuItem value={"FOREIGN KEY"}>FOREIGN KEY</MenuItem>
                        </Select>
                    </FormControl>) : null))



            ))}
        </div>
    )
}