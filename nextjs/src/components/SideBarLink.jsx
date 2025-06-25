"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./sidebar.module.css";

export default function SideBarLink({ href, children }) {
  const pathname = usePathname();

  const active = pathname === href;

  return (
    <Link className={`${active && styles.active} ${styles.link}`} href={href}>
      {children}
    </Link>
  );
}
