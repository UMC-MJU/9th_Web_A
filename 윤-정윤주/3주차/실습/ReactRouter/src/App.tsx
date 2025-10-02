import './App.css'

// 1. React Router에서 필요한 함수/컴포넌트를 import
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import NotFound from './pages/not-found';
import HomePage from './pages/home';
import MoviesPage from './pages/movies';
import RootLayOut from './layout/root-layout';

// 2. createBrowserRouter로 라우터 생성
const router = createBrowserRouter([
  {
    path: '/',
    // element: <HomePage />,
    element: <RootLayOut />,
    errorElement: <NotFound />,
    // Navbar 아래에 표시할 자식 라우트
    children: [
      {
        index: true, // path 없이 기본으로 보여줄 페이지
        element: <HomePage />
      },
      {
        // 부모가 '/'이므로 '/movies'가 됨
        path: 'movies',  // /movies/뒤에 오는 값을movieId로 받음
        element: <MoviesPage />
      },
    ]
  },
]);

// 3. RouterProvider로 router 전달
function App() {
  return <RouterProvider router={router} />
}

export default App;