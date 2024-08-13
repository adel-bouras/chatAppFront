import { createBrowserRouter , RouterProvider } from "react-router-dom";
import Login from './routes/login/login';
import ErrorPage from './routes/errorPage/errorPage';
import Rooms from './routes/rooms/rooms';
import Chat from './routes/chat/chat';

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
      children: [
        {
          path: "/user",
          element: <Chat />,
        },
      ],
    }
  ])




  return <RouterProvider router={router} />
}

export default App
