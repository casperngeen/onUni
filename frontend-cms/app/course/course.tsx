// contains a single course (rendered in home page)
import styles from "./course.module.css";

export default function SingleCourse(title: string, start: Date, end: Date) {
  return (
    <div className={`container-fluid ${styles.container}`}>
      <div className="row h2 text-start">`${title}`</div>
      <div className="row fs-4">
        <div className={`${styles.leftGroup}`}>
          <div>Start: ${start.toDateString()}</div>
          <div>End: ${end.toDateString()}</div>
        </div>
        <div className="col">
        </div>
      </div>
    </div>
  );
}