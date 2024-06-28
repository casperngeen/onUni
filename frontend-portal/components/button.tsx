import styles from "./button.module.css";

export default function DeleteButton() {
  return (
    <button className={`${styles.button}`}>
      <i className="bi bi-trash"></i>
    </button>
  );
}
