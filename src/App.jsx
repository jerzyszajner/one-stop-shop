// React Router
import { Outlet } from "react-router-dom";

// Components
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";

// Styles
import styles from "./App.module.css";

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
