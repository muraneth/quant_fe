// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import token from './token';
import chartmenu from './chartmenu';
import sidebar from './sidebar';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu, token, chartmenu, sidebar });

export default reducers;
