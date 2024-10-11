// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import token from './token';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu, token });

export default reducers;
