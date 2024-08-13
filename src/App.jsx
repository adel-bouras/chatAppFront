import { createBrowserRouter , RouterProvider } from "react-router-dom";
import Login from './routes/login/login';
import ErrorPage from './routes/errorPage/errorPage';
import Rooms from './routes/rooms/rooms';

function App(){

  
  

  const router = createBrowserRouter([
    {
      path : '/',
      element : <Login />,
      errorElement : <ErrorPage />
    },
    {
      path : '/user',
      element : <Rooms />,
      errorElement : <ErrorPage />,
    }
  ])




  return <RouterProvider router={router} />
}

export default App
