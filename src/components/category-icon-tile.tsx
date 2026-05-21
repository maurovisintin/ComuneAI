import { View } from "react-native";
import { C } from "@/design/tokens";
import { SvgIcon } from "@/components/icons/svg-icon";
import { categoryStyle } from "@/utils/categorise";

type Props = {
  category: string | null | undefined;
  size?: number;
};

export function CategoryIconTile({ category, size = 38 }: Props) {
  const style = categoryStyle(category);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 4,
        backgroundColor: C.bgSoft,
        borderWidth: 1,
        borderColor: C.borderSoft,
        alignItems: "center",
        justifyContent: "center",
      }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <SvgIcon name={style.iconName} size={18} color={style.accent} />
    </View>
  );
}
