import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity, TouchableHighlight, Text, View } from "react-native";
import AzirTheme, { withAzir } from "azir-theme";

const renderContent = props => {
  const { outline, children, textColor, textTransform, textStyle, icon, loading, loadingSize, loadingColor, styles } = props;
  let content = children;
  const _textColor = textColor == "unknown" && outline ? "primary" : textColor == "unknown" ? "white" : textColor;
  const colorStyle = styles[_textColor];

  //outline && textColor!="white" && textColor="primary" abed
  const textStyles = [];
  textTransform && textStyles.push({ textTransform: textTransform });
  !colorStyle && textStyles.push({ color: _textColor });
  colorStyle && textStyles.push({ color: colorStyle.backgroundColor });
  textStyle && textStyles.push(textStyle); //add user custom style

  const isString = children && typeof children === "string"; //apply text transform
  if (loading) {
    const color = styles[loadingColor];

    return <ActivityIndicator size={loadingSize} color={color ? color.backgroundColor : loadingColor} />;
  }
  if (icon) {
    const flexDirection = AzirTheme.SETTINGS.RTL ? "row-reverse" : "row";
    return (
      <View
        style={{
          flexDirection: flexDirection,
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        {isString ? <Text style={textStyles}>{content as string}</Text> : content}
        {icon}
      </View>
    );
  }

  if (isString) return <Text style={textStyles}>{content as string}</Text>;
  return content;
};

const AzirButton: React.FC<Props> = props => {
  const {
    type,
    underlayColor,
    underlayStyle,
    onShowUnderlay,
    children,
    containerStyle,
    styles,
    color,
    outline,
    borderColor,
    borderWidth,
    disabled,
    radius,
    opacity,
    shadow,
    ...rest
  } = props;
  const colorStyle = styles[color];
  const containerStyles = [];

  containerStyles.push(styles.defaultButton);
  !outline && color && containerStyles.push(colorStyle);
  !outline && color && !colorStyle && containerStyles.push({ backgroundColor: color });
  radius && containerStyles.push({ borderRadius: radius });
  shadow && containerStyles.push(styles.shadow);
  if (borderWidth != 0) {
    const borderColorStyle = styles[borderColor];
    containerStyles.push({
      borderWidth: borderWidth,
      borderColor: borderColorStyle ? borderColorStyle.backgroundColor : borderColor
    });
  }
  if (outline && borderWidth == 0) {
    const borderColorStyle = styles[borderColor];
    containerStyles.push({
      borderWidth: 1,
      borderColor: borderColorStyle ? borderColorStyle.backgroundColor : borderColor
    });
  }
  containerStyle && containerStyles.push(containerStyle); //add user custom style

  if (type === "TouchableHighlight") {
    const [pressed, setPressed] = useState(false);
    const _underlayColor = styles[underlayColor];
    const underlayStyles = [...containerStyles];
    underlayStyle && underlayStyles.push(underlayStyle);
    return (
      <TouchableHighlight
        underlayColor={_underlayColor ? _underlayColor.backgroundColor : underlayColor}
        disabled={disabled}
        activeOpacity={opacity}
        style={pressed ? underlayStyles : containerStyles}
        onHideUnderlay={() => setPressed(false)}
        onShowUnderlay={() => setPressed(true)}
        {...rest}
      >
        {pressed && onShowUnderlay ? onShowUnderlay() : renderContent(props)}
      </TouchableHighlight>
    );
  }
  return (
    <TouchableOpacity disabled={disabled} activeOpacity={opacity} style={containerStyles} {...rest}>
      {renderContent(props)}
    </TouchableOpacity>
  );
};

//Props Type ? for optional props
type Props = {
  color: string | "primary" | "theme" | "error" | "warning" | "success" | "info" | "transparent"; //button background
  textColor: string | "primary" | "theme" | "error" | "warning" | "success" | "info" | "transparent";
  borderColor: string | "primary" | "theme" | "error" | "warning" | "success" | "info";
  loadingColor: string | "primary" | "theme" | "error" | "warning" | "success" | "info";
  borderWidth: number;
  radius: number;
  disabled: boolean;
  textTransform?: "lowercase" | "uppercase" | "capitalize";
  textStyle?: object;
  containerStyle?: object;
  shadow: boolean;
  Icon?: any;
  styles: any;
  loadingSize: number | "small" | "large";
  loading: boolean;
  opacity: number;
  outline: boolean;
  onPress: any;
  type: "TouchableOpacity" | "TouchableHighlight";
  onShowUnderlay: any;
  underlayColor: string | "primary" | "theme" | "error" | "warning" | "success" | "info";
  underlayStyle: any;
};
//default props 4
AzirButton.defaultProps = {
  color: "theme",
  textColor: "unknown", // this is just to set the default based on the outline prop
  borderColor: "theme",
  loadingColor: "theme",
  radius: AzirTheme.SIZES.BORDER_RADIUS,
  disabled: false,
  shadow: false,
  borderWidth: AzirTheme.SIZES.BORDER_WIDTH,
  loadingSize: "small",
  loading: false,
  outline: false,
  opacity: AzirTheme.SIZES.OPACITY,
  type: "TouchableOpacity",
  underlayColor: "theme"
};
//component stylesheet
const styles = theme =>
  StyleSheet.create({
    defaultButton: {
      borderRadius: 3,
      padding: 15,
      //width: theme.SIZES.BUTTON_WIDTH,
      //height: theme.SIZES.BUTTON_HEIGHT,
      alignItems: "center",
      justifyContent: "center"
    },
    shadow: {
      shadowColor: theme.COLORS.BLOCK,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: theme.SIZES.OPACITY,
      shadowRadius: theme.SIZES.BUTTON_SHADOW_RADIUS,
      elevation: theme.SIZES.ANDROID_ELEVATION
    },
    customText: {
      fontSize: theme.SIZES.FONT,
      color: theme.COLORS.WHITE
    },
    primary: {
      backgroundColor: theme.COLORS.PRIMARY
    },
    theme: {
      backgroundColor: theme.COLORS.THEME
    },
    info: {
      backgroundColor: theme.COLORS.INFO
    },
    error: {
      backgroundColor: theme.COLORS.ERROR
    },
    warning: {
      backgroundColor: theme.COLORS.WARNING
    },
    success: {
      backgroundColor: theme.COLORS.SUCCESS
    },
    transparent: {
      backgroundColor: theme.COLORS.TRANSPARENT
    },
    androidShadow: {
      elevation: theme.SIZES.ANDROID_ELEVATION
    }
  });
export default withAzir(AzirButton, styles);