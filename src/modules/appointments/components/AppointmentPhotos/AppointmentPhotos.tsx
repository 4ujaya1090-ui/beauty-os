import { useState } from "react";

import "./AppointmentPhotos.css";

type AppointmentPhotosProps = {
  photos?: string[];
};

function AppointmentPhotos({
  photos = [],
}: AppointmentPhotosProps) {
  const [selectedPhoto, setSelectedPhoto] =
    useState<string | null>(null);

  if (photos.length === 0) {
    return null;
  }

  return (
    <>
      <div className="appointment-photos">
        <span className="appointment-photos__title">
          Фото
        </span>

        <div className="appointment-photos__grid">
          {photos.map((photo) => (
            <button
              type="button"
              className="appointment-photos__item"
              key={photo}
              onClick={() =>
                setSelectedPhoto(photo)
              }
            >
              <img
                src={photo}
                alt="Фото процедуры"
              />
            </button>
          ))}
        </div>
      </div>

      {selectedPhoto && (
        <div
          className="appointment-photos__overlay"
          onClick={() =>
            setSelectedPhoto(null)
          }
        >
          <div
            className="appointment-photos__modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="appointment-photos__close"
              onClick={() =>
                setSelectedPhoto(null)
              }
            >
              ✕
            </button>

            <img
              src={selectedPhoto}
              alt="Фото процедуры"
              className="appointment-photos__large"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default AppointmentPhotos;