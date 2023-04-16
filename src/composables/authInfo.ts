import {type Ref, ref} from 'vue'
import {PassageUser, type PassageUserInfo} from '@passageidentity/passage-elements/passage-user'

export function authInfo() {
  const isLoading = ref(true);
  const isAuthorized = ref(false);
  const authData: Ref<PassageUserInfo | undefined> = ref(undefined);

  try {
    new PassageUser().userInfo()
    .then((userInfo) => {
      isAuthorized.value = userInfo != null;
      authData.value = userInfo;
    })
    .catch(() => {
      isAuthorized.value = false;
    })
    .finally(() => {
      isLoading.value = false;
    });
  } catch (e) {
    isAuthorized.value = false;
    isLoading.value = false;
  }

  return {
    isLoading,
    isAuthorized,
  };
}