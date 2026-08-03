import { useRef, useState, type ChangeEvent } from "react";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import { storage } from "../../../../firebase/config";
import { useAppointments } from "../../context/AppointmentContext";

import "./PhotoGallery.css";

type PhotoGalleryProps = {
  appointmentId: string;
  photos: string[];
};

function PhotoGallery({ appointmentId, photos }: PhotoGalleryProps) {
  const { addPhoto, removePhoto } = useAppointments();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFilesSelected(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;

    if (!files || files.length === 0) {
      return;
    }

    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        const path = `appointments/${appointmentId}/${Date.now()}-${file.name}`;
        const storageRef = ref(storage, path);

        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);

        await addPhoto(appointmentId, url);
      }
    } catch (error) {
      console.error("Не удалось загрузить фото:", error);
      window.alert(
        "Не получилось загрузить фото. Проверьте интернет-соединение и попробуйте ещё раз."
      );
    } finally {
      setIsUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleDelete(url: string) {
    if (!window.confirm("Удалить это фото?")) {
      return;
    }

    try {
      const storageRef = ref(storage, url);
      await deleteObject(storageRef);
    } catch (error) {
      console.error("Не удалось удалить файл из хранилища:", error);
    }

    await removePhoto(appointmentId, url);
  }

  return (
    <div className="photo-gallery">
      {photos.length > 0 && (
        <div className="photo-gallery__grid">
          {photos.map((url) => (
            <div className="photo-gallery__item" key={url}>
              <img src={url} alt="Фото процедуры" />

              <button
                className="photo-gallery__remove"
                onClick={() => handleDelete(url)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="photo-gallery__input"
        onChange={handleFilesSelected}
      />

      <button
        className="photo-gallery__add"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? "Загружаем..." : "+ Добавить фото"}
      </button>
    </div>
  );
}

export default PhotoGallery;