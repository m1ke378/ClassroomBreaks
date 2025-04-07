"use client";

import styles from "./ErrorModal.module.css";

export default function ErrorModal({ errorMessage }: { errorMessage: string }) {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h3>{errorMessage}</h3>
      </div>
    </div>
  );
}
