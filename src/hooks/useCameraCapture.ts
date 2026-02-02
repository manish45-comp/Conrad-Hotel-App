import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { useRef, useState } from "react";

export function useCameraCapture() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const processImage = async (uri: string) => {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1200 } }], // Optimized for VMS storage
      { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG, base64: true },
    );
    return result.base64!;
  };

  const capturePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.3,
        skipProcessing: false,
      });

      if (photo) {
        const b64 = await processImage(photo.uri);
        setPhotoUri(photo.uri);
        setBase64(b64);
        setIsCameraActive(false); // Close camera after capture
      }
    }
  };

  return {
    photoUri,
    base64,
    capturePhoto,
    hasPhoto: !!photoUri,
    isCameraActive,
    setIsCameraActive,
    cameraRef,
    permission,
    requestPermission,
  };
}
