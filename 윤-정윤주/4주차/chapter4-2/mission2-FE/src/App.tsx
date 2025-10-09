import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import HomeLayout from './layouts/HomeLayout'
import SignupPage from './pages/SignupPage'
import MyPage from './pages/MyPage'

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage />},  // "/"경로일 때 렌더링되는 기본 페이지
      { path: "login", element: <LoginPage /> },  // Outlet에 렌더링될 컴포넌트
      { path: "signup", element: <SignupPage /> },
      { path: "my", element: <MyPage /> },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
