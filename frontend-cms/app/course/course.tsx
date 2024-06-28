// contains a single course (rendered in home page)
"use client"

import UniButtonComp from "../../components/overwrite/uni.button";
import { UniCol, UniRow } from "../../components/overwrite/uni.components";
import { formatDate } from "../../utils/formatDate";
import { useRouter } from "next/navigation";
import './course.scss';

interface SingleCourseProps {
  title: string,
  start: string,
  end: string,
  courseId: number,
}

const SingleCourse: React.FC<SingleCourseProps> = ({title, start, end, courseId}) => {
  const router = useRouter();

  const clickView = () => router.push(`course/${courseId}`);
  const deleteCourse = () => {

  }

  return (
    <div className='course'>
      <div className='top'>
        <div className="left-col">{title}</div>
      </div>
      
      <UniRow className="bottom">
      {/* <UniRow className='justify-content-between'>
        <UniCol xs={4}>
          <span>Start: {formatDate(start)}</span>
          <span className="px-3">End: {formatDate(end)}</span>
        </UniCol>

        <UniCol xs={4} className="text-right">
          <UniRow className="justify-content-end">
            <UniCol xs={3}>
            <UniButtonComp custombutton="type-1" onClick={deleteCourse}>
              Delete
            </UniButtonComp>
            </UniCol>

            <UniCol xs={3}>
            <UniButtonComp custombutton="type-1" onClick={clickView}>
            View
            </UniButtonComp>
            </UniCol>
          </UniRow>
        </UniCol> */}
        <UniCol className='left-col' xs='auto'>
          <div className='word-row'>Start:</div>
          <div className='date-row'>{formatDate(start)}</div>
        </UniCol>
        <UniCol className='left-col_last'>
          <div className='word-row'>End:</div>
          <div className='date-row'>{formatDate(end)}</div>
        </UniCol>
        <div className='right-col'>
          <UniButtonComp custombutton="type-1" onClick={deleteCourse}>
            Delete
          </UniButtonComp>
        </div>
        <div className='right-col_last'>
          <UniButtonComp custombutton="type-1" onClick={clickView}>
            View
          </UniButtonComp>
        </div>
      </UniRow>
    </div>
  );
}

export default SingleCourse;