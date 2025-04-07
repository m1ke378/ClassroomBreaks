import styles from "./Loader.module.css";

export default function Loader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100px",
        width: "100%",
      }}
    >
      <div className={styles.loader}></div>
    </div>
  );
}
