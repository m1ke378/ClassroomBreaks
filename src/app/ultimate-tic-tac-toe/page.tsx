import styles from "./page.module.css";
import motion from "motion/react";
import Link from "next/link";

import BaseCard from "@/components/BaseCard/BaseCard";

export default function Home() {
  return (
    <div className={styles.page}>
      <BaseCard>
        <Link href="/local/create" className={styles.baseCardLink}>
          Play locally
        </Link>
        <Link href="/online/create/public" className={styles.baseCardLink}>
          Play online
        </Link>
        <Link href="/online/create/private" className={styles.baseCardLink}>
          Play with a friend
        </Link>
      </BaseCard>
    </div>
  );
}
