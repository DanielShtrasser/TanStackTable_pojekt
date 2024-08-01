import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { menuApi } from '../services/menuApi'
import appReducer from './appSlice'

const rootReducer = combineReducers({
  appReducer,
  [menuApi.reducerPath]: menuApi.reducer
})
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMidleware) => getDefaultMidleware().concat(menuApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
