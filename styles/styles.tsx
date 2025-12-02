import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const colors = Colors;

// Color Palette
// export const colors = {
//   light: {
//     background: '#f5f5dc',
//     backgroundGradient: '#fff8dc',
//     primary: '#8fbc8f', // Granny Smith Apple green
//     primaryDark: '#6b9d6b',
//     text: '#2a2a2a',
//     textSecondary: '#666',
//     cardBg: 'rgba(255,255,255,0.4)',
//     cardBorder: 'rgba(255,255,255,0.3)',
//     inputBg: 'rgba(255,255,255,0.4)',
//     divider: 'rgba(0,0,0,0.05)',
//     navBg: 'rgba(255,255,255,0.95)',
//   },
//   dark: {
//     background: '#2a2a2a',
//     backgroundGradient: '#1a1a1a',
//     primary: '#8b4789', // Boysenberry/Jam purple
//     primaryDark: '#6b3567',
//     text: '#fff',
//     textSecondary: '#999',
//     cardBg: 'rgba(0,0,0,0.2)',
//     cardBorder: 'rgba(255,255,255,0.1)',
//     inputBg: 'rgba(255,255,255,0.1)',
//     divider: 'rgba(255,255,255,0.05)',
//     navBg: 'rgba(0,0,0,0.95)',
//   },
// };

// Common Styles
export const commonStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },

  // Card Styles
  card: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
  },
  cardContent: {
    padding: 15,
  },
  glassCard: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
  },

  // Text Styles
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
  },
  small: {
    fontSize: 12,
  },

  // Button Styles
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  // Input Styles
  input: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    fontSize: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },

  // Avatar Styles
  avatar: {
    borderRadius: 25,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarSmall: {
    width: 40,
    height: 40,
  },
  avatarMedium: {
    width: 50,
    height: 50,
  },
  avatarLarge: {
    width: 80,
    height: 80,
  },

  // Layout Helpers
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flexCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Spacing
  mt5: { marginTop: 5 },
  mt10: { marginTop: 10 },
  mt15: { marginTop: 15 },
  mt20: { marginTop: 20 },
  mt25: { marginTop: 25 },
  mb5: { marginBottom: 5 },
  mb10: { marginBottom: 10 },
  mb15: { marginBottom: 15 },
  mb20: { marginBottom: 20 },
  mb25: { marginBottom: 25 },
  ml5: { marginLeft: 5 },
  ml10: { marginLeft: 10 },
  ml15: { marginLeft: 15 },
  mr5: { marginRight: 5 },
  mr10: { marginRight: 10 },
  mr15: { marginRight: 15 },
  p10: { padding: 10 },
  p15: { padding: 15 },
  p20: { padding: 20 },
  ph10: { paddingHorizontal: 10 },
  ph15: { paddingHorizontal: 15 },
  ph20: { paddingHorizontal: 20 },
  pv10: { paddingVertical: 10 },
  pv15: { paddingVertical: 15 },
  pv20: { paddingVertical: 20 },

  // Shadow
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  shadowLight: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
});

// Bottom Navigation Styles
export const navigationStyles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 24,
    borderTopWidth: 1,
  },
  navBtn: {
    padding: 5,
    opacity: 0.6,
  },
  navBtnActive: {
    opacity: 1,
  },
  navBtnText: {
    fontSize: 22,
  },
  navBtnHomeText: {
    fontSize: 26,
  },
});

// Recipe Card Styles
export const recipeStyles = StyleSheet.create({
  recipeCard: {
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
  },
  recipeImage: {
    width: "100%",
    height: 320,
  },
  recipeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  saveIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  saveIconText: {
    fontSize: 18,
  },
  recipeHero: {
    width: "100%",
    height: 350,
    position: "relative",
  },
  recipeHeroImg: {
    width: "100%",
    height: "100%",
  },
  saveBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtnText: {
    fontSize: 24,
  },
});

// Recipe Detail Styles
export const recipeDetailStyles = StyleSheet.create({
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
  },
  recipeContent: {
    padding: 20,
    paddingBottom: 100,
  },
  timeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 25,
  },
  timeInfoText: {
    fontSize: 16,
  },
  timeInfoBold: {
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 25,
    marginBottom: 15,
  },
  originalRecipe: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  ingredientList: {
    marginTop: 0,
  },
  ingredientItem: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingLeft: 25,
    borderBottomWidth: 1,
  },
  ingredientBullet: {
    position: "absolute",
    left: 8,
    fontWeight: "bold",
  },
  ingredientText: {
    fontSize: 16,
  },
  instructionItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 15,
    borderWidth: 1,
  },
  instructionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  stepNumber: {
    fontWeight: "700",
  },
  hashtags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 25,
  },
  hashtag: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  hashtagText: {
    fontSize: 14,
  },
});

// Profile Styles
export const profileStyles = StyleSheet.create({
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 30,
    gap: 15,
    borderBottomWidth: 1,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 5,
  },
  profileUsername: {
    fontSize: 15,
  },
  recipeSections: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  recipeSection: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  dropdownBtn: {
    padding: 5,
    fontSize: 16,
    opacity: 0.7,
  },
  recipeList: {
    borderRadius: 15,
    overflow: "hidden",
    maxHeight: 195,
    borderWidth: 1,
  },
  recipeListExpanded: {
    maxHeight: 600,
  },
  recipeItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
  },
  recipeBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  recipeItemName: {
    flex: 1,
    fontSize: 16,
  },
  recipeChevron: {
    fontSize: 18,
    marginLeft: 10,
  },
});

// Auth Styles (Sign In/Up)
export const authStyles = StyleSheet.create({
  welcomeScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  logoContainer: {
    marginBottom: 60,
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logoText: {
    fontSize: 64,
  },
  appName: {
    fontSize: 42,
    fontWeight: "700",
    marginBottom: 10,
  },
  appTagline: {
    fontSize: 16,
  },
  buttonGroup: {
    width: "100%",
    maxWidth: 280,
    gap: 15,
  },
  welcomeBtn: {
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  authModal: {
    width: "90%",
    maxWidth: 320,
    borderRadius: 30,
    padding: 40,
    paddingHorizontal: 30,
    borderWidth: 2,
  },
  closeBtn: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: "center",
    alignItems: "center",
  },
  closeBtnText: {
    fontSize: 20,
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  submitBtn: {
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  switchText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
  switchLink: {
    fontWeight: "600",
  },
});

// Search Styles
export const searchStyles = StyleSheet.create({
  searchContainer: {
    padding: 15,
    paddingTop: 20,
  },
  searchInput: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    fontSize: 15,
  },
});

export default {
  colors,
  commonStyles,
  navigationStyles,
  recipeStyles,
  recipeDetailStyles,
  profileStyles,
  authStyles,
  searchStyles,
};

