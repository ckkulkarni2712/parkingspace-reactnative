import { configureStore } from "@reduxjs/toolkit";
import parkingSlice from "../Reducer/parkingSlice";
export default configureStore({
    reducer: {
        parkingSpaces: parkingSlice
    }
})