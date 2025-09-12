// React Router
import { Outlet } from "react-router-dom";

// Components
import { Footer, Navbar } from "./components";

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
