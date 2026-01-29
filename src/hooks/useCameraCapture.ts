import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export function useCameraCapture() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [base64, setBase64] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Camera Permission",
          "Camera access is required to capture visitor photo.",
        );
      }
    })();
  }, []);

  const processImage = async (uri: string) => {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1600 } }],
      {
        compress: 0.5,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      },
    );

    return result.base64!;
  };

  const capturePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) return;

      const res = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (res.canceled) return;
      const asset = res.assets[0];
      const base64 = await processImage(asset.uri);
      setPhotoUri(asset.uri);
      setBase64(base64 ?? null);
    } catch (e) {
      console.log(e);
    }
  };

  return {
    photoUri,
    base64,
    capturePhoto,
    hasPhoto: !!photoUri,
  };
}
