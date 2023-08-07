import { createContext } from 'react';
import { AppContextData } from './AppContext.types';

export const AppContext = createContext<AppContextData>({octokitRef: null})
