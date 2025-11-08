import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    Image,
    TouchableOpacity,
    useColorScheme,
} from 'react-native';
import {
    colors,
    commonStyles,
    recipeStyles,
    searchStyles,
    navigationStyles,
} from '../../styles/styles';

interface Recipe {
    id: string;
    title: string;
    imageUrl: string;
    isSaved: boolean;
}

const HomeFeedScreen: React.FC = () => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const theme = isDark ? colors.dark : colors.light;

    const [recipes, setRecipes] = useState<Recipe[]>([
        {
            id: '1',
            title: 'Marry Me Chicken Pot Pie',
            imageUrl: require('@assets/foodpictures/marrymepot.png'),
            isSaved: false,
        },
        {
            id: '2',
            title: 'One Pot Wonton Soup',
            imageUrl: require('@/assets/foodpictures/wonton.png'),
            isSaved: false,
        },
        {
            id: '3',
            title: 'Creamy Pasta Carbonara',
            imageUrl: require('@/assets/foodpictures/carbonara.png'),
            isSaved: false,
        },
    ]);

    const [activeTab, setActiveTab] = useState<'back' | 'home' | 'profile'>('home');

    const toggleSave = (recipeId: string) => {
        setRecipes(prevRecipes =>
            prevRecipes.map(recipe =>
                recipe.id === recipeId
                    ? { ...recipe, isSaved: !recipe.isSaved }
                    : recipe
            )
        );
    };

    return (
        <View style={[commonStyles.container, { backgroundColor: theme.background }]}>
            {/* Search Bar */}
            <View style={searchStyles.searchContainer}>
                <TextInput
                    style={[
                        searchStyles.searchInput,
                        {
                            backgroundColor: theme.inputBg,
                            color: theme.text,
                        },
                    ]}
                    placeholder="🔍 Search recipes..."
                    placeholderTextColor={theme.textSecondary}
                />
            </View>

            {/* Recipe Feed */}
            <ScrollView
                style={commonStyles.scrollContainer}
                contentContainerStyle={[commonStyles.contentContainer, { paddingBottom: 100 }]}
                showsVerticalScrollIndicator={false}
            >
                {recipes.map(recipe => (
                    <TouchableOpacity
                        key={recipe.id}
                        style={[
                            recipeStyles.recipeCard,
                            {
                                backgroundColor: theme.cardBg,
                                borderColor: theme.cardBorder,
                            },
                        ]}
                        activeOpacity={0.9}
                    >
                        <Image
                            source={{ uri: recipe.imageUrl }}
                            style={recipeStyles.recipeImage}
                            resizeMode="cover"
                        />
                        <View style={recipeStyles.recipeInfo}>
                            <Text
                                style={[
                                    recipeStyles.recipeTitle,
                                    { color: theme.text },
                                ]}
                            >
                                {recipe.title}
                            </Text>
                            <TouchableOpacity
                                style={[
                                    recipeStyles.saveIcon,
                                    {
                                        backgroundColor: recipe.isSaved
                                            ? theme.primary
                                            : 'rgba(255,255,255,0.3)',
                                        borderColor: recipe.isSaved
                                            ? theme.primary
                                            : 'rgba(255,255,255,0.5)',
                                    },
                                ]}
                                onPress={() => toggleSave(recipe.id)}
                            >
                                <Text style={recipeStyles.saveIconText}>
                                    {recipe.isSaved ? '❤️' : '🤍'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Bottom Navigation */}
            <View
                style={[
                    navigationStyles.bottomNav,
                    {
                        backgroundColor: theme.navBg,
                        borderTopColor: theme.cardBorder,
                    },
                ]}
            >
                <TouchableOpacity
                    style={[
                        navigationStyles.navBtn,
                        activeTab === 'back' && navigationStyles.navBtnActive,
                    ]}
                    onPress={() => setActiveTab('back')}
                >
                    <Text
                        style={[
                            navigationStyles.navBtnText,
                            { color: theme.text },
                        ]}
                    >
                        ←
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        navigationStyles.navBtn,
                        activeTab === 'home' && navigationStyles.navBtnActive,
                    ]}
                    onPress={() => setActiveTab('home')}
                >
                    <Text
                        style={[
                            navigationStyles.navBtnHomeText,
                            { color: theme.text },
                        ]}
                    >
                        🏠
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        navigationStyles.navBtn,
                        activeTab === 'profile' && navigationStyles.navBtnActive,
                    ]}
                    onPress={() => setActiveTab('profile')}
                >
                    <Text
                        style={[
                            navigationStyles.navBtnText,
                            { color: theme.text },
                        ]}
                    >
                        👤
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default HomeFeedScreen;