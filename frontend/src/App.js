import {BrowserRouter as Router, Routes, Route, BrowserRouter} from "react-router-dom";
import RecipeList from "./pages/RecipeList";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import Register from "./pages/Register";
import "./App.css";
import Header from "./components/Header";

function AppLayout({ children }) {
  const isLoggedIn = !!localStorage.getItem("accessToken");

  return (
    <>
      {isLoggedIn && <Header />}
      <main>{children}</main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/recipes"
          element={
            <AppLayout>
              <PrivateRoute>
                <RecipeList />
              </PrivateRoute>
            </AppLayout>
          }
        />

        <Route
          path="/profile"
          element={
            <AppLayout>
              <div className="p-4">Profile Page (under construction)</div>
            </AppLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <AppLayout>
              <div className="p-4">Settings Page (under construction)</div>
            </AppLayout>
          }
        />
        <Route
          path="/feed"
          element={
            <AppLayout>
              <div className="p-4">Feed is under construction</div>
            </AppLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}



export default App;
