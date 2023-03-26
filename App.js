import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { theme } from "./color";

export default function App() {
    const [working, setWorking] = useState(true);
    const [text, setText] = useState("");
    const [todo, setTodo] = useState({});
    const travel = () => setWorking(false);
    const work = () => setWorking(true);
    const addToDo = () => {
        if (text === "") {
            return;
        }
        // 객체 결합 Object.assign 사용
        // const newTodo = Object.assign({}, todo, { [Date.now()]: { text: text, work: working } });

        // es6 ...사용
        const newTodo = { ...todo, [Date.now()]: { text: text, work: working } }; 
        setTodo(newTodo);
        setText("");
    };
    return (
        <View style={styles.container}>
            <StatusBar style="auto"></StatusBar>
            <View style={styles.header}>
                <TouchableOpacity onPress={work}>
                    <Text style={{ ...styles.btnText, color: working ? "white" : theme.gray }}>Work</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={travel}>
                    <Text style={{ ...styles.btnText, color: !working ? "white" : theme.gray }}>Travel</Text>
                </TouchableOpacity>
            </View>
            <TextInput
                onChangeText={(e) => setText(e)}
                onSubmitEditing={addToDo}
                returnKeyType="done"
                value={text}
                placeholder={working ? "무슨일 해야하니?!" : "어디로 여행가니?!"}
                style={styles.input}
            ></TextInput>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.bg,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: "row",
        marginTop: 100,
        justifyContent: "space-around",
    },
    btnText: {
        fontSize: 44,
        fontWeight: 600,
    },
    input: {
        backgroundColor: "white",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 15,
        marginTop: 20,
        fontSize: 18,
    },
});
