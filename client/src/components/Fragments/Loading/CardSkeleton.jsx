import React from "react";
import Skeleton from "react-loading-skeleton";

const CardSkeleton = ({ count = 1 }) => {
  return Array(count)
    .fill(0)
    .map((_, index) => (
      <div key={index} className="bg-gray rounded-lg overflow-hidden">
        <div className="">
          <Skeleton height={"256px"} />
        </div>
        <div className="p-6 ">
          <div className="flex flex-col min-h-40 justify-between">
            <div className="flex flex-col gap-3">
              <Skeleton />
              <Skeleton />
            </div>
            <div>
              <Skeleton />
            </div>
          </div>
        </div>
      </div>
    ));
};

export default CardSkeleton;
