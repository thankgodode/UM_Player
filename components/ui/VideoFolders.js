import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function VideoFolders() {
    const styles = createStyles()

    return (
        <View style={{
                height: 500,
                marginLeft: 15,
                marginRight: 15,
            }}
        >
            <View style={styles.top}>
                <Text>6 FOLDERS</Text>
                <TouchableOpacity><MaterialCommunityIcons name="sort" size={20} /></TouchableOpacity>
            </View>
            <ScrollView
                contentContainerStyle={styles.container} 
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.foldersWrapper}>
                    <TouchableOpacity style={styles.folder}>
                        <MaterialCommunityIcons name="folder" size={25} color="#9c9c9c"/>
                        <Text style={{fontSize:16}}>StatusSaver</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialIcons name="more-vert" size={24}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.foldersWrapper}>
                    <TouchableOpacity style={styles.folder}>
                        <MaterialCommunityIcons name="folder" size={25} color="#9c9c9c"/>
                        <Text style={{fontSize:16}}>WhatsApp Videos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialIcons name="more-vert" size={24}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.foldersWrapper}>
                    <TouchableOpacity style={styles.folder}>
                        <MaterialCommunityIcons name="folder" size={25} color="#9c9c9c"/>
                        <Text style={{fontSize:16}}>WhatsApp Videos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialIcons name="more-vert" size={24}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.foldersWrapper}>
                    <TouchableOpacity style={styles.folder}>
                        <MaterialCommunityIcons name="folder" size={25} color="#9c9c9c"/>
                        <Text style={{fontSize:16}}>WhatsApp Videos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialIcons name="more-vert" size={24}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.foldersWrapper}>
                    <TouchableOpacity style={styles.folder}>
                        <MaterialCommunityIcons name="folder" size={25} color="#9c9c9c"/>
                        <Text style={{fontSize:16}}>WhatsApp Videos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialIcons name="more-vert" size={24}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.foldersWrapper}>
                    <TouchableOpacity style={styles.folder}>
                        <MaterialCommunityIcons name="folder" size={25} color="#9c9c9c"/>
                        <Text style={{fontSize:16}}>WhatsApp Videos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialIcons name="more-vert" size={24}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.foldersWrapper}>
                    <TouchableOpacity style={styles.folder}>
                        <MaterialCommunityIcons name="folder" size={25} color="#9c9c9c"/>
                        <Text style={{fontSize:16}}>Videos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialIcons name="more-vert" size={24}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.foldersWrapper}>
                    <TouchableOpacity style={styles.folder}>
                        <MaterialCommunityIcons name="folder" size={25} color="#9c9c9c"/>
                        <Text style={{fontSize:16}}>Videos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialIcons name="more-vert" size={24}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.foldersWrapper}>
                    <TouchableOpacity style={styles.folder}>
                        <MaterialCommunityIcons name="folder" size={25} color="#9c9c9c"/>
                        <Text style={{fontSize:16}}>Videos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialIcons name="more-vert" size={24}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.foldersWrapper}>
                    <TouchableOpacity style={styles.folder}>
                        <MaterialCommunityIcons name="folder" size={25} color="#9c9c9c"/>
                        <Text style={{fontSize:16}}>Videos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialIcons name="more-vert" size={24}/>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

function createStyles() {
    return StyleSheet.create({
        container: {
            paddingBottom:20,
            // flexDirection:"column",
        },
        top: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
            marginTop: 35,
            
        },
        folder: {
            flexDirection: "row",
            alignItems: "center",
            gap: 15
        },
        foldersWrapper: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom:25
        }
    })
}