import SideBar from "@/components/SideBar";
import styles from "./applayout.module.css";

export default function AppLayout({ children }) {
  return (
    <div className={styles.container}>
      <SideBar />
      {children}
    </div>
  );
}
