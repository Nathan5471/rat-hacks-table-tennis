import Header from "@/components/Header";
import styles from "./home.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.left}>
          <div>
            <h1>Rat Hacks</h1>
          </div>
          <h1>Table Tennis</h1>
          <h2>
            Click{" "}
            <Link href="/login">
              <button>Login</button>
            </Link>{" "}
            or{" "}
            <Link href="/signup">
              <button>Signup</button>
            </Link>{" "}
            to Start!
          </h2>
        </div>
        {/* <div className={styles.right}>
          <div>
            <h1>Gameplay</h1>
          </div>
        </div> */}{" "}
        <div className={styles.right}>
          <div className={styles.imageContainer}>
            {/* <Image
              src="/Rat Hacks Table Tennis.png"
              alt="Description of image"
              width={600}
              height={400}
            /> */}
            <h1>How it works:</h1> <br />
            <ul>
              <li>
                <h2>You login or signup</h2>
              </li>
              <li>
                <h2>A Rat Hacks Admin creates a tournament</h2>
              </li>
              <li>
                <h2>You join a tournament</h2>
              </li>
              <li>
                <h2>When the tournament starts, your score is updated live</h2>
              </li>
              <li>
                <h2>
                  When the tournament concludes, your standings and matches get
                  added to your history
                </h2>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.bottom}></div>
    </>
  );
}
