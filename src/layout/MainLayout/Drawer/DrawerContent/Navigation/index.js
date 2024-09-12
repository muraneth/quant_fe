// material-ui
import { Box, Typography } from '@mui/material';

// project import
import NavGroup from './NavGroup';
import menuItem from 'menu-items';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5005/api/data/menu');
      const data = await response.json();
      setMenuItems(data.data); 
      // Assuming the API returns an object with an 'items' array
    } catch (error) {
      console.error('Error fetching menu items:', error);
      // Optionally, set some default menu items or show an error message
    }
  };


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
