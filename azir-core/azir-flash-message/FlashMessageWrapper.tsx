import React from "react";
import { Dimensions, Platform, StyleSheet, Text } from "react-native";
import { useScreenDimensions, isIPad as _isIPad, isIphoneX, getStatusBarHeight } from "azir-helpers";

const isAndroid = Platform.OS === "android";

const isIPhoneX = isIphoneX();

const isIPad = _isIPad();

const isOrientationLandscape = ({ width, height }) => width > height;

let _customStatusBarHeight = null;
const statusBarHeight = (isLandscape = false) => {
  if (_customStatusBarHeight !== null) {
    return _customStatusBarHeight;
  }

  /**
   * This is a temporary workaround because we don't have a way to detect
   * if the status bar is translucent or opaque. If opaque, we don't need to
   * factor in the height here; if translucent (content renders under it) then
   * we do.
   */
  if (isAndroid) {
    if (global.Expo) {
      return global.Expo.Constants.statusBarHeight + 6;
    } else {
      return 6;
    }
  }

  if (isIPhoneX) {
    return isLandscape ? 0 : getStatusBarHeight(true);
  }

  if (isIPad) {
    return 20;
  }

  return isLandscape ? 0 : 20;
};

const doubleFromPercentString = percent => {
  if (!percent.includes("%")) {
    return 0;
  }

  const dbl = parseFloat(percent) / 100;

  if (isNaN(dbl)) return 0;

  return dbl;
};

/**
 * Helper function to "append" extra padding in MessageComponent style
 */
export function styleWithInset(style, wrapperInset, hideStatusBar = false, prop = "padding") {
  if (prop === "margin") {
    return styleWithInsetMargin(style, wrapperInset, hideStatusBar);
  }

  const { width: viewWidth } = Dimensions.get("window");

  let {
    padding = 0,
    paddingVertical = padding,
    paddingHorizontal = padding,
    paddingTop = paddingVertical,
    paddingBottom = paddingVertical,
    paddingLeft = paddingHorizontal,
    paddingRight = paddingHorizontal,
    ...viewStyle
  } = StyleSheet.flatten(style || {});

  if (typeof paddingTop !== "number") {
    paddingTop = doubleFromPercentString(paddingTop) * viewWidth;
  }

  if (typeof paddingBottom !== "number") {
    paddingBottom = doubleFromPercentString(paddingBottom) * viewWidth;
  }

  if (typeof paddingLeft !== "number") {
    paddingLeft = doubleFromPercentString(paddingLeft) * viewWidth;
  }

  if (typeof paddingRight !== "number") {
    paddingRight = doubleFromPercentString(paddingRight) * viewWidth;
  }

  return {
    ...viewStyle,
    paddingTop: !!wrapperInset.isIPhoneX || !hideStatusBar ? paddingTop + wrapperInset.insetTop : paddingTop,
    paddingBottom: paddingBottom + wrapperInset.insetBottom,
    paddingLeft: paddingLeft + wrapperInset.insetLeft,
    paddingRight: paddingRight + wrapperInset.insetRight
  };
}

/**
 * Helper function to "append" extra margin in MessageComponent style
 */
export function styleWithInsetMargin(style, wrapperInset, hideStatusBar = false) {
  const { width: viewWidth } = Dimensions.get("window");
  let {
    margin = 0,
    marginVertical = margin,
    marginHorizontal = margin,
    marginTop = marginVertical,
    marginBottom = marginVertical,
    marginLeft = marginHorizontal,
    marginRight = marginHorizontal,
    ...viewStyle
  } = StyleSheet.flatten(style || {});

  if (typeof marginTop !== "number") {
    marginTop = doubleFromPercentString(marginTop) * viewWidth;
  }

  if (typeof marginBottom !== "number") {
    marginBottom = doubleFromPercentString(marginBottom) * viewWidth;
  }

  if (typeof marginLeft !== "number") {
    marginLeft = doubleFromPercentString(marginLeft) * viewWidth;
  }

  if (typeof marginRight !== "number") {
    marginRight = doubleFromPercentString(marginRight) * viewWidth;
  }

  return {
    ...viewStyle,
    marginTop: !!wrapperInset.isIPhoneX || !hideStatusBar ? marginTop + wrapperInset.insetTop : marginTop,
    marginBottom: marginBottom + wrapperInset.insetBottom,
    marginLeft: marginLeft + wrapperInset.insetLeft,
    marginRight: marginRight + wrapperInset.insetRight
  };
}

const FlashMessageWrapper: React.FC<Props> = props => {
  const setStatusBarHeight = height => {
    _customStatusBarHeight = height;
  };
  const { position, children } = props;
  const onChangeScreenDimensions = data => {
    //incase want to do action on oriantaion change
  };
  const screenData = useScreenDimensions(onChangeScreenDimensions);
  const isLandscape = screenData.isLandscape;
  const _statusBarHeight = statusBarHeight(isLandscape);

  const wrapper = {
    isLandscape,
    isIPhoneX: isIPhoneX,
    isIPad: isIPad,
    statusBarHeight: _statusBarHeight,
    insetTop: position === "top" ? _statusBarHeight : 0,
    insetLeft: (position === "top" || position === "bottom") && isLandscape ? (isIPhoneX ? 21 : 0) : 0,
    insetRight: (position === "top" || position === "bottom") && isLandscape ? (isIPhoneX ? 21 : 0) : 0,
    insetBottom: isIPhoneX && position === "bottom" ? (isLandscape ? 24 : 34) : isAndroid ? 2 : 0
  };
  return children(wrapper);
};
type Props = {
  position: string | "top" | "bottom" | "center";
  children: any;
};
FlashMessageWrapper.defaultProps = { position: "top" };
export default FlashMessageWrapper;