import { useEffect, ReactNode } from "react";
import ReactDOM from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import usePreview from "./usePreview";
import usePortal from "./usePortal";
import "./styles.scss";
import { GlobalState } from "../../../../store/types";
import { closeFullscreenPreview } from "../../../../store/actions";

const close = require("../../../../../assets/close.svg") as string;
const plus = require("../../../../../assets/plus.svg") as string;
const minus = require("../../../../../assets/minus.svg") as string;
const zoomIn = require("../../../../../assets/zoom-in.svg") as string;
const zoomOut = require("../../../../../assets/zoom-out.svg") as string;

type Props = {
  fullScreenMode?: boolean;
  zoomStep?: number;
};

export default function FullScreenPreview({ fullScreenMode, zoomStep }: Props) {
  const {
    state,
    initFileSize,
    onZoomIn,
    onZoomOut,
    onResizePageZoom,
  } = usePreview(zoomStep);

  const dispatch = useDispatch();
  const { src, alt, width, height, visible } = useSelector(
    (state: GlobalState) => ({
      src: state.preview.src,
      alt: state.preview.alt,
      width: state.preview.width,
      height: state.preview.height,
      visible: state.preview.visible,
    })
  );

  useEffect(() => {
    if (src) {
      initFileSize(width, height);
    }
  }, [src]);

  const pDom = usePortal();

  const onClosePreview = () => {
    dispatch(closeFullscreenPreview());
  };

  const childNode: ReactNode = (
    <div className="rcw-previewer-container">
      <div className="rcw-previewer-veil">
        <img
          {...state.layout}
          src={src}
          className="rcw-previewer-image"
          alt={alt}
        />
      </div>
      {/* <button
        className="rcw-previewer-button rcw-previewer-close-button"
        onClick={onClosePreview}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          className="rcw-previewer-icon"
        >
          <g fill="none" fill-rule="evenodd">
            <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
            <path
              fill="currentColor"
              d="m12 14.122l5.303 5.303a1.5 1.5 0 0 0 2.122-2.122L14.12 12l5.304-5.303a1.5 1.5 0 1 0-2.122-2.121L12 9.879L6.697 4.576a1.5 1.5 0 1 0-2.122 2.12L9.88 12l-5.304 5.304a1.5 1.5 0 1 0 2.122 2.12z"
            />
          </g>
        </svg>
      </button> */}
      <div className="rcw-previewer-tools">
        <button className="rcw-previewer-button" onClick={onResizePageZoom}>
          <img
            src={state.zoom ? zoomOut : zoomIn}
            className="rcw-previewer-icon"
            alt="reset zoom"
          />
        </button>

        <button className="rcw-previewer-button" onClick={onZoomIn}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            className="rcw-previewer-icon"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 5v14m-7-7h14"
            />
          </svg>
        </button>
        <button className="rcw-previewer-button" onClick={onZoomOut}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            className="rcw-previewer-icon"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 12h14"
            />
          </svg>
        </button>
      </div>
    </div>
  );

  return visible ? ReactDOM.createPortal(childNode, pDom) : null;
}
