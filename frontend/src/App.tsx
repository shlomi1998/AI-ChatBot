
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import { Home, Login, Signup, Chat, NotFound } from "./pages";
import { useAuth } from "./context/AuthContext";

const App = () => {
  // console.log(useAuth()?.isLoggedIn)
  const auth = useAuth();
  return (
    <main>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {auth?.isLoggedIn && auth.user && (
          <Route path="/chat" element={<Chat />} />
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
};

export default App;
