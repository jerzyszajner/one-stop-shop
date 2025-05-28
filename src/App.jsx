import styles from "./App.module.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Foter from "./components/Footer/Footer";

function App() {
  return (
    <>
      <header className={styles.header}>
        <Navbar />
      </header>
      <main>
        <Outlet />
      </main>
      <Foter />
    </>
  );
}

export default App;
