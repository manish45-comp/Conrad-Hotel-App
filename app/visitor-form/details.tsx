import { AppDropdown } from "@/components/common/AppDropdown";
import { StepIndicator } from "@/components/common/StepIndicator";
import { getIdProofTypes } from "@/src/api/services/visitorSelfRegistration.service";
import { useBackButtonhandler } from "@/src/hooks/useBackButtonhandler";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { useVisitorFormStore } from "@/src/stores/useVisitorFormStore";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Image, ScrollView, StatusBar, StyleSheet, View } from "react-native";
import {
  Button,
  MD3Theme,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type IdProofType = {
  id: string;
  name: string;
};

const Details = () => {
  const {
    name,
    company,
    address,
    idProofNumber,
    idProofId,
    idProofImage,
    setField,
  } = useVisitorFormStore();

  const { user } = useAuthStore();
  const theme = useTheme();

  useBackButtonhandler();

  const [idProofTypes, setIdProofTypes] = useState<IdProofType[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [docLoading, setDocLoading] = useState(false);

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
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true },
    );
    return result.base64!;
  };

  const pickFromGallery = async () => {
    setDocLoading(true);
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!res.canceled) {
      const base64 = await processImage(res.assets[0].uri);
      setField("idProofImage", base64);
    }
    setDocLoading(false);
  };

  const captureFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!res.canceled) {
      const base64 = await processImage(res.assets[0].uri);
      setField("idProofImage", base64);
    }
  };

  const isFormValid =
    name && company && address && idProofId && (idProofNumber || idProofImage);

  const styles = React.useMemo(() => makeStyle(theme), [theme]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <StepIndicator step={3} total={5} title="Guest Profile" />

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
            <Text style={styles.uploadLabel}>DOCUMENT ATTACHMENT</Text>
            <View style={styles.uploadRow}>
              <Button
                icon="camera-outline"
                mode="outlined"
                onPress={captureFromCamera}
                style={styles.uploadBtn}
                textColor="#C5A059"
              >
                SNAP PHOTO
              </Button>
              <Button
                icon="image-outline"
                mode="outlined"
                onPress={pickFromGallery}
                style={styles.uploadBtn}
                textColor="#C5A059"
              >
                GALLERY
              </Button>
            </View>

            {idProofImage && (
              <Surface style={styles.previewContainer} elevation={4}>
                <Image
                  source={{ uri: `data:image/png;base64,${idProofImage}` }}
                  style={styles.docImage}
                  resizeMode="cover"
                />
              </Surface>
            )}
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
      backgroundColor: theme.colors.primary,
    },

    nextButtonContent: {
      height: 56,
    },

    nextButtonLabel: {
      color: theme.colors.onPrimary,
      fontWeight: "700",
      letterSpacing: 2,
    },
  });
