/**
 * Created by marno on 2017/3/13
 * Function: 程序主入口
 * Desc: 在这里做一些全局配置，比如全局 Navigator配置，全局变量初始化等。
 */

import React, {Component} from 'react';
import {View, Text, StyleSheet, AppRegistry} from 'react-native';

export default class Index extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    欢迎使用 React Native!
                </Text>
                <Text style={styles.instructions}>
                    修改 app/index.js 开始代码编写
                </Text>
                <Text style={styles.instructions}>
                    双击 Ctrl+R 重载界面,{'\n'}
                    ctrl+m 调出 dev 菜单,{'\n'}
                    Androd 真机调试需要打开悬浮窗权限,{'\n'}
                    然后摇晃手机调出 dev 菜单。
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

AppRegistry.registerComponent('RNTemplate', () => Index);
