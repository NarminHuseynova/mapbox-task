import { useCallback, useEffect, useMemo, useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

interface Props {
  leaves: any[];
}

export default function StarbucksPopup({ leaves }: Props) {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    setCount(0);
  }, [leaves]);

  const next = useCallback(() => {
    setCount((c) => c + 1);
  }, [setCount]);

  const prev = useCallback(() => {
    setCount((c) => c - 1);
  }, [setCount]);

  const prevDisabled = useMemo(() => count === 0, [count]);
  const nextDisabled = useMemo(
    () => count === leaves.length - 1,
    [count, leaves.length]
  );

  if (!leaves[count]) return <></>;

  return (
    <div>
      <div className="popup_item_top">
        <div className="popup_buttons">
          <button
            className="btn_prev"
            disabled={prevDisabled}
            onClick={prev}
          >
            <BsChevronLeft />
          </button>
          <button
            className="btn_prev"
            disabled={nextDisabled}
            onClick={next}
          >
            <BsChevronRight />
          </button>
        </div>
        <div>
          <div>
            <p className="btn_text">
              {count + 1} / {leaves.length}
            </p>
          </div>
        </div>
      </div>
      <div>
        <div className="popup_item">
          <p className="popup_item_title">Name</p>
          <p>{leaves[count].properties.name}</p>
        </div>
        <div className="popup_item">
          <p className="popup_item_title">Address</p>
          <p>{leaves[count].properties.street_address}</p>
        </div>
        <div className="popup_item">
          <p className="popup_item_title">Phone Number</p>
          <p>{leaves[count].properties.phone_number_1}</p>
        </div>
      </div>
    </div>
  );
}
