import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { getProductTypes } from "../libs/productType";

const CategorySelectButton = forwardRef(
  (
    {
      title,
      placeholder,
      onSelectCategory,
      selectedCategory,
      containerStyle,
    }: {
      title?: string;
      placeholder: string;
      onSelectCategory: (categoryId: string) => void;
      selectedCategory: string | null;
      containerStyle?: object;
    },
    ref,
  ) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCategories, setShowCategories] = useState(false);

    useEffect(() => {
      async function fetchCategories() {
        try {
          const data = await getProductTypes();
          setCategories(data.allCategories);
        } catch (err) {
          console.error("Error fetching categories", err);
          setError(err);
        } finally {
          setLoading(false);
        }
      }

      fetchCategories();
    }, []);

    useImperativeHandle(ref, () => ({
      getValue: () => selectedCategory,
    }));

    const handleCategoryPress = (categoryId: string) => {
      onSelectCategory(categoryId);
      setShowCategories(false);
    };

    if (loading) return <Text>Loading categories...</Text>;
    if (error) return <Text>Error loading categories</Text>;

    return (
      <View style={[styles.container, containerStyle]}>
        {title && <Text style={styles.title}>{title}</Text>}

        <TouchableOpacity
          onPress={() => setShowCategories(!showCategories)}
          style={styles.selectButton}
        >
          <Text style={styles.selectButtonText}>
            {selectedCategory
              ? categories.find((cat) => cat.id === selectedCategory)?.name
              : placeholder}
          </Text>
        </TouchableOpacity>

        {showCategories && (
          <ScrollView style={styles.dropdown} nestedScrollEnabled={true}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleCategoryPress(category.id)}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id &&
                    styles.selectedCategoryButton,
                ]}
              >
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    width: "75%",
    marginTop: 12,
    // border,
  },
  title: {
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 10,
  },
  selectButton: {
    width: "100%",
    backgroundColor: "#e1e8e8",
    height: 48,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  selectButtonText: {
    textAlign: "center",
    color: "#333",
  },
  dropdown: {
    marginTop: 10,
    // maxHeight: 200, // Limita la altura máxima del ScrollView para que se haga scroll si hay muchas categorías
  },
  categoryButton: {
    padding: 15,
    backgroundColor: "#f0f0f0",
    marginVertical: 5,
    borderRadius: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedCategoryButton: {
    backgroundColor: "#add8e6",
    borderColor: "#000",
  },
  categoryText: {
    fontSize: 16,
    color: "#333",
  },
});

export default CategorySelectButton;
