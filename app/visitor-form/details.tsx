import { AppDropdown } from "@/components/common/AppDropdown";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { StepIndicator } from "@/components/common/StepIndicator";
import { getIdProofTypes } from "@/src/api/services/visitorSelfRegistration.service";
import { useBackButtonhandler } from "@/src/hooks/useBackButtonhandler";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { useVisitorFormStore } from "@/src/stores/useVisitorFormStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  MD3Theme,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type IdProofType = {
  id: string;
  name: string;
};

type DocSide = "front" | "back";

const Details = () => {
  const { onConfirmExit, setShowConfirm, showConfirm } = useBackButtonhandler();
  const {
    name,
    company,
    address,
    idProofNumber,
    idProofId,
    idProofImage,
    setField,
    idProofBackImage,
  } = useVisitorFormStore();

  const { user } = useAuthStore();
  const theme = useTheme();

  const [idProofTypes, setIdProofTypes] = useState<IdProofType[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [docLoading, setDocLoading] = useState(false);

  const [activeCaptureSide, setActiveCaptureSide] = useState<DocSide | null>(
    null,
  );
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const [idOpen, setIdOpen] = useState(false);

  useEffect(() => {
    const fetchidProofTypes = async () => {
      try {
        const result = await getIdProofTypes();
        setIdProofTypes(result?.data ?? []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchidProofTypes();
  }, [user?.UserId]);

  const dropdownList = useMemo(
    () => idProofTypes.map((item) => ({ label: item.name, value: item.id })),
    [idProofTypes],
  );

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name?.trim()) e.name = "Name is required";
    if (!company?.trim()) e.company = "Company is required";
    if (!address?.trim()) e.address = "Address is required";
    if (!idProofId) e.idProofId = "Select ID proof type";
    if (!idProofNumber && !idProofImage) {
      e.idProofNumber = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    router.push("/visitor-form/purpose");
  };

  const handleSelect = (selectedId: string) => {
    const selectedItem = idProofTypes.find((item) => item.id === selectedId);
    setField("idProofId", selectedId);
    setField("idProofType", selectedItem?.name ?? "");
  };

  const processImage = async (uri: string) => {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1200 } }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG, base64: true },
    );
    return result.base64!;
  };

  const captureDocument = async () => {
    if (!cameraRef.current || !activeCaptureSide) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        skipProcessing: false,
      });

      if (!photo?.uri) return;

      const base64 = await processImage(photo.uri);

      if (activeCaptureSide === "front") {
        setField("idProofImage", base64);
      } else {
        setField("idProofBackImage", base64);
      }

      setActiveCaptureSide(null);
    } catch (err) {
      console.error("Capture failed:", err);
    }
  };

  const renderDocSlot = (side: DocSide, imageData: string | null) => {
    const isCapturing = activeCaptureSide === side;

    if (isCapturing) {
      return (
        <View style={[styles.docCardActive]}>
          <CameraView
            ref={cameraRef}
            facing="front"
            style={StyleSheet.absoluteFill}
          />
          {/* THE ID CARD RATIO GUIDELINE */}
          <View style={styles.guidelineOverlay}>
            <Text style={styles.guidelineText}>
              PLACE {side.toUpperCase()} OF ID WITHIN FRAME
            </Text>
          </View>

          <View style={styles.cameraControls}>
            <Button mode="text" onPress={() => setActiveCaptureSide(null)}>
              CANCEL
            </Button>
            <Pressable style={styles.shutterBtn} onPress={captureDocument}>
              <View style={styles.shutterInner} />
            </Pressable>
            <Button
              mode="text"
              onPress={() => {
                if (activeCaptureSide === "front") {
                  setActiveCaptureSide(null);
                  setField("idProofImage", "");
                } else {
                  setActiveCaptureSide(null);
                  setField("idProofBackImage", "");
                }
              }}
            >
              CLEAR
            </Button>
          </View>
        </View>
      );
    }

    return (
      <Pressable
        style={styles.docCard}
        onPress={async () => {
          if (!permission?.granted) await requestPermission();
          setActiveCaptureSide(side);
        }}
      >
        {imageData ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${imageData}` }}
            style={styles.docImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholder}>
            <MaterialCommunityIcons
              name="card-account-details-outline"
              size={32}
              color={theme.colors.primary}
              style={{ marginBottom: 8, opacity: 0.5 }}
            />
            <Text style={styles.placeholderTitle}>
              {side.toUpperCase()} SCAN
            </Text>
            <Text style={styles.placeholderSub}>Tap to open scanner</Text>
          </View>
        )}
      </Pressable>
    );
  };

  const saveDocImage = async (uri: string, side: DocSide) => {
    const base64 = await processImage(uri);

    if (side === "front") {
      setField("idProofImage", base64);
    } else {
      setField("idProofBackImage", base64);
    }
  };

  const pickFromGallery = async (side: DocSide) => {
    setDocLoading(true);

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!res.canceled) {
      await saveDocImage(res.assets[0].uri, side);
    }

    setDocLoading(false);
  };
  const styles = React.useMemo(() => makeStyle(theme), [theme]);

  const isFormValid =
    name && company && address && idProofId && (idProofNumber || idProofImage);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <StepIndicator step={3} total={5} title="Guest Profile" />
      <ConfirmDialog
        visible={showConfirm}
        message="Are you want go back to home?"
        confirmText="Ok"
        cancelText="Cancel"
        onConfirm={onConfirmExit}
        onCancel={() => setShowConfirm(false)}
        isApproveLoading={false}
        isRejectLoading={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets
      >
        <Text style={styles.sectionTitle}>BASIC INFORMATION</Text>
        <View style={styles.inputGroup}>
          <TextInput
            mode="flat"
            label="Full Name"
            value={name}
            onChangeText={(v) => setField("name", v)}
            textColor="#FFF"
            activeUnderlineColor="#C5A059"
            style={styles.input}
          />
          <TextInput
            mode="flat"
            label="Company / Organization"
            value={company}
            onChangeText={(v) => setField("company", v)}
            textColor="#FFF"
            activeUnderlineColor="#C5A059"
            style={styles.input}
          />
          <TextInput
            mode="flat"
            label="Residential Address"
            value={address}
            onChangeText={(v) => setField("address", v)}
            textColor="#FFF"
            activeUnderlineColor="#C5A059"
            style={styles.input}
          />
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>
          DOCUMENTATION
        </Text>
        <View style={styles.inputGroup}>
          <AppDropdown
            label="Identification Type"
            placeholder="Select ID Type"
            open={idOpen} // You'll need to add: const [idOpen, setIdOpen] = useState(false);
            setOpen={setIdOpen}
            value={idProofId}
            setValue={(callback) => {
              // DropdownPicker uses a callback for setValue
              const val =
                typeof callback === "function" ? callback(idProofId) : callback;
              handleSelect(val);
            }}
            items={dropdownList}
            error={errors.idProofId}
          />
          {idProofId && (
            <TextInput
              mode="flat"
              label="ID Number"
              value={idProofNumber}
              onChangeText={(v) => setField("idProofNumber", v)}
              textColor="#FFF"
              activeUnderlineColor="#C5A059"
              style={styles.input}
            />
          )}
        </View>

        {idProofId && (
          <View style={styles.uploadSection}>
            <Text style={styles.uploadLabel}>DOCUMENT — FRONT & BACK</Text>
            <View style={styles.docGrid}>
              {renderDocSlot("front", idProofImage)}
              {renderDocSlot("back", idProofBackImage)}
            </View>

            {/* Gallery fallbacks remain same */}
            <View style={styles.galleryRow}>
              <Button
                mode="text"
                onPress={() => pickFromGallery("front")}
                textColor={theme.colors.primary}
              >
                FROM GALLERY (FRONT)
              </Button>
              <Button
                mode="text"
                onPress={() => pickFromGallery("back")}
                textColor={theme.colors.primary}
              >
                FROM GALLERY (BACK)
              </Button>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          disabled={!isFormValid || docLoading}
          onPress={handleNext}
          style={styles.nextButton}
          contentStyle={styles.nextButtonContent}
          labelStyle={styles.nextButtonLabel}
        >
          CONTINUE
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default Details;

export const makeStyle = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 24,
    },

    scrollContent: {
      paddingVertical: 20,
    },

    sectionTitle: {
      color: theme.colors.primary,
      fontSize: 11,
      letterSpacing: 2,
      fontWeight: "700",
      marginBottom: 16,
    },

    inputGroup: {
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
    },

    input: {
      backgroundColor: "transparent",
      marginBottom: 4,
    },

    uploadSection: {
      marginTop: 32,
    },

    uploadLabel: {
      color: theme.colors.onSurfaceVariant,
      fontSize: 10,
      letterSpacing: 1.5,
      marginBottom: 12,
    },

    uploadRow: {
      flexDirection: "row",
      gap: 12,
    },

    uploadBtn: {
      flex: 1,
      borderRadius: 4,
      borderColor: theme.colors.primary,
    },

    previewContainer: {
      marginTop: 16,
      borderRadius: 12,
      overflow: "hidden",
      height: 180,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.surface,
    },

    docImage: {
      width: "100%",
      height: "100%",
    },

    footer: {
      paddingVertical: 24,
    },

    nextButton: {
      borderRadius: 0,
    },

    nextButtonContent: {
      height: 56,
    },

    nextButtonLabel: {
      color: theme.colors.onPrimary,
      fontWeight: "700",
      letterSpacing: 2,
    },

    placeholder: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      opacity: 0.6,
    },

    placeholderTitle: {
      fontSize: 12,
      letterSpacing: 2,
      fontWeight: "700",
      color: theme.colors.primary,
    },

    placeholderSub: {
      fontSize: 10,
      marginTop: 4,
      color: "#999",
    },

    galleryRow: {
      flexDirection: "column",
      justifyContent: "space-between",
      marginTop: 12,
    },
    captureFab: {
      position: "absolute",
      bottom: 8,
      alignSelf: "center",
      borderRadius: 20,
      height: 36,
    },
    closeBtn: {
      position: "absolute",
      top: 8,
      right: 8,
    },
    docGrid: {
      flexDirection: "column", // Vertical layout
      gap: 20,
    },
    docCard: {
      width: "100%",
      aspectRatio: 1.58, // ID Card Standard Ratio
      borderRadius: 16,
      borderWidth: 1,
      borderStyle: "dashed",
      borderColor: theme.colors.outlineVariant,
      backgroundColor: theme.colors.surfaceVariant,
      overflow: "hidden",
    },
    docCardActive: {
      width: "100%",
      aspectRatio: 1.58,
      borderRadius: 16,
      overflow: "hidden",
      backgroundColor: "#000",
    },
    guidelineOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.4)",
    },
    idFrame: {
      width: "100%",
      height: "100%",
      position: "relative",
    },
    frameCorner: {
      position: "absolute",
      width: 20,
      height: 20,
      borderColor: theme.colors.primary,
    },
    guidelineText: {
      color: "#FFF",
      fontSize: 10,
      fontWeight: "700",
      letterSpacing: 1.5,
      textShadowColor: "rgba(0, 0, 0, 0.75)",
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10,
    },
    cameraControls: {
      position: "absolute",
      bottom: 10,
      left: 0,
      right: 0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
    },
    shutterBtn: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: "rgba(255,255,255,0.3)",
      justifyContent: "center",
      alignItems: "center",
    },
    shutterInner: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#FFF",
    },
  });
