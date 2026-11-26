import { getLocales } from 'expo-localization'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Storage } from '@lib/enums/Storage'
import { createMMKVStorage } from '@lib/storage/MMKV'

import en from './locales/en.json'
import id from './locales/id.json'
import ja from './locales/ja.json'
import ru from './locales/ru.json'
import zh from './locales/zh.json'

// import { I18nManager } from 'react-native' may be needed by rtl

const lang = getLocales()[0].languageCode ?? 'en'

type Language = {
    id: string
    label: string
    translation: object
}

export const supportedLanguages: Language[] = [
    {
        id: 'en',
        translation: en,
        label: 'English',
    },
    {
        id: 'ja',
        translation: ja,
        label: '日本語',
    },
    {
        id: 'zh',
        translation: zh,
        label: '简体中文',
    },
    {
        id: 'ru',
        translation: ru,
        label: 'Русский',
    },
    {
        id: 'id',
        translation: id,
        label: 'Bahasa Indonesia',
    },
]

type LanguageStoreProps = {
    language: string
    setLanguage: (lang: string) => void
}

export const useLanguageStore = create<LanguageStoreProps>()(
    persist(
        (set) => ({
            language: lang,
            setLanguage: (language: string) => set({ language }),
        }),
        {
            storage: createMMKVStorage(),
            name: Storage.Language,
            version: 1,
        }
    )
)

const supportedLanguageAsObject = Object.fromEntries(
    supportedLanguages.map(({ id: name, translation }) => [name, { translation: translation }])
)

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: supportedLanguageAsObject,
    lng: useLanguageStore.getState().language ?? lang,
    fallbackLng: 'en',

    interpolation: {
        escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
})

export default i18n
```[cite: 1]

---

### 4. 注意点

* **すでにアプリをインストールしていた場合:** 以前その端末でアプリを開いて言語設定が保存されていると、初回起動時の `lang` ではなく保存済みの言語が引き継がれることがあります。その場合はアプリ内の「言語を設定（Set Language）」から「日本語」を選び直してください[cite: 1]。
* **JSON の文法チェック:** `i18n.ts` 側が正しくても、`i18n/locales/ja.json` 側にカンマや引用符のミスがあると読み込みやビルドでエラーになります。

<ElicitationsGroup message="日本語化の登録まで進んだら、次のステップを選べます：">
  <Elicitation label="package.jsonを貼ってビルド設定" query="ChatterUI-jpのpackage.jsonの内容を貼るので、GitHub ActionsでAPKを自動ビルドする設定ファイルを作ってください。"/>
  <Elicitation label="自動モデル検索を止める箇所を確認" query="ChatterUI-jpでモデル検索や読み込みをしているコードを貼るので、自動検索を止める箇所を教えてください。"/>
</ElicitationsGroup>

<FollowUp label="次は package.json を貼って、GitHub Actions で APK をビルドする設定ファイルを作成しますか？" query="ChatterUI-jpのpackage.jsonの内容を貼るので、GitHub ActionsでAPKをビルドするためのワークフローファイルを作ってください。"/>
