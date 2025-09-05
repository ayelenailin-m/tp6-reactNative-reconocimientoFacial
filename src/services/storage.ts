import AsyncStorage from "@react-native-async-storage/async-storage";

const FACE_REGISTERED_KEY = "@face_registered";
const USER_CUIL_KEY = "@user_cuil";

export async function setFaceRegistered(flag: boolean) {
  await AsyncStorage.setItem(FACE_REGISTERED_KEY, flag ? "1" : "0");
}

export async function getFaceRegistered(): Promise<boolean> {
  const v = await AsyncStorage.getItem(FACE_REGISTERED_KEY);
  return v === "1";
}

export async function setUserCUIL(cuil: string) {
  await AsyncStorage.setItem(USER_CUIL_KEY, cuil);
}

export async function getUserCUIL(): Promise<string | null> {
  return AsyncStorage.getItem(USER_CUIL_KEY);
}
