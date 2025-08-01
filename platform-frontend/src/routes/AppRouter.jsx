import { PlatformRouter } from "../features/platform/routes"
import {Route, Routes} from 'react-router-dom'


export const AppRouter = () => {
    return (
        <Routes>
            <Route path="*" element={<PlatformRouter />} />
        </Routes>

        
    )
}