import React, { ForwardedRef, forwardRef, useCallback, useEffect, useState, useMemo } from 'react';
import BigN from 'bignumber.js';
import { useEC3Theme } from 'hooks/useEC3Theme';
import createStylesheet from './styles/Amount';
import Input, { InputProps } from 'components/design-system-ui/input';
import { Avatar, Button, Icon, Typography } from 'components/design-system-ui';
import i18n from 'utils/i18n/i18n';
import { setAdjustResize } from 'rn-android-keyboard-adjust';
import { Keyboard, TextInput, View } from 'react-native';

export const InvalidAmountValue = '__NAN__';
export const isInvalidAmountEctValue = (value: string) => {
  return value === InvalidAmountValue;
};

interface InputAmountProps extends Omit<InputProps, 'onChange' | 'onChangeText'> {
  decimals: number;
  onChangeValue: (value: string) => void;
  onInputChange?: () => void;
  showMaxButton?: boolean;
  forceUpdateValue?: { value: string | null }; // null means reset
  onSideEffectChange?: () => void; // callback for useEffect that change value
}

const isValidInput = (input: string) => {
  return !(isNaN(parseFloat(input)) || !input.match(/^-?\d*(\.\d+)?$/));
};

export const getInputValuesFromString: (input: string, power: number) => string = (input: string, power: number) => {
  const intValue = input.split('.')[0];
  let valueBigN = new BigN(isValidInput(intValue) ? intValue : '0');

  valueBigN = valueBigN.div(new BigN(10).pow(power));

  return valueBigN.toFixed();
};

export const getOutputValuesFromString: (input: string, power: number) => string = (input: string, power: number) => {
  if (!isValidInput(input)) {
    return InvalidAmountValue;
  }

  let valueBigN = new BigN(input);

  valueBigN = valueBigN.times(new BigN(10).pow(power));

  return valueBigN.toFixed().split('.')[0];
};

const Component = (props: InputAmountProps, ref: ForwardedRef<any>) => {
  const theme = useEC3Theme().swThemes;

  const {
    decimals,
    onChangeValue,
    onInputChange,
    forceUpdateValue,
    onSideEffectChange,
    value = '',
    inputStyle,
    containerStyle,
    ...inputProps
  } = props;
  const stylesheet = createStylesheet(theme);
  const [preservedDecimals, setPreservedDecimals] = useState(decimals);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState(value || '');

  // for Android keyboard
  useEffect(() => setAdjustResize(), []);

  const getMaxLengthText = useCallback(
    (_value: string) => {
      return _value.includes('.') ? decimals + 1 + _value.split('.')[0].length : 10;
    },
    [decimals],
  );

  const onChangeInput = useCallback(
    (_rawValue: string) => {
      setIsDirty(true);
      // if (!/^(0|[1-9]\d*)(\.\d*)?$/.test(_value)) {
      //   return;
      // }

      if (!_rawValue) {
        setInputValue('');
        onChangeValue('');

        return;
      }

      const _value = _rawValue.replace(/,/g, '.');

      if (isValidInput(_value)) {
        let currentValue = _value;
        const maxLength = getMaxLengthText(_value);
        if (_value.length > maxLength) {
          currentValue = _value.slice(0, maxLength);
        }

        setInputValue(currentValue);

        const transformVal = getOutputValuesFromString(currentValue, decimals);

        onChangeValue(transformVal);
      } else {
        onChangeValue(InvalidAmountValue);
      }
    },
    [decimals, getMaxLengthText, onChangeValue],
  );

  const _onInputChange = useCallback(
    (_value: string) => {
      onChangeInput(_value);
      onInputChange?.();
    },
    [onChangeInput, onInputChange],
  );

  useEffect(() => {
    if (isDirty && preservedDecimals !== decimals) {
      onChangeInput(inputValue);
      setPreservedDecimals(decimals);
      onSideEffectChange?.();
    }
  }, [preservedDecimals, decimals, inputValue, onChangeInput, isDirty, onSideEffectChange]);

  useEffect(() => {
    if (forceUpdateValue) {
      if (forceUpdateValue.value) {
        const transformVal = getInputValuesFromString(forceUpdateValue.value, decimals);

        setIsDirty(true);
        setInputValue(transformVal);
        onChangeValue(forceUpdateValue.value);
        onSideEffectChange?.();
      } else if (forceUpdateValue.value === null) {
        setIsDirty(false);
        setInputValue('');
      }
    }
  }, [decimals, forceUpdateValue, onChangeValue, onSideEffectChange]);

  const LeftPart = useMemo(() => {
    return (
      <>
        { (
          <View style={{marginLeft:10}}>
            <Avatar value={value || ''} size={24} />
          </View>
        )}
      </>
    );
  }, [
    value,
  ]);

  return (
    <>
      <Input
        ref={ref}
        // leftPart={LeftPart}
        autoCorrect={false}
        keyboardType={'decimal-pad'}
        returnKeyType={'done'}
        placeholder={inputProps.placeholder || i18n.common.amount}
        onChangeText={_onInputChange}
        defaultValue={inputValue}
        maxLength={getMaxLengthText(inputValue)}
        // autoFocus={true}
        {...inputProps}
        inputStyle={{
          textAlign: 'left',
          fontSize: 15,
          lineHeight: 30,
          paddingTop: 0,
          paddingBottom: 0,
          height: 50,}}
        containerStyle={{
          backgroundColor: 'transparent',}}
      />
    </>
  );
};

export const AmountEct = forwardRef(Component);