import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { styled, lighten, darken } from '@mui/system';
import { getChartList } from 'server/chart';

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: theme.palette.primary.main,
  backgroundColor: lighten(theme.palette.primary.light, 0.85),
  ...theme.applyStyles('dark', {
    backgroundColor: darken(theme.palette.primary.main, 0.8)
  })
}));

const GroupItems = styled('ul')({
  padding: 0
});

export default function RenderGroup({ onSelect }) {
  const [chartList, setChartList] = React.useState([]);

  React.useEffect(() => {
    getChartList().then((data) => {
      const allCharts = data?.flatMap((option) =>
        option.children?.map((child) => ({
          group: option.title,
          title: child.title
        }))
      );
      setChartList(allCharts);

    });
  }, []);

  return (
    <Autocomplete
      options={chartList}
      //   groupBy={(option) => option.group}
      getOptionLabel={(option) => option?.title}
      sx={{ width: 300 }}
      onChange={(event, value) => {
        if (onSelect) {
          onSelect(value.title);
        }
      }}
      renderInput={(params) => <TextField {...params} label="With categories" />}
      renderGroup={(params) => (
        <li key={params.key}>
          {/* <GroupHeader>{params.group}</GroupHeader> */}
          <GroupItems>{params.title}</GroupItems>
        </li>
      )}
    />
  );
}
