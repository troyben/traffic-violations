<template>
  <n-config-provider :theme="isDark ? darkTheme : null" :theme-overrides="themeOverrides">
    <n-notification-provider>
      <n-message-provider>
        <n-loading-bar-provider>
          <router-view></router-view>
        </n-loading-bar-provider>
      </n-message-provider>
    </n-notification-provider>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { NConfigProvider, NLoadingBarProvider, NNotificationProvider, NMessageProvider } from 'naive-ui'
import { darkTheme, GlobalThemeOverrides } from 'naive-ui'
import { ref, provide, computed } from 'vue'

const isDark = ref(false)
provide('theme-key', isDark)

const themeOverrides = computed<GlobalThemeOverrides>(() => ({
  common: {
    // Main colors
    primaryColor: '#0052CC',
    primaryColorHover: '#0065FF',
    primaryColorPressed: '#0747A6',
    primaryColorSuppl: '#0052CC',

    // Info colors
    infoColor: '#0052CC',
    infoColorHover: '#0065FF',
    infoColorPressed: '#0747A6',
    infoColorSuppl: '#0052CC',

    // Success colors
    successColor: '#36B37E',
    successColorHover: '#57D9A3',
    successColorPressed: '#00875A',
    successColorSuppl: '#36B37E',

    // Warning colors
    warningColor: '#FFAB00',
    warningColorHover: '#FFC400',
    warningColorPressed: '#FF991F',
    warningColorSuppl: '#FFAB00',

    // Error colors
    errorColor: '#FF5630',
    errorColorHover: '#FF7452',
    errorColorPressed: '#DE350B',
    errorColorSuppl: '#FF5630',

    // Border radius
    borderRadius: '6px',
    borderRadiusSmall: '4px',

    // Font sizes
    fontSizeTiny: '12px',
    fontSizeSmall: '14px',
    fontSize: '16px',
    fontSizeLarge: '18px',
    fontSizeHuge: '22px'
  },
  Button: {
    borderRadius: '4px',
    heightTiny: '24px',
    heightSmall: '32px',
    heightMedium: '40px',
    heightLarge: '48px',
    textColor: '#FFFFFF'
  },
  Card: {
    borderRadius: '8px',
    paddingSmall: '12px',
    paddingMedium: '20px',
    paddingLarge: '24px',
    color: isDark.value ? '#242424' : '#ffffff',
    colorModal: isDark.value ? '#242424' : '#ffffff',
    textColor: isDark.value ? '#ffffff' : '#333333'
  },
  Input: {
    borderRadius: '4px',
    heightTiny: '24px',
    heightSmall: '32px',
    heightMedium: '40px',
    heightLarge: '48px',
    borderHover: '#F4B183',
    borderFocus: '#F4B183',
    boxShadowFocus: '0 0 0 2px rgba(244, 177, 131, 0.2)'
  },
  Notification: {
    padding: '16px',
    titleFontSize: '16px',
    contentFontSize: '14px',
    borderRadius: '6px'
  },
  Layout: {
    color: isDark.value ? '#1a1a1a' : '#ffffff',
    headerColor: isDark.value ? '#242424' : '#ffffff',
    siderColor: isDark.value ? '#242424' : '#ffffff',
    textColor: isDark.value ? '#ffffff' : '#333333',
    textColorInverted: isDark.value ? '#333333' : '#ffffff',
    backgroundColor: isDark.value ? '#1a1a1a' : '#F5F5F5'
  },
  Menu: {
    itemTextColor: isDark.value ? '#e1e1e1' : '#333333',
    itemTextColorHover: isDark.value ? '#ffffff' : '#333333',
    itemTextColorActive: isDark.value ? '#ffffff' : '#333333',
    itemColorActive: isDark.value ? '#333333' : '#f5f5f5',
    itemColorActiveHover: isDark.value ? '#404040' : '#e5e5e5'
  },
  Select: {
    peers: {
      InternalSelection: {
        textColor: isDark.value ? '#ffffff' : '#333333',
        color: isDark.value ? '#242424' : '#ffffff',
        placeholderColor: isDark.value ? '#666666' : '#999999',
        border: isDark.value ? '1px solid #333333' : '1px solid #e5e5e5',
        borderHover: isDark.value ? '1px solid #444444' : '1px solid #d1d1d1',
        borderFocus: isDark.value ? '1px solid #444444' : '1px solid #d1d1d1',
      },
      InternalSelectMenu: {
        color: isDark.value ? '#242424' : '#ffffff',
        optionTextColor: isDark.value ? '#ffffff' : '#333333',
        optionColorHover: isDark.value ? '#333333' : '#f5f5f5',
        optionTextColorActive: isDark.value ? '#ffffff' : '#333333',
        optionColorActive: isDark.value ? '#333333' : '#f5f5f5'
      }
    }
  }
}))
</script>

<style>
</style>