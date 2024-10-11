// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import token from './token';
import chartmenu from './chartmenu';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu, token, chartmenu });

export default reducers;
