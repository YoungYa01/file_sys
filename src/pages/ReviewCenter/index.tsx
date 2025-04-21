import { getReviewList } from "@/api/review.ts";
import {useEffect} from "react";

const ReviewCenter = () => {
  const getList = async () => {
    const response = await getReviewList();
    console.log(response)
  };

  useEffect(() => {
    getList();
  }, []);

  return <div>ReviewCenter</div>;
};

export default ReviewCenter;
