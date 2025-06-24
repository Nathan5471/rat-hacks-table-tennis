import styles from "./header.module.css";
import Link from "next/link";

export default async function Header() {
  return (
    <div className={styles.header}>
      <Link href="/" className={styles.logoLink}>
        <h2>Rat Hacks Table Tennis</h2>
      </Link>
      <div></div>
      <div className={styles.headerLinks}>
        <Link href="/login" className={styles.headerLink}>
          <button>Login</button>
        </Link>
        <Link href="/signup" className={styles.headerLink}>
          <button>Sign Up</button>
        </Link>
      </div>
    </div>
  );
}
