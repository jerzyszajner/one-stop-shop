import styles from "./App.module.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <Navbar />
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
