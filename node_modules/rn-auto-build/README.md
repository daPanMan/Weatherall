# rn-auto-build

react native 自动打包

## ios使用方法

1. 因为ios的打包参数及其复杂，每个项目都会有一些差异，所以为了保证能准确无误地打包出符合要求的app，您需要手动执行一次打adhoc 包并且导出adhoc ipa ，将 目录下的 ExportOptionns.plist文件拷贝到RN 项目根目录下的 ios-export 文件夹下，并将plist文件改名 ad-hoc.plist

2. 在 rn 项目的 根目录执行 

```bash
npm install rn-auto-build --save-dev
```

3. 在 rn 根目录，执行ios打包命令

```bash
npx build-ios-ipa
```

## android使用方法

1. 在 rn 根目录，执行android打包命令

```bash
npx build-android
```
