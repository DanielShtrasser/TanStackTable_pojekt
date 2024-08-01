import {createSlice} from "@reduxjs/toolkit"

interface IAppState {
    currentFilial: {id: number, name: string},
    currentNavigatorSection: string,
}

const initialState: IAppState = {
    currentFilial: {id: 0, name: ''},
    currentNavigatorSection: '4',
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setCurrentNavigatorSection(state, action) {
            state.currentNavigatorSection = action.payload;
        },
        setCurrentFilial(state, action) {
            state.currentFilial = action.payload;
        },
    }

})

export const {setCurrentFilial, setCurrentNavigatorSection} = appSlice.actions
export default appSlice.reducer;
