"use client";
import styles from "./NavBar.module.css";
 
export default function NavBar() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <div className={styles.brand}>
            <span className={styles.logo}>Jobify</span>
          </div>
        </div>
 
        <nav className={styles.center}>
          <a className={styles.link} href="/jobs">Find Jobs</a>
          <a className={styles.link} href="/companies">Companies</a>
          <a className={styles.link} href="/salaries">Salaries</a>
        </nav>
 
        <div className={styles.right}>
          <a className={styles.link} href="/login">Sign in</a>
          <button className={styles.primaryBtn} type="button">Post a Job</button>
        </div>
      </div>
    </header>
  );
}