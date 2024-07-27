import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

export default function TabsWrapper({labels, components }) {
    const [value, setValue] = React.useState(0);

    return (
        <Box sx={{ width: '100%'}}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} aria-label="basic tabs example">
                    {labels.map((label, index) => (
                        <Tab key={label} label={label} onClick={() => setValue(index)} />
                    ))}
                </Tabs>
            </Box>
            <Box sx={{ p: 3 }}>
                {components.map((Component, index) => (
                    <div key={index}>
                        {value === index && <Component />}
                    </div>
                ))}
            </Box>
        </Box>
    );
}