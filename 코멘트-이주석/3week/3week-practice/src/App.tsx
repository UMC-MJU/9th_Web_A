import { Link } from "./router/Link";
import { Routes, Route } from "./router/Route";

function HomePage() {
  return <h1>Home</h1>;
}
function AboutPage() {
  return <h1>About</h1>;
}
function UsersPage() {
  return <h1>Users</h1>;
}
function NotFoundPage() {
  return <h1>404 — 페이지를 찾을 수 없습니다</h1>;
}

function Header() {
  return (
    <nav style={{ display: "flex", gap: "1rem" }}>
      <Link to="/Home">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/users">Users</Link>
      <Link to="/not-found">NotFound</Link>
    </nav>
  );
}

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/Home" component={HomePage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/users" component={UsersPage} />
        <Route path="/not-found" component={NotFoundPage} />
      </Routes>
    </>
  );
}

export default App;
