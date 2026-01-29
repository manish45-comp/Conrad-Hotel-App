import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { Menu, TextInput, useTheme } from "react-native-paper";

interface Props {
  label: string;
  items: { label: string; value: string }[];
  value: string;
  onChange: (val: string) => void;
}

export default function DropDownSelect({
  label,
  items,
  value,
  onChange,
}: Props) {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();

  return (
    <View>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Pressable onPress={() => setVisible(true)}>
            <TextInput
              label={label}
              mode="outlined"
              value={value ? items.find((i) => i.value === value)?.label : ""}
              editable={false}
              right={<TextInput.Icon icon="menu-down" />}
            />
          </Pressable>
        }
      >
        {items.map((item) => (
          <Menu.Item
            key={item.value}
            title={item.label}
            onPress={() => {
              onChange(item.value);
              setVisible(false);
            }}
          />
        ))}
      </Menu>
    </View>
  );
}
