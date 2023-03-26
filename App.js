import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { theme } from "./color";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@todo";

export default function App() {
    const [working, setWorking] = useState(true);
    const [text, setText] = useState("");
    const [todo, setTodo] = useState({});
    const travel = () => setWorking(false);
    const work = () => setWorking(true);
    const saveTodo = async (data) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.log(e);
        }
    };
    const loadTodo = async () => {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);
            if (data) {
                setTodo(JSON.parse(data));
            }
        } catch (e) {
            console.log(e);
        }
    };
    const deleteTodo = (id) => {
        Alert.alert("삭제할까요?", "정말로요?", [
            {
                text: "네",
                onPress: () => {
                    const newTodo = { ...todo };
                    delete newTodo[id];

                    setTodo(newTodo);
                    saveTodo(newTodo);
                },
            },
            {
                text: "아니요",
            },
        ]);
    };
    useEffect(() => {
        loadTodo();
    }, []);
    const addTodo = async () => {
        if (text === "") {
            return;
        }
        // 객체 결합 Object.assign 사용
        // const newTodo = Object.assign({}, todo, { [Date.now()]: { text: text, work: working } });

        // es6 ...사용
        const newTodo = { ...todo, [Date.now()]: { text: text, work: working } };
        setTodo(newTodo);
        await saveTodo(newTodo);
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
                onSubmitEditing={addTodo}
                returnKeyType="done"
                value={text}
                placeholder={working ? "무슨일 해야하니?!" : "어디로 여행가니?!"}
                style={styles.input}
            ></TextInput>
            <ScrollView>
                {Object.keys(todo).map((key) =>
                    working === todo[key].work ? (
                        <View key={key} style={styles.todo}>
                            <Text style={styles.todoText}>{todo[key].text}</Text>
                            <TouchableOpacity onPress={() => deleteTodo(key)}>
                                <Text>❌</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null
                )}
            </ScrollView>
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
        marginVertical: 20,
        fontSize: 18,
    },
    todo: {
        backgroundColor: theme.gray,
        marginBottom: 10,
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    todoText: {
        color: "white",
        fontSize: 16,
        fontWeight: 500,
    },
});
