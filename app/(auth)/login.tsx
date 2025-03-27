import { View, Text, Image, TouchableOpacity, Animated } from "react-native";
import { styles } from "../../styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { useSSO } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

export default function Login() {
  const authImages = [
    require("../../assets/images/auth-image-1.png"),
    require("../../assets/images/auth-image-2.png"),
    require("../../assets/images/auth-image-3.png"),
  ];

  const [randomImage, setRandomImage] = useState(authImages[1]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * authImages.length);
    setRandomImage(authImages[randomIndex]);
  }, []);

  const { startSSOFlow } = useSSO();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
      });
      if (setActive && createdSessionId) {
        setActive({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("OAuth error:", error);
    }
  };

  const bounceValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: -10,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Brand Section */}
      <View style={styles.brandSection}>
        <Animated.View
          style={[
            styles.logoContainer,
            { transform: [{ translateY: bounceValue }] },
          ]}
        >
          <Ionicons name="leaf" size={32} color={COLORS.primary} />
        </Animated.View>
        <Text style={styles.appName}>spotlight</Text>
        <Text style={styles.tagline}>don't miss anything</Text>
      </View>

      {/* Auth Image */}
      <View style={styles.illustrationContainer}>
        <Image
          source={randomImage}
          style={styles.illustration}
          resizeMode="cover"
        />
      </View>

      {/* Login Section */}
      <View style={styles.loginSection}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
        >
          <View style={styles.googleIconContainer}>
            <Ionicons name="logo-google" size={20} color={COLORS.surface} />
          </View>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>
        <Text style={styles.termsText}>
          By continuing, you agree to our Terms and Privacy Policy
        </Text>
      </View>
    </View>
  );
}
