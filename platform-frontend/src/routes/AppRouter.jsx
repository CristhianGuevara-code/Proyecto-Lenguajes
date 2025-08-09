import { PlatformRouter } from "../features/platform/routes"
import {Route, Routes} from 'react-router-dom'


 export const AppRouter = () => {
    return (
        <Routes>
            <Route path="*" element={<PlatformRouter />} />
        </Routes>

        
    )
} 

//     export const AppRouter = () => {
//   const { authenticated } = useAuthStore();
//   return (
//     <div className="min-h-screen bg-gray-100">
      

//         <Routes>
//           {/** Rutas Protegidas */}
//           <Route element={< PrivateRoute/>}>
//           <Route element={<Navbar />}>
//           <Route path="/" element={<HomePage/>} />

//           <Route element={<RoleProtectedRoute requiredRoles={[Role.]} />}>
//             <Route path="/countries" element={<CountriesPage/>} />
//             <Route path="/countries/create" element={<CreateCountryPage/>} />
//             <Route path="/countries/:countryId/edit" element={<EditCountryPage/>} />
//             <Route path="/countries/:countryId/delete" element={<DeleteCountryPage/>} />
//           </Route>
          

          
//           <Route path="/persons" element={<PersonsPage/>} />
//           </Route>
//           </Route>

//           {/** Rutas publicas */}
//           <Route path="/auth">
//             <Route path="login" element={authenticated ? <Navigate to="/" replace /> : <LoginPage />} />
//           </Route>
          
//         </Routes>

//         </div>
//   )
// }