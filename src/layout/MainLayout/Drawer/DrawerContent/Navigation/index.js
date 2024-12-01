// material-ui
import { Box, Typography } from '@mui/material';

// project import
import NavGroup from './NavGroup';
import menuItem from 'menu-items';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const navGroups = menuItem.items.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
};

export default Navigation;



// import React, { useState, useEffect } from 'react';
// import menuItem from 'menu-items';

// // ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

// const Navigation = () => {
//   const [menuItems, setMenuItems] = useState(menuItem.items); // Initialize state with initial menu items

//   useEffect(() => {
//     // Fetch data from API and update menu items
//     fetchMenuItems()
//       .then(data => {
//         setMenuItems(data.items);
//       })
//       .catch(error => {
//         console.error('Error fetching menu items:', error);
//       });
//   }, []); // Empty dependency array to run effect only once after initial render

//   const fetchMenuItems = async () => {
//     // Fetch menu items from API
//     const response = await fetch('api_url_here');
//     const data = await response.json();
//     return data;
//   };

//   const navGroups = menuItems.map((item) => {
//     switch (item.type) {
//       case 'group':
//         return <NavGroup key={item.id} item={item} />;
//       default:
//         return (
//           <Typography key={item.id} variant="h6" color="error" align="center">
//             Fix - Navigation Group
//           </Typography>
//         );
//     }
//   });

//   return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
// };

// export default Navigation;
