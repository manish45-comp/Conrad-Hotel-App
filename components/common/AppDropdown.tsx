import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import DropDownPicker, {
  DropDownPickerProps,
  ValueType,
} from "react-native-dropdown-picker";
import { MD3Theme, Text, useTheme } from "react-native-paper";

interface AppDropdownProps extends Partial<DropDownPickerProps<ValueType>> {
  label?: string;
  open: boolean;
  value: ValueType | null;
  items: any[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  placeholder?: string;
  error?: string;
  searchable?: boolean;
  disabled?: boolean;
}

export const AppDropdown = ({
  label,
  open,
  value,
  items,
  setOpen,
  setValue,
  placeholder,

  error,
  ...rest
}: AppDropdownProps) => {
  const theme = useTheme();
  const styles = React.useMemo(() => makeStyles(theme), [theme]);

  const computedItems = React.useMemo(() => {
    return [{ label: "Clear Selection", value: null }, ...items];
  }, [items]);

  const isSearchable = rest.searchable ?? false;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.groupLabel}>{label.toUpperCase()}</Text>}

      <DropDownPicker
        open={open}
        value={value}
        items={computedItems}
        setOpen={setOpen}
        setValue={setValue}
        placeholder={placeholder ?? "Select an option"}
        listMode="MODAL"
        // --- MODAL STYLING ---
        modalProps={{
          animationType: "slide",
          presentationStyle: "overFullScreen", // Full dark immersion
        }}
        modalContentContainerStyle={{
          backgroundColor: "#1A1A1A", // Match app background
        }}
        // --- SEARCH STYLING ---
        searchContainerStyle={[
          styles.searchContainer,
          !isSearchable && { display: "none" },
        ]}
        searchTextInputStyle={styles.searchBar}
        searchPlaceholderTextColor="rgba(255,255,255,0.3)"
        // --- INPUT BOX STYLING ---
        style={[
          styles.picker,
          {
            borderBottomColor: error ? "#FF5252" : "rgba(197, 160, 89, 0.3)",
          },
        ]}
        textStyle={styles.mainText}
        arrowIconStyle={styles.arrowIcon}
        placeholderStyle={styles.placeholder}
        // --- LIST ITEM STYLING ---
        listItemContainerStyle={styles.listItem}
        listItemLabelStyle={styles.itemLabel}
        selectedItemContainerStyle={styles.selectedItem}
        selectedItemLabelStyle={styles.selectedItemLabel}
        // --- COMPONENTS ---
        TickIconComponent={() => (
          <MaterialCommunityIcons name="check" size={20} color="#C5A059" />
        )}
        renderHeader={() => (
          <View style={[styles.header, !isSearchable && { paddingBottom: 10 }]}>
            <View style={styles.headerRow}>
              <View />

              <Text style={styles.headerTitle}>
                SELECT {label?.toUpperCase()}
              </Text>

              <MaterialCommunityIcons
                name="close"
                size={22}
                color="#C5A059"
                onPress={() => setOpen(false)}
              />
            </View>

            {/* Only show handle spacing nicely */}
            <View style={[styles.handle, !isSearchable && { marginTop: 10 }]} />
          </View>
        )}
        closeIconStyle={{
          tintColor: "#C5A059",
        }}
        closeIconContainerStyle={{
          padding: 12,
        }}
        showCloseIcon={false}
        {...rest}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};
export const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      marginBottom: 20,
    },

    groupLabel: {
      color: theme.colors.primary,
      fontSize: 10,
      letterSpacing: 2,
      fontWeight: "700",
      marginBottom: 8,
      marginLeft: 4,
    },

    picker: {
      backgroundColor: "transparent",
      borderRadius: 0,
      borderWidth: 0,
      borderBottomWidth: 1,
      minHeight: 50,
    },

    mainText: {
      color: theme.colors.onSurface,
      fontSize: 16,
      fontWeight: "400",
    },

    placeholder: {
      color: theme.colors.onSurfaceVariant,
      fontSize: 16,
    },

    arrowIcon: {
      tintColor: theme.colors.primary,
    },

    header: {
      alignItems: "center",
      paddingVertical: 20,
      backgroundColor: theme.colors.background,
    },

    headerRow: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
    },

    headerTitle: {
      color: theme.colors.onSurface,
      fontSize: 12,
      letterSpacing: 3,
      marginTop: 15,
      opacity: 0.6,
    },

    handle: {
      width: 30,
      height: 3,
      borderRadius: 2,
      backgroundColor: theme.colors.primary,
      opacity: 0.4,
    },

    searchContainer: {
      backgroundColor: theme.colors.background,
      borderBottomColor: theme.colors.outlineVariant,
      paddingHorizontal: 20,
      paddingBottom: 15,
    },

    searchBar: {
      borderRadius: 4,
      backgroundColor: theme.colors.surfaceVariant,
      color: theme.colors.onSurface,
      borderWidth: 0,
      height: 45,
    },

    listItem: {
      height: 60,
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.surfaceContainerHigh,
    },

    itemLabel: {
      fontSize: 15,
      color: theme.colors.onSurfaceVariant,
    },

    selectedItem: {
      backgroundColor: theme.colors.surfaceVariant,
    },

    selectedItemLabel: {
      color: theme.colors.primary,
      fontWeight: "600",
    },

    errorText: {
      color: theme.colors.error,
      fontSize: 11,
      marginTop: 6,
      marginLeft: 4,
    },
  });
